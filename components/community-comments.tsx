"use client";

import { useState, useTransition, useRef } from "react";
import type { Comment } from "@/types";
import { submitComment, getApprovedComments } from "@/lib/comments";
import { COMMENTS_PAGE_SIZE } from "@/lib/comments-config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommunityCommentsProps {
  initialComments: Comment[];
  initialTotal: number;
}

export function CommunityComments({ initialComments, initialTotal }: CommunityCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [total, setTotal] = useState(initialTotal);
  const [loadingMore, setLoadingMore] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const formStartTimeRef = useRef<number | null>(null);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStartTyping = () => {
    if (!formStartTimeRef.current) {
      formStartTimeRef.current = Date.now();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const startTime = formStartTimeRef.current || Date.now() - 2000;

    startTransition(async () => {
      const result = await submitComment(authorName, content, {
        honeypot,
        formStartTime: startTime,
      });

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setAuthorName("");
        setContent("");
        formStartTimeRef.current = null;
        // Reload first page so the new comment appears instantly
        const fresh = await getApprovedComments(0, Math.max(comments.length, COMMENTS_PAGE_SIZE));
        setComments(fresh.comments);
        setTotal(fresh.total);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const next = await getApprovedComments(comments.length, COMMENTS_PAGE_SIZE);
      setComments((prev) => [...prev, ...next.comments.filter((c) => !prev.some((p) => p.id === c.id))]);
      setTotal(next.total);
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="gold">Community Messages</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Filmmaker Wishes & Messages
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
         A heartfelt message of appreciation and encouragement to all students, directors, and production crew members who have contributed their creativity, passion, and hard work to the Film Festival Awards 2026. Your dedication and teamwork have made this cinematic journey truly special. Keep creating, keep inspiring, and never stop telling your stories!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Comment Submission Form (PRD Section 4D & 7) */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/25 p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Kirim Pesan Dukungan</h3>
              <p className="text-[11px] text-slate-400">Terbuka untuk guru, murid, orang tua, & pengunjung</p>
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  message.type === "success"
                    ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
                    : "bg-rose-950/70 border-rose-500/40 text-rose-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field for bot spam trap (PRD Section 7) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_url">Website</label>
              <input
                id="website_url"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nama Anda <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={authorName}
                onFocus={handleStartTyping}
                onChange={(e) => {
                  handleStartTyping();
                  setAuthorName(e.target.value);
                }}
                placeholder="Contoh: Budi Santoso (Kelas 8A)"
                className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Pesan / Ucapan <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] text-slate-500">
                  {content.length}/500
                </span>
              </div>
              <textarea
                required
                rows={4}
                maxLength={500}
                value={content}
                onFocus={handleStartTyping}
                onChange={(e) => {
                  handleStartTyping();
                  setContent(e.target.value);
                }}
                placeholder="Tuliskan ucapan selamat atau kesan Anda terhadap karya film festival..."
                className="w-full p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
              <span>
                Pesan Anda langsung tampil di kolom komentar. Administrator dapat
                menyembunyikan pesan yang tidak sesuai.
              </span>
            </div>

            <Button
              type="submit"
              variant="gold"
              disabled={isPending || !authorName.trim() || !content.trim()}
              className="w-full text-xs font-bold tracking-wide"
            >
              {isPending ? (
                <span>Mengirim...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesan Dukungan</span>
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Comments Wall (PRD Section 4D: instant comments, 10 per page) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Pesan Komunitas ({total})</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Menampilkan {comments.length} dari {total}
            </span>
          </div>

          {comments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950/50 border border-slate-800 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-amber-400/50 mx-auto" />
              <p className="text-sm font-medium text-slate-300">Belum ada pesan</p>
              <p className="text-xs">
                Jadilah orang pertama yang mengirimkan ucapan hangat untuk para pembuat film!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {comments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/15 hover:border-amber-400/30 transition-colors space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center justify-center text-xs font-bold">
                        {item.author_name.charAt(0)}
                      </span>
                      <span>{item.author_name}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{formatDate(item.created_at)}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                    {item.content}
                  </p>
                </div>
              ))}

              {comments.length < total && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={loadingMore}
                  onClick={handleLoadMore}
                  className="w-full text-xs h-9"
                >
                  {loadingMore ? "Memuat..." : `Muat ${Math.min(COMMENTS_PAGE_SIZE, total - comments.length)} pesan lainnya`}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
