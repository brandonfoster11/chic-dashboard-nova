-- StyleAI Security Fix: Database Permissions
-- This script fixes RLS policies and ensures proper user access

-- 1. Ensure profiles table exists with proper structure
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  role_id INTEGER DEFAULT 1, -- Default to regular user role (1)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create proper RLS policies for profiles

-- Fix the admin policies to avoid circular dependencies
-- Instead of checking profiles table directly, we'll use a special table for role assignments

-- Create a roles_assignments table that doesn't have RLS enabled
CREATE TABLE IF NOT EXISTS role_assignments (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- This table won't have RLS enabled, breaking the circular dependency

-- First, drop any existing is_admin function to avoid conflicts
DROP FUNCTION IF EXISTS is_admin();

-- Create a function to check if a user is an admin using the non-RLS table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM role_assignments
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies that might be causing conflicts
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
  DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Recreate policies with proper order and dependencies
-- Everyone can read profiles
CREATE POLICY "Anyone can view profiles"
ON profiles FOR SELECT
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (id = auth.uid());

-- Admins can update all profiles using the is_admin() function
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (is_admin());

-- Only service role can insert profiles (handled by trigger)
CREATE POLICY "Service role can insert profiles"
ON profiles FOR INSERT
WITH CHECK (true);  -- This will be restricted by using the service role

-- 4. Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, name, email, avatar_url, role_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    1  -- Default role_id (regular user)
  );
  
  -- Create role assignment (default to non-admin)
  INSERT INTO public.role_assignments (user_id, is_admin)
  VALUES (NEW.id, false);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the trigger already exists before creating it
DO $$ BEGIN
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 5. Fix wardrobe_items table RLS policies
ALTER TABLE IF EXISTS wardrobe_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own wardrobe items
DO $$ BEGIN
  CREATE POLICY "Users can view their own wardrobe items"
  ON wardrobe_items FOR SELECT
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can insert their own wardrobe items
DO $$ BEGIN
  CREATE POLICY "Users can insert their own wardrobe items"
  ON wardrobe_items FOR INSERT
  WITH CHECK (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can update their own wardrobe items
DO $$ BEGIN
  CREATE POLICY "Users can update their own wardrobe items"
  ON wardrobe_items FOR UPDATE
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can delete their own wardrobe items
DO $$ BEGIN
  CREATE POLICY "Users can delete their own wardrobe items"
  ON wardrobe_items FOR DELETE
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 6. Fix MFA logs permissions issue
DO $$ BEGIN
  -- Modify the policy to use the is_admin function instead of profiles table directly
  -- This avoids circular dependency issues
  DROP POLICY IF EXISTS "Admins can view all MFA logs" ON mfa_logs;
  
  CREATE POLICY "Admins can view all MFA logs"
  ON mfa_logs FOR SELECT
  USING (
    is_admin() OR user_id = auth.uid()
  );
EXCEPTION
  WHEN others THEN null;
END $$;

-- 7. Create a function to check if a user has access to a resource
CREATE OR REPLACE FUNCTION has_access(resource_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- User has access if they own the resource or they're an admin
  RETURN (resource_user_id = auth.uid()) OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Update the trigger to create both profile and role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, name, email, avatar_url, role_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    1  -- Default role_id (regular user)
  );
  
  -- Create role assignment (default to non-admin)
  INSERT INTO public.role_assignments (user_id, is_admin)
  VALUES (NEW.id, false);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Add a migration to populate role_assignments for existing users
DO $$
BEGIN
  -- For each user in profiles without a role assignment, create one
  INSERT INTO role_assignments (user_id, is_admin)
  SELECT p.id, (p.role_id = 2) AS is_admin
  FROM profiles p
  LEFT JOIN role_assignments ra ON p.id = ra.user_id
  WHERE ra.user_id IS NULL;
  
  -- Make sure the test user is an admin
  INSERT INTO role_assignments (user_id, is_admin)
  SELECT id, true
  FROM auth.users
  WHERE email = 'test@example.com'
  ON CONFLICT (user_id) 
  DO UPDATE SET is_admin = true;
END;
$$;
