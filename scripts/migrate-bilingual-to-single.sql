-- Migration script to transform bilingual content to single language
-- This script merges bilingual fields into single-language fields

-- 1. Update News table to merge bilingual content
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS title_new VARCHAR(255),
ADD COLUMN IF NOT EXISTS content_new TEXT,
ADD COLUMN IF NOT EXISTS excerpt_new VARCHAR(500);

-- Copy content data to new fields (merge or choose preferred content)
UPDATE news 
SET 
  title_new = COALESCE(title_es, title_en),
  content_new = COALESCE(content_es, content_en),
  excerpt_new = COALESCE(excerpt_es, excerpt_en)
WHERE title_es IS NOT NULL OR title_en IS NOT NULL;

-- Drop old columns and rename new ones
ALTER TABLE news DROP COLUMN IF EXISTS title_es;
ALTER TABLE news DROP COLUMN IF EXISTS title_en;
ALTER TABLE news DROP COLUMN IF EXISTS content_es;
ALTER TABLE news DROP COLUMN IF EXISTS content_en;
ALTER TABLE news DROP COLUMN IF EXISTS excerpt_es;
ALTER TABLE news DROP COLUMN IF EXISTS excerpt_en;

-- Rename to final columns
ALTER TABLE news RENAME COLUMN title_new TO title;
ALTER TABLE news RENAME COLUMN content_new TO content;
ALTER TABLE news RENAME COLUMN excerpt_new TO excerpt;

-- 2. Update Programs table to merge bilingual content
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS title_new VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_new TEXT,
ADD COLUMN IF NOT EXISTS overview_new TEXT,
ADD COLUMN IF NOT EXISTS objectives_new TEXT;

-- Copy content data to new fields
UPDATE programs 
SET 
  title_new = COALESCE(title_es, title_en),
  description_new = COALESCE(description_es, description_en),
  overview_new = COALESCE(overview_es, overview_en),
  objectives_new = COALESCE(objectives_es, objectives_en)
WHERE title_es IS NOT NULL OR title_en IS NOT NULL;

-- Drop old columns and rename new ones
ALTER TABLE programs DROP COLUMN IF EXISTS title_es;
ALTER TABLE programs DROP COLUMN IF EXISTS title_en;
ALTER TABLE programs DROP COLUMN IF EXISTS description_es;
ALTER TABLE programs DROP COLUMN IF EXISTS description_en;
ALTER TABLE programs DROP COLUMN IF EXISTS overview_es;
ALTER TABLE programs DROP COLUMN IF EXISTS overview_en;
ALTER TABLE programs DROP COLUMN IF EXISTS objectives_es;
ALTER TABLE programs DROP COLUMN IF EXISTS objectives_en;

-- Rename to final columns
ALTER TABLE programs RENAME COLUMN title_new TO title;
ALTER TABLE programs RENAME COLUMN description_new TO description;
ALTER TABLE programs RENAME COLUMN overview_new TO overview;
ALTER TABLE programs RENAME COLUMN objectives_new TO objectives;

-- 3. Update DigitalLibrary table to merge bilingual content
ALTER TABLE digital_library 
ADD COLUMN IF NOT EXISTS title_new VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_new TEXT,
ADD COLUMN IF NOT EXISTS abstract_new TEXT;

-- Copy content data to new fields
UPDATE digital_library 
SET 
  title_new = COALESCE(title_es, title_en),
  description_new = COALESCE(description_es, description_en),
  abstract_new = COALESCE(abstract_es, abstract_en)
WHERE title_es IS NOT NULL OR title_en IS NOT NULL;

-- Drop old columns and rename new ones
ALTER TABLE digital_library DROP COLUMN IF EXISTS title_es;
ALTER TABLE digital_library DROP COLUMN IF EXISTS title_en;
ALTER TABLE digital_library DROP COLUMN IF EXISTS description_es;
ALTER TABLE digital_library DROP COLUMN IF EXISTS description_en;
ALTER TABLE digital_library DROP COLUMN IF EXISTS abstract_es;
ALTER TABLE digital_library DROP COLUMN IF EXISTS abstract_en;

-- Rename to final columns
ALTER TABLE digital_library RENAME COLUMN title_new TO title;
ALTER TABLE digital_library RENAME COLUMN description_new TO description;
ALTER TABLE digital_library RENAME COLUMN abstract_new TO abstract;

-- 4. Update MediaAssets table to merge bilingual content
ALTER TABLE media_assets 
ADD COLUMN IF NOT EXISTS alt_text_new VARCHAR(500),
ADD COLUMN IF NOT EXISTS caption_new VARCHAR(500);

-- Copy content data to new fields
UPDATE media_assets 
SET 
  alt_text_new = COALESCE(alt_text_es, alt_text_en),
  caption_new = COALESCE(caption_es, caption_en)
WHERE alt_text_es IS NOT NULL OR alt_text_en IS NOT NULL;

-- Drop old columns and rename new ones
ALTER TABLE media_assets DROP COLUMN IF EXISTS alt_text_es;
ALTER TABLE media_assets DROP COLUMN IF EXISTS alt_text_en;
ALTER TABLE media_assets DROP COLUMN IF EXISTS caption_es;
ALTER TABLE media_assets DROP COLUMN IF EXISTS caption_en;

-- Rename to final columns
ALTER TABLE media_assets RENAME COLUMN alt_text_new TO alt_text;
ALTER TABLE media_assets RENAME COLUMN caption_new TO caption;

-- 5. Update Categories table to merge bilingual content
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS name_new VARCHAR(100),
ADD COLUMN IF NOT EXISTS description_new TEXT;

-- Copy content data to new fields
UPDATE categories 
SET 
  name_new = COALESCE(name_es, name_en),
  description_new = COALESCE(description_es, description_en)
WHERE name_es IS NOT NULL OR name_en IS NOT NULL;

-- Drop old columns and rename new ones
ALTER TABLE categories DROP COLUMN IF EXISTS name_es;
ALTER TABLE categories DROP COLUMN IF EXISTS name_en;
ALTER TABLE categories DROP COLUMN IF EXISTS description_es;
ALTER TABLE categories DROP COLUMN IF EXISTS description_en;

-- Rename to final columns
ALTER TABLE categories RENAME COLUMN name_new TO name;
ALTER TABLE categories RENAME COLUMN description_new TO description;

-- 6. Update Tags table to merge bilingual content
ALTER TABLE tags 
ADD COLUMN IF NOT EXISTS name_new VARCHAR(50);

-- Copy content data to new fields
UPDATE tags 
SET 
  name_new = COALESCE(name_es, name_en)
WHERE name_es IS NOT NULL OR name_en IS NOT NULL;

-- Drop old columns and rename new ones
ALTER TABLE tags DROP COLUMN IF EXISTS name_es;
ALTER TABLE tags DROP COLUMN IF EXISTS name_en;

-- Rename to final columns
ALTER TABLE tags RENAME COLUMN name_new TO name;
