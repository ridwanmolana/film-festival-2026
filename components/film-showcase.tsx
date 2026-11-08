"use client";

import { useState, useMemo } from "react";
import type { Film } from "@/types";
import { FilmCard } from "@/components/film-card";
import { Film as FilmIcon, Sparkles } from "lucide-react";

interface FilmShowcaseProps {
  films: Film[];
}

export function FilmShowcase({ films }: FilmShowcaseProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  // Extract unique genres for convenient in-page filtering
  const genres = useMemo(() => {
    const list = new Set<string>();
    films.forEach((f) => {
      if (f.genre) {
        // Split composite genres like "Mystery / Thriller" or "Sci-Fi / Drama"
        f.genre.split("/").forEach((g) => list.add(g.trim()));
      }
    });
    return Array.from(list);
  }, [films]);

  const filteredFilms = useMemo(() => {
    if (selectedGenre === "all") return films;
    return films.filter(
      (f) => f.genre && f.genre.toLowerCase().includes(selectedGenre.toLowerCase())
    );
  }, [films, selectedGenre]);

  return (
    <div className="space-y-10">
      {/* Showcase Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <FilmIcon className="w-3.5 h-3.5" />
          <span>Official Nominee Selection</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ten Participating Films
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Showcasing original cinematic storytelling by students of SMP Global Prestasi Bekasi.
          Every film is nominated for the prestigious Best Picture award.
        </p>

       
      </div>

      {/* 10 Films Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {filteredFilms.map((film, index) => (
          <FilmCard key={film.id} film={film} index={index} />
        ))}
      </div>

      {filteredFilms.length === 0 && (
        <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400">
          <p className="text-sm">No films found for the selected genre.</p>
          <button
            type="button"
            onClick={() => setSelectedGenre("all")}
            className="mt-3 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2"
          >
            Reset filter to show all 10 films
          </button>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-slate-950/80 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>All ten nominated films are eligible for Audience Best Picture predictions.</span>
        </div>
        <a
          href="#prediction"
          className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 transition-colors"
        >
          Cast Your Prediction Now &rarr;
        </a>
      </div>
    </div>
  );
}
