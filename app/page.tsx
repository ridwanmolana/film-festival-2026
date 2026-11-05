import { getFilms } from "@/lib/films";
import { getVotingStatus, getVotingStatistics } from "@/lib/voting";
import { getApprovedComments } from "@/lib/comments";
import { EVENT_CONSTANTS, ROUTES } from "@/lib/constants";
import { HeroSection } from "@/components/hero-section";
import { FilmShowcase } from "@/components/film-showcase";
import { PredictionVoting } from "@/components/prediction-voting";
import { CommunityComments } from "@/components/community-comments";
import { PublicNavbar } from "@/components/public-navbar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const [films, votingStatus, votingStats, comments] = await Promise.all([
    getFilms(),
    getVotingStatus(),
    getVotingStatistics(),
    getApprovedComments(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100">
      {/* Sticky Cinematic Navigation with Mobile Menu */}
      <PublicNavbar />

      {/* Hero Section (PRD Section 4A) */}
      <HeroSection films={films} />

      {/* Film Showcase Section (PRD Section 4B: Display all 10 films on one page) */}
      <section id="films" className="py-24 border-t border-slate-800/80 bg-slate-950/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FilmShowcase films={films} />
        </div>
      </section>

      {/* Audience Prediction Anchor Section (PRD Section 4C & 5: Audience Voting) */}
      <section id="prediction" className="py-24 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <PredictionVoting
            films={films}
            initialStatus={votingStatus}
            initialStats={votingStats}
          />
        </div>
      </section>

      {/* Community Comments Anchor Section (PRD Section 4D & 7: Moderated Comments) */}
      <section id="community" className="py-24 border-t border-slate-800/80 bg-slate-950/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CommunityComments initialComments={comments} />
        </div>
      </section>

      {/* Event Info Anchor Section (PRD Section 4E) */}
      <section id="event-info" className="py-24 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="gold">Event Information</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Venue & Event Details
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Join us for two unforgettable days celebrating the magic of student cinema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3">
              <Calendar className="w-8 h-8 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Event Date</h3>
              <p className="text-sm text-slate-300">
                {EVENT_CONSTANTS.EVENT_DATES}
              </p>
              <p className="text-xs text-slate-400">
                Screening sessions and Gala Awarding Ceremony.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3">
              <MapPin className="w-8 h-8 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Event Venue</h3>
              <p className="text-sm text-slate-300">
                {EVENT_CONSTANTS.VENUE}
              </p>
              <p className="text-xs text-slate-400">
                {EVENT_CONSTANTS.SCHOOL}, Bekasi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Cinematic Showcase</h3>
              <p className="text-sm text-slate-300">
                10 Original Student Films
              </p>
              <p className="text-xs text-slate-400">
                Awards presentation for Best Picture prediction and jury selections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Footer */}
      <footer className="mt-auto border-t border-amber-500/20 bg-[#04070d] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-1">
            <div className="text-slate-200 font-bold text-sm tracking-wide">
              {EVENT_CONSTANTS.TITLE}
            </div>
            <div>
              {EVENT_CONSTANTS.SCHOOL} • {EVENT_CONSTANTS.VENUE} • {EVENT_CONSTANTS.EVENT_DATES}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href={ROUTES.HOME} className="hover:text-amber-300 transition-colors">
              Home
            </a>
            <a href={ROUTES.FILM_SHOWCASE} className="hover:text-amber-300 transition-colors">
              Films (10)
            </a>
            <a href={ROUTES.VOTING} className="hover:text-amber-300 transition-colors">
              Predictions
            </a>
            <a href={ROUTES.COMMUNITY} className="hover:text-amber-300 transition-colors">
              Community
            </a>
            <a href={ROUTES.EVENT_INFO} className="hover:text-amber-300 transition-colors">
              Event Info
            </a>
            <Link
              href={ROUTES.ADMIN_LOGIN}
              className="text-amber-400/90 hover:text-amber-300 font-medium transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
