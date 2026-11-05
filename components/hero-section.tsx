"use client";

import Image from "next/image";
import type { Film } from "@/types";
import { EVENT_CONSTANTS, ROUTES } from "@/lib/constants";
import { CountdownTimer } from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { Film as FilmIcon, Calendar, MapPin, Award, ChevronDown, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  films: Film[];
}

export function HeroSection({ films }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center w-full">
      {/* Cinematic Spotlight Ambient Lighting (PRD Section 9) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[700px] h-[300px] sm:h-[400px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute top-1/3 left-10 w-72 h-72 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute top-1/3 right-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6 w-full">
        {/* Official Event Logo & Crest (PRD Section 4A) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 sm:gap-3 p-1 sm:p-1.5 pr-3.5 sm:pr-4 rounded-full bg-slate-900/80 border border-amber-500/40 shadow-xl shadow-amber-500/10 backdrop-blur-md max-w-full"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#f3d375] to-[#aa8620] p-0.5 flex items-center justify-center shadow-md flex-shrink-0">
            <div className="w-full h-full bg-[#060913] rounded-full flex items-center justify-center">
              <FilmIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
          </div>
          <div className="text-left">
            <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-amber-300 uppercase">
              {EVENT_CONSTANTS.SCHOOL}
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-400">
              Official Interactive Event Portal
            </div>
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
            <span className="block">{EVENT_CONSTANTS.TITLE}</span>
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

