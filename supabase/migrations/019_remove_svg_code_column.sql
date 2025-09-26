-- Remove svg_code column from icons table since we're only using image_url now
-- This migration removes the svg_code column and updates the table structure

-- Drop the svg_code column
ALTER TABLE icons DROP COLUMN IF EXISTS svg_code;

-- Update the format column default to 'PNG' since we're only storing PNG images now
ALTER TABLE icons ALTER COLUMN format SET DEFAULT 'PNG';

-- Update existing records to have PNG format if they don't already
UPDATE icons SET format = 'PNG' WHERE format IS NULL OR format = 'SVG';
