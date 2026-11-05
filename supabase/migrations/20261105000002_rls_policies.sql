-- ==============================================================================
-- FILM FESTIVAL AWARDS 2026 - ROW LEVEL SECURITY (RLS) POLICIES
-- Single Source of Truth: PRD.md (Section 5, 7, 8, 10)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EVENT SETTINGS POLICIES
-- Public can read event info and schedule. Only authenticated admins can modify.
-- ------------------------------------------------------------------------------
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read event settings"
ON event_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin insert event settings"
ON event_settings
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update event settings"
ON event_settings
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 2. FILMS POLICIES
-- Public can read all films. Only authenticated admins can add/edit/delete films.
-- ------------------------------------------------------------------------------
ALTER TABLE films ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read films"
ON films
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin insert films"
ON films
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update films"
ON films
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete films"
ON films
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 3. COMMENTS POLICIES (PRD Section 7 & 8)
-- - Only approved comments appear publicly.
-- - New public comments must be stored as 'pending'.
-- - Admins can read all, approve, hide, and delete comments.
-- ------------------------------------------------------------------------------
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public can only read approved comments
CREATE POLICY "Public read approved comments"
ON comments
FOR SELECT
TO public
USING (status = 'approved');

-- Admins can read all comments (pending, approved, hidden)
CREATE POLICY "Admin read all comments"
ON comments
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- Public visitors can submit comments with 'pending' status only
CREATE POLICY "Public submit pending comments"
ON comments
FOR INSERT
TO public
WITH CHECK (status = 'pending');

-- Admins can update comment status (approve/hide)
CREATE POLICY "Admin update comments"
ON comments
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Admins can delete comments
CREATE POLICY "Admin delete comments"
ON comments
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 4. PREDICTIONS POLICIES (PRD Section 5 & 8)
-- - Raw voting records contain tokens and IP hashes, protected from public exposure.
-- - Public accesses aggregate statistics via voting_statistics view.
-- - Server-side voting routes (Service Role) manage inserts and updates after CAPTCHA.
-- - Admins can read predictions for monitoring and export.
-- ------------------------------------------------------------------------------
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Admins can view all individual prediction records for management and export
CREATE POLICY "Admin read all predictions"
ON predictions
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- Admins can manage predictions if needed
CREATE POLICY "Admin manage predictions"
ON predictions
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

