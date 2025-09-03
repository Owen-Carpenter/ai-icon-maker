-- Fix icons table to have only one foreign key reference to auth.users.id

-- First, let's drop the table if it exists and recreate it properly
DROP TABLE IF EXISTS icons CASCADE;

-- Create icons table with only one foreign key reference
CREATE TABLE icons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  svg_code TEXT NOT NULL,
  prompt TEXT,
  style VARCHAR(100),
  color VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  format VARCHAR(10) DEFAULT 'SVG',
  file_size INTEGER,
  image_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX icons_user_id_idx ON icons(user_id);
CREATE INDEX icons_created_at_idx ON icons(created_at DESC);
CREATE INDEX icons_name_idx ON icons(name);
CREATE INDEX icons_tags_idx ON icons USING GIN(tags);
CREATE INDEX icons_is_favorite_idx ON icons(is_favorite);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_icons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_icons_updated_at_trigger
  BEFORE UPDATE ON icons
  FOR EACH ROW
  EXECUTE FUNCTION update_icons_updated_at();

-- Enable Row Level Security
ALTER TABLE icons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own icons" ON icons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own icons" ON icons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own icons" ON icons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own icons" ON icons
  FOR DELETE USING (auth.uid() = user_id);
