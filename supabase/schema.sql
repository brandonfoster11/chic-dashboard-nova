-- StyleAI Database Schema
-- This schema defines the core tables and relationships for the StyleAI application
-- along with Row Level Security (RLS) policies for data protection

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES TABLE
-- Defines user roles for role-based access control
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) 
VALUES 
  ('user', 'Regular user with standard permissions'),
  ('admin', 'Administrator with full access to all features')
ON CONFLICT (name) DO NOTHING;

-- PROFILES TABLE
-- Extends the auth.users table with additional user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  style_preferences JSONB DEFAULT '{}',
  body_measurements JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add role_id column after profiles table is created
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id) DEFAULT 1;

-- WARDROBE ITEMS TABLE
-- Stores individual clothing items that belong to a user
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  color TEXT,
  pattern TEXT,
  brand TEXT,
  seasons TEXT[] DEFAULT '{}',
  formality INTEGER CHECK (formality BETWEEN 1 AND 5),
  size TEXT,
  condition TEXT,
  price DECIMAL(10,2),
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON wardrobe_items(user_id);

-- OUTFITS TABLE
-- Stores user-created outfits
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  occasion TEXT,
  season TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);

-- OUTFIT ITEMS TABLE
-- Links wardrobe items to outfits
CREATE TABLE IF NOT EXISTS outfit_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id UUID REFERENCES outfits(id) NOT NULL,
  wardrobe_item_id UUID REFERENCES wardrobe_items(id) NOT NULL,
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on outfit_id for faster queries
CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit_id ON outfit_items(outfit_id);

-- STYLE PREFERENCES TABLE
-- Stores user style preferences
CREATE TABLE IF NOT EXISTS style_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_style_preferences_user_id ON style_preferences(user_id);

-- OUTFIT SHARES TABLE
-- Manages outfit sharing between users
CREATE TABLE IF NOT EXISTS outfit_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id UUID REFERENCES outfits(id) NOT NULL,
  shared_by UUID REFERENCES profiles(id) NOT NULL,
  shared_with UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_outfit_shares_shared_by ON outfit_shares(shared_by);
CREATE INDEX IF NOT EXISTS idx_outfit_shares_shared_with ON outfit_shares(shared_with);

