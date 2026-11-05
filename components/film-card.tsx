"use client";

import { useState } from "react";
import Image from "next/image";
import type { Film } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, Film as FilmIcon, Users, Award, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FilmCardProps {
  film: Film;
  index: number;
}

export function FilmCard({ film, index }: FilmCardProps) {
  const [selectedCrewModal, setSelectedCrewModal] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0c1324] to-[#070b16] border border-amber-500/25 shadow-xl shadow-black/40 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300"
      >
        {/* Subtle gold top trim */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Poster Container */}
        <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-950">
          {film.poster_url ? (
            <Image
              src={film.poster_url}
              alt={`Poster film ${film.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                posterLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setPosterLoaded(true)}
              priority={index < 2}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
              <FilmIcon className="w-12 h-12 mb-2 stroke-1" />
              <span className="text-xs">Poster Preview</span>
            </div>
          )}

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1324] via-transparent to-black/40 pointer-events-none" />

          {/* Nominee Badge & Order */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-md">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Nominee #{film.display_order}</span>
            </span>
          </div>

          {/* Genre & Duration Badges Overlay at bottom of poster */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center gap-1.5">
            {film.genre && (
              <Badge variant="gold" className="text-[10px] px-2 py-0.5 backdrop-blur-md bg-black/60">
                {film.genre}
              </Badge>
            )}
            {film.duration && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-slate-300 border border-slate-700">
                <Clock className="w-2.5 h-2.5 text-amber-400" />
                <span>{film.duration}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors line-clamp-1">
              {film.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed line-clamp-3">
              {film.short_description}
            </p>
          </div>

          {/* Crew Section (PRD Section 4B: Crew photographs) */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Film Crew</span>
              </span>
              {film.crew.length > 2 && (
                <button
                  type="button"
                  onClick={() => setSelectedCrewModal(true)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  View all ({film.crew.length})
                </button>
              )}
            </div>

            {/* Crew Photographs & Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {film.crew.slice(0, 2).map((member, crewIdx) => (
                <div
                  key={crewIdx}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-amber-400/40 bg-slate-800">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-amber-300">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.article>

      {/* In-Page Crew Modal (Strictly on the same page, NO separate route) */}
      <AnimatePresence>
        {selectedCrewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCrewModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-lg rounded-2xl bg-[#0c1324] border border-amber-500/40 shadow-2xl overflow-hidden p-6 text-slate-100"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    Nominee #{film.display_order} Crew
                  </span>
                  <h4 className="text-xl font-bold text-white mt-0.5">
                    {film.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCrewModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close crew details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
                <p className="text-xs text-slate-400 italic">
                  &ldquo;{film.short_description}&rdquo;
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Production Team Members
                  </div>
                  {film.crew.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-amber-400/50 bg-slate-800 shadow-md">
                        {member.photo_url ? (
                          <Image
                            src={member.photo_url}
                            alt={member.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-amber-300">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">
                          {member.name}
                        </div>
                        <div className="text-xs text-amber-300/80">
                          {member.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCrewModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

