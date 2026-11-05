// ==============================================================================
// FILM FESTIVAL AWARDS 2026 - DATABASE TYPES DEFINITION
// Single Source of Truth: PRD.md
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface CrewMember {
  id?: string;
  name: string;
  role: string;
  photo_url?: string;
}

export interface Database {
  public: {
    Tables: {
      event_settings: {
        Row: {
          id: number;
          title: string;
          school: string;
          event_date: string;
          venue: string;
          description: string;
          tagline: string;
          is_published: boolean;
          published_at: string | null;
          voting_deadline: string;
          is_voting_manually_closed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title?: string;
          school?: string;
          event_date?: string;
          venue?: string;
          description?: string;
          tagline?: string;
          is_published?: boolean;
          published_at?: string | null;
          voting_deadline?: string;
          is_voting_manually_closed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          school?: string;
          event_date?: string;
          venue?: string;
          description?: string;
          tagline?: string;
          is_published?: boolean;
          published_at?: string | null;
          voting_deadline?: string;
          is_voting_manually_closed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      films: {
        Row: {
          id: string;
          title: string;
          genre: string | null;
          duration: string | null;
          short_description: string;
          poster_url: string | null;
          crew: Json;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          genre?: string | null;
          duration?: string | null;
          short_description: string;
          poster_url?: string | null;
          crew?: Json;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          genre?: string | null;
          duration?: string | null;
          short_description?: string;
          poster_url?: string | null;
          crew?: Json;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      predictions: {
        Row: {
          id: string;
          browser_token: string;
          film_id: string;
          ip_hash: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          browser_token: string;
          film_id: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          browser_token?: string;
          film_id?: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          author_name: string;
          content: string;
          status: 'pending' | 'approved' | 'hidden';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          content: string;
          status?: 'pending' | 'approved' | 'hidden';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          content?: string;
          status?: 'pending' | 'approved' | 'hidden';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      voting_statistics: {
        Row: {
          film_id: string;
          film_title: string;
          poster_url: string | null;
          display_order: number;
          vote_count: number;
          percentage: number;
          ranking: number;
        };
      };
    };
    Functions: {
      is_voting_open: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      get_voting_summary: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_votes: number;
          is_open: boolean;
          published_at: string | null;
          voting_deadline: string;
          is_manually_closed: boolean;
        }[];
      };
    };
  };
}

