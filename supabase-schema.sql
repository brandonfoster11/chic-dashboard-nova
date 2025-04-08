-- Create wardrobe_items table
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  color TEXT NOT NULL,
  brand TEXT,
  image_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  favorite BOOLEAN DEFAULT false,
  wear_count INTEGER DEFAULT 0,
  last_worn TIMESTAMP WITH TIME ZONE,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  item_ids TEXT[] NOT NULL,
  image_url TEXT,
  occasion TEXT,
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies
-- This ensures users can only access their own data

-- RLS for wardrobe_items
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wardrobe items"
  ON wardrobe_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wardrobe items"
  ON wardrobe_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wardrobe items"
  ON wardrobe_items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wardrobe items"
  ON wardrobe_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS for outfits
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own outfits"
  ON outfits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outfits"
  ON outfits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits"
  ON outfits
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits"
  ON outfits
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS wardrobe_items_user_id_idx ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS outfits_user_id_idx ON outfits(user_id);
