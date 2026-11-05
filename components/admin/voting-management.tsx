"use client";

import { useState, useTransition } from "react";
import type { VotingStatus, VotingStatisticsItem } from "@/types";
import { toggleManualVotingClosure, getVotingCSVData } from "@/lib/admin/voting";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Download,
  Power,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Trophy,
} from "lucide-react";

interface VotingManagementProps {
  initialStatus: VotingStatus;
  initialStats: VotingStatisticsItem[];
}

export function VotingManagement({
  initialStatus,
  initialStats,
}: VotingManagementProps) {
  const [status, setStatus] = useState<VotingStatus>(initialStatus);
  const [stats] = useState<VotingStatisticsItem[]>(initialStats);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleManual = (closeManually: boolean) => {
    const confirmPrompt = closeManually
      ? "Apakah Anda yakin ingin MENUTUP voting Best Picture secara manual?"
      : "Apakah Anda yakin ingin MEMBUKA kembali voting Best Picture?";

    if (!window.confirm(confirmPrompt)) return;

    setMessage(null);
    startTransition(async () => {
      const res = await toggleManualVotingClosure(closeManually);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setStatus((prev) => ({
          ...prev,
          is_manually_closed: closeManually,
          is_open: !closeManually && new Date().getTime() <= new Date(prev.voting_deadline).getTime(),
        }));
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvString = await getVotingCSVData();
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ffa-voting-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setMessage({ type: "error", text: "Gagal mengekspor data voting." });
    } finally {
      setIsExporting(false);
    }
  };

  const formatTimestamp = (iso: string | null) => {
    if (!iso) return "Not set";
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }).format(d);
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Voting Management</span>
            <Badge variant="gold">Best Picture</Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor public audience prediction standings, timestamps, and manual controls.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isExporting}
          onClick={handleExportCSV}
          className="gap-1.5 text-xs font-semibold"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>{isExporting ? "Exporting CSV..." : "Export Voting Data (CSV)"}</span>
        </Button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/70 border-rose-500/40 text-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Status & Timestamps Overview Grid (PRD Section 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Voting Status & Manual Override Toggle */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Voting Status
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              {status.is_open ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>OPEN FOR VOTING</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>CLOSED</span>
                </span>
              )}
            </div>
            {status.is_manually_closed && (
              <p className="text-[11px] text-amber-400 mt-1 font-medium">
                • Closed manually by administrator
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-900">
            {status.is_manually_closed ? (
              <Button
                type="button"
                variant="gold"
                size="sm"
                disabled={isPending}
                onClick={() => handleToggleManual(false)}
                className="w-full text-xs font-bold gap-1.5"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Re-open Voting</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={() => handleToggleManual(true)}
                className="w-full text-xs font-bold gap-1.5"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Close Voting Manually</span>
              </Button>
            )}
          </div>
        </div>

        {/* Opening Timestamp */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider">Opening Timestamp</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white pt-1">
            {formatTimestamp(status.published_at)}
          </div>
          <p className="text-[11px] text-slate-400">
            Opened automatically upon official event publication.
          </p>
        </div>

        {/* Closing Timestamp */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider">Closing Deadline</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-amber-300 pt-1">
            {formatTimestamp(status.voting_deadline)}
          </div>
          <p className="text-[11px] text-slate-400">
            Enforced by server/database clock (Asia/Jakarta).
          </p>
        </div>
      </div>

      {/* Aggregate Standings Table (PRD Section 8: Total votes, percentages, rankings) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Aggregate Voting Rankings</span>
          </div>
          <span className="text-xs text-slate-400">
            Total Votes: <strong className="text-white">{status.total_votes}</strong>
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Film Nominee</th>
                <th className="py-3 px-4 text-right">Votes</th>
                <th className="py-3 px-4 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {stats.map((item, idx) => (
                <tr key={item.film_id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    <span className="inline-flex items-center gap-1.5">
                      {idx === 0 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>#{item.ranking}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{item.film_title}</div>
                    <div className="text-[10px] text-slate-500">Nominee #{item.display_order}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    {item.vote_count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-300">
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

