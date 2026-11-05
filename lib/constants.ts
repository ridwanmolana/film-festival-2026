// ==============================================================================
// FILM FESTIVAL AWARDS 2026 - SYSTEM CONSTANTS
// Single Source of Truth: PRD.md
// ==============================================================================

export const EVENT_CONSTANTS = {
  TITLE: 'Film Festival Awards 2026',
  SCHOOL: 'SMP Global Prestasi Bekasi',
  EVENT_DATES: '8–9 December 2026',
  VENUE: 'GPS Theater',
  TIMEZONE: 'Asia/Jakarta',
  // Official Voting Closing: 4 December 2026 at 23:59:59 WIB (Asia/Jakarta, UTC+7)
  VOTING_DEADLINE_ISO: '2026-12-04T23:59:59+07:00',
  AWARD_CATEGORY: 'Best Picture',
  TOTAL_FILMS: 10,
  STORAGE_BUCKET: 'film-assets',
} as const;

export const ROUTES = {
  HOME: '/',
  FILM_SHOWCASE: '/#films',
  VOTING: '/#prediction',
  COMMUNITY: '/#community',
  EVENT_INFO: '/#event-info',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
} as const;