-- OUTFIT RECOMMENDATIONS TABLE
-- Stores outfit recommendations
CREATE TABLE IF NOT EXISTS outfit_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  outfit_id UUID REFERENCES outfits(id),
  recommendation_type TEXT NOT NULL,
  confidence_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_outfit_recommendations_user_id ON outfit_recommendations(user_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_recommendations ENABLE ROW LEVEL SECURITY;

-- OUTFITS POLICIES
-- Users can view their own outfits or shared with them
DO $$ BEGIN
  CREATE POLICY "outfits_view_own_or_shared"
  ON outfits FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM outfit_shares 
      WHERE outfit_shares.outfit_id = outfits.id 
      AND outfit_shares.shared_with = auth.uid()
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can insert their own outfits
DO $$ BEGIN
  CREATE POLICY "outfits_insert_own"
  ON outfits FOR INSERT
  WITH CHECK (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can update their own outfits
DO $$ BEGIN
  CREATE POLICY "outfits_update_own"
  ON outfits FOR UPDATE
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can delete their own outfits
DO $$ BEGIN
  CREATE POLICY "outfits_delete_own"
  ON outfits FOR DELETE
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all outfits
DO $$ BEGIN
  CREATE POLICY "outfits_admin_view_all"
  ON outfits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can update all outfits
DO $$ BEGIN
  CREATE POLICY "outfits_admin_update_all"
  ON outfits FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can delete all outfits
DO $$ BEGIN
  CREATE POLICY "outfits_admin_delete_all"
  ON outfits FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- OUTFIT ITEMS POLICIES
-- Users can view items in their own outfits or shared with them
DO $$ BEGIN
  CREATE POLICY "outfit_items_view_own_or_shared"
  ON outfit_items FOR SELECT
  USING (
    outfit_id IN (
      SELECT id FROM outfits 
      WHERE user_id = auth.uid() OR
      id IN (
        SELECT outfit_id FROM outfit_shares 
        WHERE shared_with = auth.uid()
      )
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can insert items to their own outfits
DO $$ BEGIN
  CREATE POLICY "outfit_items_insert_own"
  ON outfit_items FOR INSERT
  WITH CHECK (
    outfit_id IN (
      SELECT id FROM outfits 
      WHERE user_id = auth.uid()
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can update items in their own outfits
DO $$ BEGIN
  CREATE POLICY "outfit_items_update_own"
  ON outfit_items FOR UPDATE
  USING (
    outfit_id IN (
      SELECT id FROM outfits 
      WHERE user_id = auth.uid()
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can delete items from their own outfits
DO $$ BEGIN
  CREATE POLICY "outfit_items_delete_own"
  ON outfit_items FOR DELETE
  USING (
    outfit_id IN (
      SELECT id FROM outfits 
      WHERE user_id = auth.uid()
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all outfit items
DO $$ BEGIN
  CREATE POLICY "outfit_items_admin_view_all"
  ON outfit_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can update all outfit items
DO $$ BEGIN
  CREATE POLICY "outfit_items_admin_update_all"
  ON outfit_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can delete all outfit items
DO $$ BEGIN
  CREATE POLICY "outfit_items_admin_delete_all"
  ON outfit_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- STYLE PREFERENCES POLICIES
-- Users can view their own style preferences
DO $$ BEGIN
  CREATE POLICY "style_preferences_view_own"
  ON style_preferences FOR SELECT
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can insert their own style preferences
DO $$ BEGIN
  CREATE POLICY "style_preferences_insert_own"
  ON style_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can update their own style preferences
DO $$ BEGIN
  CREATE POLICY "style_preferences_update_own"
  ON style_preferences FOR UPDATE
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all style preferences
DO $$ BEGIN
  CREATE POLICY "style_preferences_admin_view_all"
  ON style_preferences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can update all style preferences
DO $$ BEGIN
  CREATE POLICY "style_preferences_admin_update_all"
  ON style_preferences FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- OUTFIT SHARES POLICIES
-- Users can view outfits shared by them or with them
DO $$ BEGIN
  CREATE POLICY "outfit_shares_view_own_or_shared"
  ON outfit_shares FOR SELECT
  USING (shared_by = auth.uid() OR shared_with = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can share their own outfits
DO $$ BEGIN
  CREATE POLICY "outfit_shares_insert_own"
  ON outfit_shares FOR INSERT
  WITH CHECK (
    outfit_id IN (
      SELECT id FROM outfits 
      WHERE user_id = auth.uid()
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can delete shares they created
DO $$ BEGIN
  CREATE POLICY "outfit_shares_delete_own"
  ON outfit_shares FOR DELETE
  USING (shared_by = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all outfit shares
DO $$ BEGIN
  CREATE POLICY "outfit_shares_admin_view_all"
  ON outfit_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can delete all outfit shares
DO $$ BEGIN
  CREATE POLICY "outfit_shares_admin_delete_all"
  ON outfit_shares FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- OUTFIT RECOMMENDATIONS POLICIES
-- Users can view their own recommendations
DO $$ BEGIN
  CREATE POLICY "outfit_recommendations_view_own"
  ON outfit_recommendations FOR SELECT
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can update their own recommendations
DO $$ BEGIN
  CREATE POLICY "outfit_recommendations_update_own"
  ON outfit_recommendations FOR UPDATE
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all outfit recommendations
DO $$ BEGIN
  CREATE POLICY "outfit_recommendations_admin_view_all"
  ON outfit_recommendations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can update all outfit recommendations
DO $$ BEGIN
  CREATE POLICY "outfit_recommendations_admin_update_all"
  ON outfit_recommendations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- PROFILES POLICIES
-- Users can view their own profile
DO $$ BEGIN
  CREATE POLICY "profiles_view_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all profiles
DO $$ BEGIN
  CREATE POLICY "profiles_admin_view_all"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can insert their own profile
DO $$ BEGIN
  CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can update their own profile
DO $$ BEGIN
  CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can update all profiles
DO $$ BEGIN
  CREATE POLICY "profiles_admin_update_all"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- WARDROBE ITEMS POLICIES
-- Users can view their own wardrobe items
DO $$ BEGIN
  CREATE POLICY "wardrobe_items_view_own"
  ON wardrobe_items FOR SELECT
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can insert their own wardrobe items
DO $$ BEGIN
  CREATE POLICY "wardrobe_items_insert_own"
  ON wardrobe_items FOR INSERT
  WITH CHECK (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can update their own wardrobe items
DO $$ BEGIN
  CREATE POLICY "wardrobe_items_update_own"
  ON wardrobe_items FOR UPDATE
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can delete their own wardrobe items
DO $$ BEGIN
  CREATE POLICY "wardrobe_items_delete_own"
  ON wardrobe_items FOR DELETE
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all wardrobe items
DO $$ BEGIN
  CREATE POLICY "wardrobe_items_admin_view_all"
  ON wardrobe_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can update all wardrobe items
DO $$ BEGIN
  CREATE POLICY "wardrobe_items_admin_update_all"
  ON wardrobe_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can delete all wardrobe items
DO $$ BEGIN
  CREATE POLICY "wardrobe_items_admin_delete_all"
  ON wardrobe_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
