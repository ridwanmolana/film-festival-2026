-- ==============================================================================
-- FILM FESTIVAL AWARDS 2026 - STORAGE BUCKETS & POLICIES
-- Single Source of Truth: PRD.md (Section 3, 8, 10)
-- ==============================================================================

-- 1. Create storage bucket for posters and crew photographs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'film-assets',
  'film-assets',
  true,
  5242880, -- 5 MB limit per image
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Storage Objects RLS Policies
-- Public can view/download all film assets (posters, crew photos)
CREATE POLICY "Public read film assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'film-assets');

-- Authenticated admins can upload film assets
CREATE POLICY "Admin upload film assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'film-assets' AND
  auth.role() = 'authenticated'
);

-- Authenticated admins can update film assets
CREATE POLICY "Admin update film assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'film-assets' AND
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'film-assets' AND
  auth.role() = 'authenticated'
);

-- Authenticated admins can delete film assets
CREATE POLICY "Admin delete film assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'film-assets' AND
  auth.role() = 'authenticated'
);

