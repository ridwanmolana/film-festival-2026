"use client";

import { useMemo } from "react";
import { Play, Film as FilmIcon } from "lucide-react";

interface EventTrailerSectionProps {
  trailerUrl?: string | null;
}

/**
 * Extracts embed URL for YouTube, Vimeo, or returns null/raw URL
 */
function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytWatchMatch[1]}?rel=0&modestbranding=1`;
  }

  // YouTube short URL: https://youtu.be/VIDEO_ID
  const ytShortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytShortMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytShortMatch[1]}?rel=0&modestbranding=1`;
  }

  // YouTube embed URL already: https://www.youtube.com/embed/VIDEO_ID
  const ytEmbedMatch = trimmed.match(/(?:youtube(?:-nocookie)?\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytEmbedMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytEmbedMatch[1]}?rel=0&modestbranding=1`;
  }

  // Vimeo URL: https://vimeo.com/VIDEO_ID
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`;
  }

  // Generic iframe link or mp4
  return trimmed;
}

export function EventTrailerSection({ trailerUrl }: EventTrailerSectionProps) {
  const embedUrl = useMemo(() => getEmbedUrl(trailerUrl), [trailerUrl]);

  if (!trailerUrl || !embedUrl) return null;

  return (
    <section id="trailer" className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-950/60 via-[#0a0f1d] to-slate-950/60 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Play className="w-3.5 h-3.5 fill-amber-300" />
            <span>Official Movie Trailer</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Official Movie <span className="gold-gradient-text italic font-serif normal-case">Trailer</span>
          </h2>

          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 font-light leading-relaxed">
           Watch the movie trailers of Film Festival 2026 and discover the creativity and imagination of our young filmmakers!
          </p>
        </div>

        {/* Video Player Card Frame */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.25)] p-1.5 sm:p-2.5 backdrop-blur-sm group">
          {/* Ambient border glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />

          <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black">
            {embedUrl.endsWith(".mp4") || embedUrl.endsWith(".webm") ? (
              <video
                src={embedUrl}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={embedUrl}
                title="Official Festival Trailer - Film Festival Awards 2026"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>
        </div>

        {/* Caption bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FilmIcon className="w-4 h-4 text-amber-400" />
            <span>Film Festival Awards 2026 • SMP Global Prestasi Bekasi</span>
          </div>
          <a
            href={trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            <span>Tonton langsung di YouTube</span>
            &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
