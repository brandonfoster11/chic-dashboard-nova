-- StyleAI Database Schema
-- This schema defines the core tables and relationships for the StyleAI application
-- along with Row Level Security (RLS) policies for data protection

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
  onboarding_completed BOOLEAN DEFAULT FALSE,
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

-- PROFILES POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (id = auth.uid());

-- WARDROBE ITEMS POLICIES
-- Users can view their own wardrobe items
CREATE POLICY "Users can view their own wardrobe items"
ON wardrobe_items FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own wardrobe items
CREATE POLICY "Users can insert their own wardrobe items"
ON wardrobe_items FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own wardrobe items
CREATE POLICY "Users can update their own wardrobe items"
ON wardrobe_items FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own wardrobe items
CREATE POLICY "Users can delete their own wardrobe items"
ON wardrobe_items FOR DELETE
USING (user_id = auth.uid());

-- OUTFITS POLICIES
-- Users can view their own outfits or shared with them
CREATE POLICY "Users can view their own outfits or shared with them"
ON outfits FOR SELECT
USING (
  user_id = auth.uid() OR
  id IN (
    SELECT outfit_id FROM outfit_shares
    WHERE shared_with = auth.uid()
  )
);

-- Users can insert their own outfits
CREATE POLICY "Users can insert their own outfits"
ON outfits FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own outfits
CREATE POLICY "Users can update their own outfits"
ON outfits FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own outfits
CREATE POLICY "Users can delete their own outfits"
ON outfits FOR DELETE
USING (user_id = auth.uid());

-- OUTFIT ITEMS POLICIES
-- Users can view items in their own outfits or shared with them
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

-- Users can insert items to their own outfits
CREATE POLICY "Users can insert items to their own outfits"
ON outfit_items FOR INSERT
WITH CHECK (
  outfit_id IN (
    SELECT id FROM outfits
    WHERE user_id = auth.uid()
  )
);

-- Users can update items in their own outfits
CREATE POLICY "Users can update items in their own outfits"
ON outfit_items FOR UPDATE
USING (
  outfit_id IN (
    SELECT id FROM outfits
    WHERE user_id = auth.uid()
  )
);

-- Users can delete items from their own outfits
CREATE POLICY "Users can delete items from their own outfits"
ON outfit_items FOR DELETE
USING (
  outfit_id IN (
    SELECT id FROM outfits
    WHERE user_id = auth.uid()
  )
);

-- STYLE PREFERENCES POLICIES
-- Users can view their own style preferences
CREATE POLICY "Users can view their own style preferences"
ON style_preferences FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own style preferences
CREATE POLICY "Users can insert their own style preferences"
ON style_preferences FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own style preferences
CREATE POLICY "Users can update their own style preferences"
ON style_preferences FOR UPDATE
USING (user_id = auth.uid());

-- OUTFIT SHARES POLICIES
-- Users can view outfits shared by them or with them
CREATE POLICY "Users can view outfits shared by them or with them"
ON outfit_shares FOR SELECT
USING (shared_by = auth.uid() OR shared_with = auth.uid());

-- Users can share their own outfits
CREATE POLICY "Users can share their own outfits"
ON outfit_shares FOR INSERT
WITH CHECK (
  outfit_id IN (
    SELECT id FROM outfits
    WHERE user_id = auth.uid()
  )
);

-- Users can delete shares they created
CREATE POLICY "Users can delete shares they created"
ON outfit_shares FOR DELETE
USING (shared_by = auth.uid());

-- OUTFIT RECOMMENDATIONS POLICIES
-- Users can view their own recommendations
CREATE POLICY "Users can view their own recommendations"
ON outfit_recommendations FOR SELECT
USING (user_id = auth.uid());

-- Users can update their own recommendations (for feedback)
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
