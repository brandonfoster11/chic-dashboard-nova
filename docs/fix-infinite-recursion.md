# Fix for Infinite Recursion in Profiles RLS Policies

## Problem

The application is experiencing an error with the message:
```
infinite recursion detected in policy for relation "profiles"
```

This occurs because of a circular dependency in the Row Level Security (RLS) policies for the `profiles` table. The admin policies are trying to check if a user is an admin by referencing the `profiles` table itself, creating an infinite loop.

## Solution

To fix this issue, follow these steps in the Supabase Dashboard:

### 1. Create a Non-RLS Role Assignments Table

```sql
-- Create a role_assignments table that doesn't have RLS enabled
CREATE TABLE IF NOT EXISTS role_assignments (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Create an Admin Check Function

```sql
-- Drop any existing function to avoid conflicts
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
```

### 3. Drop Existing Policies on the Profiles Table

```sql
-- Drop all existing policies on the profiles table
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
```

### 4. Create New Policies Without Circular Dependencies

```sql
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
```

### 5. Populate the Role Assignments Table

```sql
-- Insert records for existing users
INSERT INTO role_assignments (user_id, is_admin)
SELECT id, role_id = 2 FROM profiles
ON CONFLICT (user_id) DO NOTHING;
```

### 6. Update the User Creation Trigger

```sql
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
```

## Implementation Steps

1. Log in to your Supabase Dashboard
2. Go to the SQL Editor
3. Copy and paste each SQL block above, one at a time
4. Execute each block in order
5. Verify that the error is resolved

## Testing

After implementing the fix, you should:

1. Verify that users can view their own profiles
2. Verify that users can update their own profiles
3. Verify that admins can view and update all profiles
4. Verify that new user registrations work correctly

## Notes

This solution breaks the circular dependency by:

1. Creating a separate table (`role_assignments`) that doesn't have RLS enabled
2. Using this table to determine admin status instead of checking the `profiles` table
3. Creating separate policies for regular users and admins to avoid conflicts

The `is_admin()` function provides a clean way to check admin status without causing circular dependencies in RLS policies.
