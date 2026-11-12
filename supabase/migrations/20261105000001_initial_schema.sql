-- ==============================================================================
-- FILM FESTIVAL AWARDS 2026 - INITIAL DATABASE SCHEMA
-- Single Source of Truth: PRD.md
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Generic updated_at timestamp function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. EVENT SETTINGS TABLE (PRD Section 4E, 5, 6, 8)
-- Single row holding official event details and voting schedule state.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  title TEXT NOT NULL DEFAULT 'Film Festival Awards 2026',
  school TEXT NOT NULL DEFAULT 'SMP Global Prestasi Bekasi',
  event_date TEXT NOT NULL DEFAULT '8–9 December 2026',
  venue TEXT NOT NULL DEFAULT 'GPS Theater',
  description TEXT NOT NULL DEFAULT 'Film Festival Awards 2026 is an interactive event website designed to showcase ten student-produced films and create an engaging digital experience for students, teachers, and event visitors.',
  tagline TEXT NOT NULL DEFAULT 'Grand Cinematic Awards',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  voting_deadline TIMESTAMPTZ NOT NULL DEFAULT '2026-12-04 23:59:59+07',
  is_voting_manually_closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to automatically record publication timestamp when is_published is set to true
CREATE OR REPLACE FUNCTION handle_event_publication()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND (OLD.is_published = false OR OLD.published_at IS NULL) THEN
    NEW.published_at = COALESCE(NEW.published_at, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_event_publication ON event_settings;
CREATE TRIGGER trg_event_publication
BEFORE INSERT OR UPDATE ON event_settings
FOR EACH ROW
EXECUTE FUNCTION handle_event_publication();

DROP TRIGGER IF EXISTS trg_event_settings_updated_at ON event_settings;
CREATE TRIGGER trg_event_settings_updated_at
BEFORE UPDATE ON event_settings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- 4. FILMS TABLE (PRD Section 4B, 8, 11)
-- Stores the 10 student-produced films. No film detail page/route exists.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS films (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  genre TEXT,
  duration TEXT,
  short_description TEXT NOT NULL,
  poster_url TEXT,
  crew JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_films_display_order ON films(display_order ASC);

DROP TRIGGER IF EXISTS trg_films_updated_at ON films;
CREATE TRIGGER trg_films_updated_at
BEFORE UPDATE ON films
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- 5. PREDICTIONS (AUDIENCE VOTES) TABLE (PRD Section 4C, 5, 6, 8)
-- One active prediction per anonymous browser token.
-- Updatable before deadline; duplicates don't increase count.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  browser_token TEXT NOT NULL UNIQUE,
  film_id UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_predictions_browser_token ON predictions(browser_token);
CREATE INDEX IF NOT EXISTS idx_predictions_film_id ON predictions(film_id);

DROP TRIGGER IF EXISTS trg_predictions_updated_at ON predictions;
CREATE TRIGGER trg_predictions_updated_at
BEFORE UPDATE ON predictions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- 6. COMMENTS TABLE (PRD Section 4D, 7, 8)
-- Public comments are published instantly ('approved'); admins may hide them later.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

DROP TRIGGER IF EXISTS trg_comments_updated_at ON comments;
CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- 7. VOTING SCHEDULE & TIME VALIDATION LOGIC (PRD Section 5 & 6)
-- Server clock authoritative check.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_voting_open()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_settings RECORD;
BEGIN
  SELECT is_published, published_at, voting_deadline, is_voting_manually_closed
  INTO v_settings
  FROM event_settings
  WHERE id = 1;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- If manually closed by admin
  IF v_settings.is_voting_manually_closed THEN
    RETURN false;
  END IF;

  -- Must be officially published
  IF NOT v_settings.is_published OR v_settings.published_at IS NULL THEN
    RETURN false;
  END IF;

  -- Must be after publication timestamp
  IF now() < v_settings.published_at THEN
    RETURN false;
  END IF;

  -- Must be before or equal to deadline (4 December 2026, 23:59:59 WIB)
  IF now() > v_settings.voting_deadline THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$;

-- Server-side validation trigger before inserting or updating predictions
CREATE OR REPLACE FUNCTION validate_prediction_window()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_voting_open() THEN
    RAISE EXCEPTION 'Voting is currently closed or not yet open based on server schedule.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_prediction_window ON predictions;
CREATE TRIGGER trg_validate_prediction_window
BEFORE INSERT OR UPDATE ON predictions
FOR EACH ROW
EXECUTE FUNCTION validate_prediction_window();

-- ------------------------------------------------------------------------------
-- 8. AGGREGATE VOTING STATISTICS (PRD Section 4C, 5, 8)
-- Aggregate statistics only. Never exposes individual voter tokens to public.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW voting_statistics AS
WITH vote_counts AS (
  SELECT
    film_id,
    COUNT(id) AS votes
  FROM predictions
  GROUP BY film_id
),
total_votes_agg AS (
  SELECT COUNT(id) AS grand_total FROM predictions
)
SELECT
  f.id AS film_id,
  f.title AS film_title,
  f.poster_url,
  f.display_order,
  COALESCE(vc.votes, 0)::BIGINT AS vote_count,
  CASE
    WHEN t.grand_total > 0 THEN
      ROUND((COALESCE(vc.votes, 0)::NUMERIC / t.grand_total::NUMERIC) * 100, 2)
    ELSE 0
  END AS percentage,
  DENSE_RANK() OVER (ORDER BY COALESCE(vc.votes, 0) DESC, f.display_order ASC) AS ranking
FROM films f
LEFT JOIN vote_counts vc ON f.id = vc.film_id
CROSS JOIN total_votes_agg t
ORDER BY ranking ASC, f.display_order ASC;

CREATE OR REPLACE FUNCTION get_voting_summary()
RETURNS TABLE (
  total_votes BIGINT,
  is_open BOOLEAN,
  published_at TIMESTAMPTZ,
  voting_deadline TIMESTAMPTZ,
  is_manually_closed BOOLEAN
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(id) FROM predictions)::BIGINT AS total_votes,
    is_voting_open() AS is_open,
    s.published_at,
    s.voting_deadline,
    s.is_voting_manually_closed
  FROM event_settings s
  WHERE s.id = 1;
END;
$$;

