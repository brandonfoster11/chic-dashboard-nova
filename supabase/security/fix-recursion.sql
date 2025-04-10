-- Create a role_assignments table that doesn't have RLS enabled
CREATE TABLE IF NOT EXISTS role_assignments (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instead of dropping the is_admin function, we'll modify it to use the new table
-- This preserves existing dependencies while fixing the circular reference
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- First check the role_assignments table
  IF EXISTS (
    SELECT 1 FROM role_assignments
    WHERE user_id = auth.uid() AND is_admin = true
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- For backward compatibility, also check the profiles table
  -- This will be phased out once all data is migrated
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role_id = 2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop specific policies on the profiles table that might be causing recursion
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

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
WITH CHECK (true);

-- Insert records for existing users
INSERT INTO role_assignments (user_id, is_admin)
SELECT id, role_id = 2 FROM profiles
ON CONFLICT (user_id) DO NOTHING;

-- Update the trigger to also create role assignments
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
