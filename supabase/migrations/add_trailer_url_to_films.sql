-- Migration: Add trailer_url column to films table
-- Run this in your Supabase SQL Editor

ALTER TABLE films
ADD COLUMN IF NOT EXISTS trailer_url TEXT DEFAULT NULL;

-- Verify
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'films' AND column_name = 'trailer_url';

