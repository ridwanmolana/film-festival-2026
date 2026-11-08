"use client";

import { useState, useEffect, useTransition, useSyncExternalStore } from "react";
import Image from "next/image";
import type { Film, VotingStatisticsItem, VotingStatus } from "@/types";
import { submitPrediction, getVotingStatistics, getVotingStatus, getMyPrediction } from "@/lib/voting";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Vote,
  Sparkles,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PredictionVotingProps {
  films: Film[];
  initialStatus: VotingStatus;
  initialStats: VotingStatisticsItem[];
}

const BROWSER_TOKEN_STORAGE_KEY = "ffa_browser_token";

const emptySubscribe = () => () => { };

function getBrowserTokenSnapshot(): string {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem(BROWSER_TOKEN_STORAGE_KEY);
  if (!token) {
    token =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `ffa-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(BROWSER_TOKEN_STORAGE_KEY, token);
  }
  return token;
}

export function PredictionVoting({
  films,
  initialStatus,
  initialStats,
}: PredictionVotingProps) {
  const browserToken = useSyncExternalStore(
    emptySubscribe,
    getBrowserTokenSnapshot,
    () => ""
  );

  const [selectedFilmId, setSelectedFilmId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"vote" | "standings">("vote");
  const [currentVotedFilmId, setCurrentVotedFilmId] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string>("");

  const [status, setStatus] = useState<VotingStatus>(initialStatus);
  const [stats, setStats] = useState<VotingStatisticsItem[]>(initialStats);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Look up whether this browser token previously cast a vote
  useEffect(() => {
    if (!browserToken) return;

    getMyPrediction(browserToken).then((existingFilmId) => {
      if (existingFilmId) {
        setCurrentVotedFilmId(existingFilmId);
        setSelectedFilmId(existingFilmId);
      }
    });
  }, [browserToken]);

  // Refresh live statistics and status
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [newStats, newStatus] = await Promise.all([
        getVotingStatistics(),
        getVotingStatus(),
      ]);
      setStats(newStats);
      setStatus(newStatus);
    } catch {
      // Ignore refresh error
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFilmId) {
      setMessage({ type: "error", text: "Silakan pilih salah satu film sebelum mengirim prediksi." });
      return;
    }
    if (!browserToken) {
      setMessage({ type: "error", text: "Browser token belum siap. Silakan muat ulang halaman." });
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result = await submitPrediction(selectedFilmId, browserToken, captchaToken);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setCurrentVotedFilmId(selectedFilmId);
        // Automatically refresh stats after submission
        handleRefresh();
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  const currentFilm = films.find((f) => f.id === currentVotedFilmId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header and Status Ribbon (PRD Section 4C & 5) */}
      <div className="text-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="gold">Audience Prediction</Badge>
          {status.is_open ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Voting Open</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Voting Closed</span>
            </span>
          )}
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Predict the Best Picture
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
          Pilih satu film favorit Anda yang diprediksi meraih penghargaan film terbaik di GPS Theater.
          Voting dibuka untuk umum tanpa registrasi akun.
        </p>

        {/* Voting Rules & Schedule Summary */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Batas Akhir: 4 Desember 2026, 23:59 WIB</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <Vote className="w-3.5 h-3.5 text-amber-400" />
            <span>1 Prediksi per Browser Token (Bisa Diperbarui)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Vote vs Live Standings) */}
      <div className="flex items-center justify-center border-b border-slate-800/80 pb-3">
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("vote")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "vote"
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <Vote className="w-4 h-4" />
            <span>Pilih Film ({films.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("standings");
              handleRefresh();
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "standings"
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Live Standings & Hasil</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${message.type === "success"
                ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
                : "bg-rose-950/70 border-rose-500/40 text-rose-200"
              }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-semibold">
                {message.type === "success" ? "Berhasil!" : "Perhatian:"}
              </span>{" "}
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Vote Indicator (PRD Section 5: Visitors can update their prediction) */}
      {currentVotedFilmId && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400">Prediksi Aktif Anda:</span>{" "}
              <span className="text-white font-bold text-sm">
                {currentFilm?.title || "Film Terpilih"}
              </span>
              <span className="text-amber-300 ml-1.5 font-medium">
                (Nominee #{currentFilm?.display_order})
              </span>
            </div>
          </div>
          <div className="text-slate-400 italic text-[11px]">
            Anda dapat mengubah pilihan Anda hingga batas akhir 4 Desember 2026.
          </div>
        </div>
      )}

      {/* TAB 1: VOTING FORM */}
      {activeTab === "vote" && (
        <form onSubmit={handleVoteSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {films.map((film) => {
              const isSelected = selectedFilmId === film.id;
              const isCurrentPrediction = currentVotedFilmId === film.id;

              return (
                <div
                  key={film.id}
                  onClick={() => status.is_open && setSelectedFilmId(film.id)}
                  className={`group relative p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 transition-all cursor-pointer ${isSelected
                      ? "bg-slate-900/95 border-amber-400 shadow-lg shadow-amber-500/15 ring-1 ring-amber-400"
                      : "bg-slate-950/70 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60"
                    } ${!status.is_open ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {/* Thumbnail Poster */}
                  <div className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-800">
                    {film.poster_url && (
                      <Image
                        src={film.poster_url}
                        alt={film.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                    <div className="absolute top-1 left-1 bg-black/80 px-1 py-0.2 rounded text-[9px] font-bold text-amber-300">
                      #{film.display_order}
                    </div>
                  </div>

                  {/* Film Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white group-hover:text-amber-200 transition-colors truncate">
                        {film.title}
                      </span>
                      {isCurrentPrediction && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/40 shrink-0">
                          Pilihan Anda
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {film.genre || "Student Film"} • {film.duration || "Short"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {film.short_description}
                    </p>
                  </div>

                  {/* Radio Visual Checkbox */}
                  <div className="shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected
                          ? "border-amber-400 bg-amber-400 text-slate-950"
                          : "border-slate-600 bg-slate-900"
                        }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CAPTCHA Widget (PRD Section 5 & 10) */}
          <TurnstileWidget onVerify={(t) => setCaptchaToken(t)} />

          {/* Submit Action Button */}
          <div className="pt-2 flex flex-col items-center justify-center space-y-3">
            {status.is_open ? (
              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isPending || !selectedFilmId}
                className="w-full sm:w-auto min-w-[260px] text-sm font-bold tracking-wide"
              >
                {isPending ? (
                  <span>Menyimpan Prediksi...</span>
                ) : currentVotedFilmId ? (
                  <span className="flex items-center gap-2">
                    <Vote className="w-4 h-4" />
                    <span>Perbarui Prediksi Saya</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Kirim Prediksi Best Picture</span>
                  </span>
                )}
              </Button>
            ) : (
              <div className="text-center p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 text-xs">
                Voting telah ditutup. Terima kasih atas partisipasi seluruh audiens!
              </div>
            )}

            <p className="text-[11px] text-slate-500 text-center max-w-md">
              Prediksi Best Picture adalah pilihan audiens dan tidak menentukan pemenang juri resmi.
              Setiap token browser hanya memiliki satu suara aktif.
            </p>
          </div>
        </form>
      )}

      {/* TAB 2: LIVE STANDINGS & RESULTS */}
      {activeTab === "standings" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Statistik Prediksi Audiens
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{status.total_votes}</span>
                <span className="text-xs font-normal text-slate-400">total suara masuk</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
              <span>{isRefreshing ? "Memperbarui..." : "Perbarui Hasil"}</span>
            </Button>
          </div>

          {/* Standings List */}
          <div className="space-y-3">
            {stats.map((item, idx) => {
              const isFirst = item.ranking === 1 && item.vote_count > 0;
              const isSecond = item.ranking === 2 && item.vote_count > 0;
              const isThird = item.ranking === 3 && item.vote_count > 0;

              return (
                <div
                  key={item.film_id}
                  className={`p-4 rounded-xl border transition-all ${isFirst
                      ? "bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border-amber-400/50 shadow-md shadow-amber-500/10"
                      : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700"
                    }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Ranking Badge */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isFirst
                            ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30"
                            : isSecond
                              ? "bg-slate-300 text-slate-950"
                              : isThird
                                ? "bg-amber-700 text-amber-100"
                                : "bg-slate-800 text-slate-400"
                          }`}
                      >
                        {isFirst ? <Trophy className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-sm text-white truncate flex items-center gap-2">
                          <span>{item.film_title}</span>
                          {isFirst && (
                            <span className="text-[10px] font-semibold text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded border border-amber-400/30">
                              Leading
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Nominee #{item.display_order}
                        </div>
                      </div>
                    </div>

                    {/* Percentage & Vote Count */}
                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-extrabold text-amber-200">
                        {item.percentage}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.vote_count} suara
                      </div>
                    </div>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isFirst
                          ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-sm shadow-amber-400/50"
                          : "bg-amber-500/60"
                        }`}
                      style={{ width: `${Math.max(item.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      )}
    </div>
  );
}
