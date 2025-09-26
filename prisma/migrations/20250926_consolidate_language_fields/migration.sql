-- Migration to consolidate dual language fields into single fields
-- This migration preserves existing Spanish content as the primary content
-- and moves English content to a backup before the schema change

-- Step 1: Create temporary backup table for existing data
CREATE TABLE IF NOT EXISTS migration_backup (
  table_name VARCHAR(255),
  record_id VARCHAR(255),
  spanish_data JSONB,
  english_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Backup existing dual language data from News table
INSERT INTO migration_backup (table_name, record_id, spanish_data, english_data)
SELECT
  'news',
  id,
  jsonb_build_object(
    'titleEs', title_es,
    'contentEs', content_es,
    'excerptEs', excerpt_es
  ),
  jsonb_build_object(
    'titleEn', title_en,
    'contentEn', content_en,
    'excerptEn', excerpt_en
  )
FROM news;

-- Step 3: Backup existing dual language data from Program table
INSERT INTO migration_backup (table_name, record_id, spanish_data, english_data)
SELECT
  'programs',
  id,
  jsonb_build_object(
    'titleEs', title_es,
    'descriptionEs', description_es,
    'overviewEs', overview_es,
    'objectivesEs', objectives_es
  ),
  jsonb_build_object(
    'titleEn', title_en,
    'descriptionEn', description_en,
    'overviewEn', overview_en,
    'objectivesEn', objectives_en
  )
FROM programs;

-- Step 4: Backup existing dual language data from DigitalLibrary table
INSERT INTO migration_backup (table_name, record_id, spanish_data, english_data)
SELECT
  'digital_library',
  id,
  jsonb_build_object(
    'titleEs', title_es,
    'descriptionEs', description_es,
    'abstractEs', abstract_es
  ),
  jsonb_build_object(
    'titleEn', title_en,
    'descriptionEn', description_en,
    'abstractEn', abstract_en
  )
FROM digital_library;

-- Step 5: Backup existing dual language data from MediaAsset table
INSERT INTO migration_backup (table_name, record_id, spanish_data, english_data)
SELECT
  'media_assets',
  id,
  jsonb_build_object(
    'altTextEs', alt_text_es,
    'captionEs', caption_es
  ),
  jsonb_build_object(
    'altTextEn', alt_text_en,
    'captionEn', caption_en
  )
FROM media_assets;

-- Step 6: Backup existing dual language data from Category table
INSERT INTO migration_backup (table_name, record_id, spanish_data, english_data)
SELECT
  'categories',
  id,
  jsonb_build_object(
    'nameEs', name_es,
    'descriptionEs', description_es
  ),
  jsonb_build_object(
    'nameEn', name_en,
    'descriptionEn', description_en
  )
FROM categories;

-- Step 7: Backup existing dual language data from Tag table
INSERT INTO migration_backup (table_name, record_id, spanish_data, english_data)
SELECT
  'tags',
  id,
  jsonb_build_object(
    'nameEs', name_es
  ),
  jsonb_build_object(
    'nameEn', name_en
  )
FROM tags;

-- Step 8: Add new single language fields to News table
ALTER TABLE news
  ADD COLUMN title VARCHAR(255),
  ADD COLUMN content TEXT,
  ADD COLUMN excerpt VARCHAR(500);

-- Step 9: Populate new fields with Spanish content (primary language)
UPDATE news SET
  title = COALESCE(title_es, title_en),
  content = COALESCE(content_es, content_en),
  excerpt = COALESCE(excerpt_es, excerpt_en);

-- Step 10: Make title and content required for News
ALTER TABLE news
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN content SET NOT NULL;

-- Step 11: Add new single language fields to Program table
ALTER TABLE programs
  ADD COLUMN title VARCHAR(255),
  ADD COLUMN description TEXT,
  ADD COLUMN overview TEXT,
  ADD COLUMN objectives TEXT;

-- Step 12: Populate new fields with Spanish content (primary language)
UPDATE programs SET
  title = COALESCE(title_es, title_en),
  description = COALESCE(description_es, description_en),
  overview = COALESCE(overview_es, overview_en),
  objectives = COALESCE(objectives_es, objectives_en);

-- Step 13: Make title and description required for Programs
ALTER TABLE programs
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN description SET NOT NULL;

-- Step 14: Add new single language fields to DigitalLibrary table
ALTER TABLE digital_library
  ADD COLUMN title VARCHAR(255),
  ADD COLUMN description TEXT,
  ADD COLUMN abstract TEXT;

-- Step 15: Populate new fields with Spanish content (primary language)
UPDATE digital_library SET
  title = COALESCE(title_es, title_en),
  description = COALESCE(description_es, description_en),
  abstract = COALESCE(abstract_es, abstract_en);

-- Step 16: Make title and description required for DigitalLibrary
ALTER TABLE digital_library
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN description SET NOT NULL;

-- Step 17: Add new single language fields to MediaAsset table
ALTER TABLE media_assets
  ADD COLUMN alt_text VARCHAR(500),
  ADD COLUMN caption VARCHAR(500);

-- Step 18: Populate new fields with Spanish content (primary language)
UPDATE media_assets SET
  alt_text = COALESCE(alt_text_es, alt_text_en),
  caption = COALESCE(caption_es, caption_en);

-- Step 19: Add new single language fields to Category table
ALTER TABLE categories
  ADD COLUMN name VARCHAR(255),
  ADD COLUMN description TEXT;

-- Step 20: Populate new fields with Spanish content (primary language)
UPDATE categories SET
  name = COALESCE(name_es, name_en),
  description = COALESCE(description_es, description_en);

-- Step 21: Make name required for Category
ALTER TABLE categories
  ALTER COLUMN name SET NOT NULL;

-- Step 22: Add new single language fields to Tag table
ALTER TABLE tags
  ADD COLUMN name VARCHAR(255);

-- Step 23: Populate new fields with Spanish content (primary language)
UPDATE tags SET
  name = COALESCE(name_es, name_en);

-- Step 24: Make name required for Tag
ALTER TABLE tags
  ALTER COLUMN name SET NOT NULL;

-- Step 25: Drop old dual language fields from News table
ALTER TABLE news
  DROP COLUMN title_es,
  DROP COLUMN title_en,
  DROP COLUMN content_es,
  DROP COLUMN content_en,
  DROP COLUMN excerpt_es,
  DROP COLUMN excerpt_en;

-- Step 26: Drop old dual language fields from Program table
ALTER TABLE programs
  DROP COLUMN title_es,
  DROP COLUMN title_en,
  DROP COLUMN description_es,
  DROP COLUMN description_en,
  DROP COLUMN overview_es,
  DROP COLUMN overview_en,
  DROP COLUMN objectives_es,
  DROP COLUMN objectives_en;

-- Step 27: Drop old dual language fields from DigitalLibrary table
ALTER TABLE digital_library
  DROP COLUMN title_es,
  DROP COLUMN title_en,
  DROP COLUMN description_es,
  DROP COLUMN description_en,
  DROP COLUMN abstract_es,
  DROP COLUMN abstract_en;

-- Step 28: Drop old dual language fields from MediaAsset table
ALTER TABLE media_assets
  DROP COLUMN alt_text_es,
  DROP COLUMN alt_text_en,
  DROP COLUMN caption_es,
  DROP COLUMN caption_en;

-- Step 29: Drop old dual language fields from Category table
ALTER TABLE categories
  DROP COLUMN name_es,
  DROP COLUMN name_en,
  DROP COLUMN description_es,
  DROP COLUMN description_en;

-- Step 30: Drop old dual language fields from Tag table
ALTER TABLE tags
  DROP COLUMN name_es,
  DROP COLUMN name_en;

-- Step 31: Add indexes for the new fields
CREATE INDEX idx_news_title ON news(title);
CREATE INDEX idx_programs_title ON programs(title);
CREATE INDEX idx_digital_library_title ON digital_library(title);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_tags_name ON tags(name);

-- Migration complete!
-- Note: The migration_backup table contains all original dual-language data
-- and can be used to restore content if needed during development