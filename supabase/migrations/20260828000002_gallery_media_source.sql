-- ============================================
-- MIGRATION: gallery media type + source attribution
-- Adds support for video/embed media and source attribution (Instagram/menu/maps)
-- ============================================

-- media_type: 'photo' (default) | 'video' | 'embed'
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS media_type text DEFAULT 'photo'
  CHECK (media_type IN ('photo', 'video', 'embed'));

-- video_url: MP4 uploaded to storage OR external direct video URL (used when media_type='video')
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS video_url text;

-- embed_url: Instagram/other embed iframe URL (used when media_type='embed')
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS embed_url text;

-- source: attribution origin, e.g. 'instagram', 'menu', 'maps'
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS source text;

-- source_url: link back to the original source (e.g. Instagram post URL)
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS source_url text;

-- backfill existing rows as photos
UPDATE gallery SET media_type = 'photo' WHERE media_type IS NULL;

-- image_url may be empty for video/embed-only rows; relax the NOT NULL constraint
ALTER TABLE gallery ALTER COLUMN image_url DROP NOT NULL;
