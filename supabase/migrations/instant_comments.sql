-- Migration: Publish comments instantly (no pre-moderation)
-- Run this in your Supabase SQL Editor.

-- 1. Public can read every visible comment (hidden ones stay private)
DROP POLICY IF EXISTS "Public read approved comments" ON comments;
CREATE POLICY "Public read approved comments"
ON comments
FOR SELECT
TO public
USING (status <> 'hidden');

-- 2. Public inserts are published immediately
DROP POLICY IF EXISTS "Public submit pending comments" ON comments;
CREATE POLICY "Public submit pending comments"
ON comments
FOR INSERT
TO public
WITH CHECK (status = 'approved');

-- 3. Make the column default 'approved' so inserts without status are visible
ALTER TABLE comments ALTER COLUMN status SET DEFAULT 'approved';
ALTER TABLE comments ALTER COLUMN status SET NOT NULL;

-- 4. Publish anything still waiting in the moderation queue
UPDATE comments SET status = 'approved' WHERE status = 'pending';
