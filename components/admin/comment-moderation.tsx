"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Comment, CommentStatus } from "@/types";
import { updateCommentStatus, deleteComment, ADMIN_COMMENTS_PAGE_SIZE } from "@/lib/comments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  EyeOff,
  Trash2,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  User,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CommentModerationProps {
  initialComments: Comment[];
  total: number;
  currentPage: number;
  currentFilter: "all" | CommentStatus;
}

export function CommentModeration({
  initialComments,
  total,
  currentPage,
  currentFilter,
}: CommentModerationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / ADMIN_COMMENTS_PAGE_SIZE));

  // ─── Navigation helpers ────────────────────────────────────────────
  function navigate(newPage: number, newFilter?: "all" | CommentStatus) {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(newPage));
    sp.set("filter", newFilter ?? currentFilter);
    router.push(`${pathname}?${sp.toString()}`);
  }

  function setFilter(filter: "all" | CommentStatus) {
    navigate(1, filter);
  }

  function refresh() {
    router.refresh();
  }

  // ─── Actions ──────────────────────────────────────────────────────
  const handleStatusChange = (commentId: string, newStatus: CommentStatus) => {
    setActionMessage(null);
    startTransition(async () => {
      const res = await updateCommentStatus(commentId, newStatus);
      if (res.success) {
        setActionMessage({ type: "success", text: res.message });
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, status: newStatus } : c))
        );
      } else {
        setActionMessage({ type: "error", text: res.message });
      }
    });
  };

  const handleDelete = (commentId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini secara permanen?")) {
      return;
    }
    setActionMessage(null);
    startTransition(async () => {
      const res = await deleteComment(commentId);
      if (res.success) {
        setActionMessage({ type: "success", text: res.message });
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        setActionMessage({ type: "error", text: res.message });
      }
    });
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

  // Filter tabs config
  const tabs: { key: "all" | CommentStatus; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "hidden", label: "Hidden" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Comment Moderation</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-200">
              {total} total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Approve, hide, atau hapus komentar dari pengunjung.
          </p>
        </div>

        {/* Filter Tabs + Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  currentFilter === tab.key
                    ? tab.key === "approved"
                      ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                      : tab.key === "hidden"
                      ? "bg-slate-700/50 text-slate-200 font-bold border border-slate-600"
                      : "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
                {tab.key === "all" && ` (${total})`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={isPending}
            title="Refresh data"
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Action feedback */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            actionMessage.type === "success"
              ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/70 border-rose-500/40 text-rose-200"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Pagination info */}
      {total > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Halaman {currentPage} dari {totalPages} &nbsp;·&nbsp; {total} komentar
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => navigate(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-slate-600">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => navigate(p as number)}
                    disabled={isPending}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                      p === currentPage
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              type="button"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => navigate(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
            <Filter className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p>Tidak ada komentar dalam kategori ini.</p>
          </div>
        ) : (
          comments.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.status === "pending"
                  ? "bg-amber-500/5 border-amber-500/30"
                  : item.status === "approved"
                  ? "bg-slate-950/70 border-slate-800"
                  : "bg-slate-950/40 border-slate-800/60 opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-amber-300 font-bold shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-white mr-2">
                      {item.author_name}
                    </span>
                    <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{formatDate(item.created_at)}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === "pending" && (
                    <Badge variant="gold" className="text-[10px] font-bold">
                      PENDING REVIEW
                    </Badge>
                  )}
                  {item.status === "approved" && (
                    <Badge variant="success" className="text-[10px] font-bold">
                      APPROVED
                    </Badge>
                  )}
                  {item.status === "hidden" && (
                    <Badge variant="secondary" className="text-[10px] font-bold">
                      HIDDEN
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-9 mb-4">
                &ldquo;{item.content}&rdquo;
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                {item.status !== "approved" && (
                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleStatusChange(item.id, "approved")}
                    className="text-xs h-7 px-3 gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </Button>
                )}

                {item.status !== "hidden" && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleStatusChange(item.id, "hidden")}
                    className="text-xs h-7 px-3 gap-1"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </Button>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleDelete(item.id)}
                  className="text-xs h-7 px-2.5 gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={currentPage <= 1 || isPending}
            onClick={() => navigate(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <span className="text-xs text-slate-500 px-3">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || isPending}
            onClick={() => navigate(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 transition-colors"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
