// ==============================================================================
// FILM FESTIVAL AWARDS 2026 - DOMAIN MODEL TYPES
// Single Source of Truth: PRD.md
// ==============================================================================

export interface CrewMember {
  id?: string;
  name: string;
  role: string;
  photo_url?: string;
}

export interface Film {
  id: string;
  title: string;
  genre?: string | null;
  duration?: string | null;
  short_description: string;
  poster_url?: string | null;
  trailer_url?: string | null;
  crew: CrewMember[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface EventSettings {
  id: number;
  title: string;
  school: string;
  event_date: string;
  venue: string;
  description: string;
  tagline: string;
  trailer_url?: string | null;
  is_published: boolean;
  published_at: string | null;
  voting_deadline: string;
  is_voting_manually_closed: boolean;
  created_at: string;
  updated_at: string;
}

export type CommentStatus = 'pending' | 'approved' | 'hidden';

export interface Comment {
  id: string;
  author_name: string;
  content: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  browser_token: string;
  film_id: string;
  ip_hash?: string | null;
  user_agent?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VotingStatisticsItem {
  film_id: string;
  film_title: string;
  poster_url?: string | null;
  display_order: number;
  vote_count: number;
  percentage: number;
  ranking: number;
}

export interface VotingStatus {
  is_open: boolean;
  published_at: string | null;
  voting_deadline: string;
  is_manually_closed: boolean;
  total_votes: number;
}
