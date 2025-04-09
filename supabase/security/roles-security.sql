-- StyleAI Security Enhancement: Roles Table Security
-- This script enables RLS on the roles table and sets appropriate policies

-- Enable RLS on roles table
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create policy for reading roles (everyone can read roles)
DO $$ BEGIN
  CREATE POLICY "Anyone can view roles"
  ON roles FOR SELECT
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create policy for inserting/updating/deleting roles (admin only)
DO $$ BEGIN
  CREATE POLICY "Only admins can insert roles"
  ON roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Only admins can update roles"
  ON roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Only admins can delete roles"
  ON roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
