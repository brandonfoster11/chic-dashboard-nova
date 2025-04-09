-- 1. Create exec_sql function for running SQL statements
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- 2. Create schema inspection functions
CREATE OR REPLACE FUNCTION public.get_tables()
RETURNS TABLE (
  table_name text,
  table_type text,
  estimated_row_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::text as table_name,
    CASE 
      WHEN t.tablename ~ '^_' THEN 'Internal'
      ELSE 'User'
    END as table_type,
    COALESCE(s.n_live_tup, 0)::bigint as estimated_row_count
  FROM 
    pg_catalog.pg_tables t
  LEFT JOIN 
    pg_stat_user_tables s ON t.tablename = s.relname
  WHERE 
    t.schemaname = 'public'
  ORDER BY 
    t.tablename;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_policies()
RETURNS TABLE (
  table_name text,
  policy_name text,
  command text,
  roles text[],
  using_expression text,
  with_check_expression text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.tablename::text as table_name,
    p.policyname::text as policy_name,
    p.cmd::text as command,
    p.roles as roles,
    p.qual::text as using_expression,
    p.with_check::text as with_check_expression
  FROM
    pg_policies p
  WHERE
    p.schemaname = 'public'
  ORDER BY
    p.tablename, p.policyname;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_columns()
RETURNS TABLE (
  table_name text,
  column_name text,
  data_type text,
  is_nullable boolean,
  column_default text,
  is_identity boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.table_name::text,
    c.column_name::text,
    c.data_type::text,
    c.is_nullable = 'YES' as is_nullable,
    c.column_default::text,
    c.is_identity = 'YES' as is_identity
  FROM
    information_schema.columns c
  WHERE
    c.table_schema = 'public'
  ORDER BY
    c.table_name, c.ordinal_position;
END;
$$;

-- 3. Grant execute permissions
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_columns() TO authenticated;

-- 4. Create main schema
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
-- Extends the auth.users table with additional user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  style_preferences JSONB DEFAULT '{}',
  body_measurements JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
  image_url TEXT,
  purchase_date DATE,
  last_worn TIMESTAMPTZ,
  favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON wardrobe_items(user_id);

-- OUTFITS TABLE
-- Stores outfit combinations created by users
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  occasion TEXT,
  season TEXT,
  formality INTEGER CHECK (formality BETWEEN 1 AND 5),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  times_worn INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);

-- OUTFIT ITEMS TABLE
-- Junction table connecting outfits to wardrobe items
CREATE TABLE IF NOT EXISTS outfit_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES wardrobe_items(id) ON DELETE CASCADE NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(outfit_id, item_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_item_id ON outfit_items(item_id);

-- STYLE PREFERENCES TABLE
-- Stores user's style quiz results and preferences
CREATE TABLE IF NOT EXISTS style_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
  color_palette TEXT[] DEFAULT '{}',
  preferred_styles TEXT[] DEFAULT '{}',
  avoided_styles TEXT[] DEFAULT '{}',
  preferred_brands TEXT[] DEFAULT '{}',
  seasonal_preferences JSONB DEFAULT '{}',
  occasion_preferences JSONB DEFAULT '{}',
  quiz_results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_style_preferences_user_id ON style_preferences(user_id);

-- OUTFIT SHARES TABLE
-- Tracks outfits shared between users
CREATE TABLE IF NOT EXISTS outfit_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES profiles(id) NOT NULL,
  shared_with UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(outfit_id, shared_with)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_outfit_shares_outfit_id ON outfit_shares(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_shares_shared_by ON outfit_shares(shared_by);
CREATE INDEX IF NOT EXISTS idx_outfit_shares_shared_with ON outfit_shares(shared_with);

-- OUTFIT RECOMMENDATIONS TABLE
-- Stores AI-generated outfit recommendations
CREATE TABLE IF NOT EXISTS outfit_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  outfit_id UUID REFERENCES outfits(id),
  recommendation_type TEXT NOT NULL,
  occasion TEXT,
  season TEXT,
  confidence_score FLOAT,
  is_viewed BOOLEAN DEFAULT FALSE,
  is_saved BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_outfit_recommendations_user_id ON outfit_recommendations(user_id);

-- ROW LEVEL SECURITY POLICIES
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_recommendations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DO $$
BEGIN
  -- PROFILES POLICIES
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
    DROP POLICY "Users can view their own profile" ON profiles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    DROP POLICY "Users can update their own profile" ON profiles;
  END IF;

  -- WARDROBE ITEMS POLICIES
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wardrobe_items' AND policyname = 'Users can view their own wardrobe items') THEN
    DROP POLICY "Users can view their own wardrobe items" ON wardrobe_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wardrobe_items' AND policyname = 'Users can insert their own wardrobe items') THEN
    DROP POLICY "Users can insert their own wardrobe items" ON wardrobe_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wardrobe_items' AND policyname = 'Users can update their own wardrobe items') THEN
    DROP POLICY "Users can update their own wardrobe items" ON wardrobe_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wardrobe_items' AND policyname = 'Users can delete their own wardrobe items') THEN
    DROP POLICY "Users can delete their own wardrobe items" ON wardrobe_items;
  END IF;

  -- OUTFITS POLICIES
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfits' AND policyname = 'Users can view their own outfits or shared with them') THEN
    DROP POLICY "Users can view their own outfits or shared with them" ON outfits;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfits' AND policyname = 'Users can insert their own outfits') THEN
    DROP POLICY "Users can insert their own outfits" ON outfits;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfits' AND policyname = 'Users can update their own outfits') THEN
    DROP POLICY "Users can update their own outfits" ON outfits;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfits' AND policyname = 'Users can delete their own outfits') THEN
    DROP POLICY "Users can delete their own outfits" ON outfits;
  END IF;

  -- OUTFIT ITEMS POLICIES
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_items' AND policyname = 'Users can view items in their own outfits or shared with them') THEN
    DROP POLICY "Users can view items in their own outfits or shared with them" ON outfit_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_items' AND policyname = 'Users can insert items to their own outfits') THEN
    DROP POLICY "Users can insert items to their own outfits" ON outfit_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_items' AND policyname = 'Users can update items in their own outfits') THEN
    DROP POLICY "Users can update items in their own outfits" ON outfit_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_items' AND policyname = 'Users can delete items from their own outfits') THEN
    DROP POLICY "Users can delete items from their own outfits" ON outfit_items;
  END IF;

  -- STYLE PREFERENCES POLICIES
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'style_preferences' AND policyname = 'Users can view their own style preferences') THEN
    DROP POLICY "Users can view their own style preferences" ON style_preferences;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'style_preferences' AND policyname = 'Users can insert their own style preferences') THEN
    DROP POLICY "Users can insert their own style preferences" ON style_preferences;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'style_preferences' AND policyname = 'Users can update their own style preferences') THEN
    DROP POLICY "Users can update their own style preferences" ON style_preferences;
  END IF;

  -- OUTFIT SHARES POLICIES
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_shares' AND policyname = 'Users can view outfits shared by them or with them') THEN
    DROP POLICY "Users can view outfits shared by them or with them" ON outfit_shares;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_shares' AND policyname = 'Users can share their own outfits') THEN
    DROP POLICY "Users can share their own outfits" ON outfit_shares;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_shares' AND policyname = 'Users can delete shares they created') THEN
    DROP POLICY "Users can delete shares they created" ON outfit_shares;
  END IF;

  -- OUTFIT RECOMMENDATIONS POLICIES
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_recommendations' AND policyname = 'Users can view their own recommendations') THEN
    DROP POLICY "Users can view their own recommendations" ON outfit_recommendations;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfit_recommendations' AND policyname = 'Users can update their own recommendations') THEN
    DROP POLICY "Users can update their own recommendations" ON outfit_recommendations;
  END IF;
END $$;

-- Now create all policies
-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (id = auth.uid());

-- WARDROBE ITEMS POLICIES
CREATE POLICY "Users can view their own wardrobe items"
ON wardrobe_items FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own wardrobe items"
ON wardrobe_items FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own wardrobe items"
ON wardrobe_items FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own wardrobe items"
ON wardrobe_items FOR DELETE
USING (user_id = auth.uid());

-- OUTFITS POLICIES
CREATE POLICY "Users can view their own outfits or shared with them"
ON outfits FOR SELECT
USING (
  user_id = auth.uid() OR
  id IN (
    SELECT outfit_id FROM outfit_shares
    WHERE shared_with = auth.uid()
  )
);

CREATE POLICY "Users can insert their own outfits"
ON outfits FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own outfits"
ON outfits FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own outfits"
ON outfits FOR DELETE
USING (user_id = auth.uid());

-- OUTFIT ITEMS POLICIES
CREATE POLICY "Users can view items in their own outfits or shared with them"
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

CREATE POLICY "Users can insert items to their own outfits"
ON outfit_items FOR INSERT
WITH CHECK (
  outfit_id IN (
    SELECT id FROM outfits
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update items in their own outfits"
ON outfit_items FOR UPDATE
USING (
  outfit_id IN (
    SELECT id FROM outfits
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete items from their own outfits"
ON outfit_items FOR DELETE
USING (
  outfit_id IN (
    SELECT id FROM outfits
    WHERE user_id = auth.uid()
  )
);

-- STYLE PREFERENCES POLICIES
CREATE POLICY "Users can view their own style preferences"
ON style_preferences FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own style preferences"
ON style_preferences FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own style preferences"
ON style_preferences FOR UPDATE
USING (user_id = auth.uid());

-- OUTFIT SHARES POLICIES
CREATE POLICY "Users can view outfits shared by them or with them"
ON outfit_shares FOR SELECT
USING (shared_by = auth.uid() OR shared_with = auth.uid());

CREATE POLICY "Users can share their own outfits"
ON outfit_shares FOR INSERT
WITH CHECK (
  outfit_id IN (
    SELECT id FROM outfits
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete shares they created"
ON outfit_shares FOR DELETE
USING (shared_by = auth.uid());

-- OUTFIT RECOMMENDATIONS POLICIES
CREATE POLICY "Users can view their own recommendations"
ON outfit_recommendations FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own recommendations"
ON outfit_recommendations FOR UPDATE
USING (user_id = auth.uid());

-- TRIGGERS
-- Create a trigger to automatically create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    'https://ui-avatars.com/api/?name=' || encode(NEW.email::bytea, 'base64')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add the trigger to all tables with updated_at
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_wardrobe_items_updated_at
  BEFORE UPDATE ON wardrobe_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_outfits_updated_at
  BEFORE UPDATE ON outfits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_style_preferences_updated_at
  BEFORE UPDATE ON style_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FUNCTIONS
-- Function to get recommended outfits for a user
CREATE OR REPLACE FUNCTION get_recommended_outfits(user_id UUID)
RETURNS TABLE (
  outfit_id UUID,
  outfit_name TEXT,
  outfit_description TEXT,
  occasion TEXT,
  season TEXT,
  confidence_score FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.outfit_id,
    o.name as outfit_name,
    o.description as outfit_description,
    r.occasion,
    r.season,
    r.confidence_score
  FROM 
    outfit_recommendations r
  JOIN
    outfits o ON r.outfit_id = o.id
  WHERE 
    r.user_id = get_recommended_outfits.user_id
    AND r.is_saved = FALSE
  ORDER BY 
    r.created_at DESC, r.confidence_score DESC
  LIMIT 10;
END;
$$;
