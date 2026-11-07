"use client";

import Image from "next/image";
import type { Film } from "@/types";
import { EVENT_CONSTANTS, ROUTES } from "@/lib/constants";
import { CountdownTimer } from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { Film as FilmIcon, Calendar, MapPin, Award, ChevronDown, Sparkles, Play } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  films: Film[];
  trailerUrl?: string | null;
}

export function HeroSection({ films, trailerUrl }: HeroSectionProps) {
  // Use event trailer if provided, otherwise fallback to first film's trailer
  const activeTrailerUrl = trailerUrl || films[0]?.trailer_url || null;

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center w-full">
      {/* Cinematic Spotlight Ambient Lighting (PRD Section 9) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[700px] h-[300px] sm:h-[400px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute top-1/3 left-10 w-72 h-72 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute top-1/3 right-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6 w-full">
        {/* Official Event Logo & Crest (PRD Section 4A) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center pt-2 pb-2"
        >
          <div className="relative flex items-center justify-center group">
            {/* Cinematic Golden Ambient Glow behind logo to make it outstanding */}
            <div className="absolute inset-0 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-tr from-amber-500/25 via-yellow-400/20 to-amber-600/25 rounded-full blur-3xl pointer-events-none -z-10 group-hover:scale-110 transition-transform duration-700" />

            {/* Standalone Logo without frame/card border */}
            <Image
              src="/logo.png"
              alt={`${EVENT_CONSTANTS.TITLE} - ${EVENT_CONSTANTS.SCHOOL}`}
              width={520}
              height={260}
              priority
              className="w-auto h-36 sm:h-56 md:h-64 object-contain filter drop-shadow-[0_12px_30px_rgba(212,175,55,0.45)] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Event Title & Tagline (PRD Section 4A & 9) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-3 px-2"
        >
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-sm break-words">
            <span className="block gold-gradient-text text-2xl sm:text-5xl md:text-6xl mt-1 sm:mt-2 font-serif italic normal-case tracking-normal">
              Grand Cinematic Awards
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 leading-relaxed font-light pt-2 px-1">
            Showcasing ten student-produced films from SMP Global Prestasi Bekasi.
            Experience young creative vision, cast your audience prediction for Best Picture,
            and join the grand celebration.
          </p>
        </motion.div>

        {/* Live Event Countdown (PRD Section 4A) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <CountdownTimer />
        </motion.div>

        {/* Event Date & Venue Badges (PRD Section 4A & 4E) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm shadow-md">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="font-medium">{EVENT_CONSTANTS.EVENT_DATES}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm shadow-md">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="font-medium">{EVENT_CONSTANTS.VENUE}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm shadow-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-medium">Best Picture Prediction</span>
          </div>
        </motion.div>

        {/* Action Buttons (PRD Section 4A) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4"
        >
          <a href={ROUTES.FILM_SHOWCASE} className="w-full sm:w-auto">
            <Button variant="gold" size="lg" className="w-full sm:w-auto text-sm font-bold tracking-wide">
              <FilmIcon className="w-4 h-4 mr-2" />
              Explore Films (10)
            </Button>
          </a>
          <a href={ROUTES.VOTING} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm font-semibold tracking-wide">
              <Award className="w-4 h-4 mr-2" />
              Predict the Best Picture
            </Button>
          </a>
          {activeTrailerUrl && (
            <a href="#trailer" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-sm font-medium tracking-wide border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Trailer
              </Button>
            </a>
          )}
        </motion.div>

        {/* Featured Movie Posters Ribbon (PRD Section 4A: Featured movie posters) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="pt-12 w-full max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Nominee Posters</span>
            </span>
            <a
              href={ROUTES.FILM_SHOWCASE}
              className="text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>View All 10 Films</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Horizontal scrollable poster preview row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x">
            {films.map((film, fIdx) => (
              <a
                key={film.id}
                href={ROUTES.FILM_SHOWCASE}
                className="group relative flex-shrink-0 w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden bg-slate-950 border border-amber-500/20 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 snap-start"
              >
                {film.poster_url && (
                  <Image
                    src={film.poster_url}
                    alt={film.title}
                    fill
                    sizes="144px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2 text-left opacity-90 group-hover:opacity-100">
                  <span className="text-[10px] font-bold text-amber-300">
                    #{fIdx + 1}
                  </span>
                  <span className="text-xs font-semibold text-white truncate">
                    {film.title}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
