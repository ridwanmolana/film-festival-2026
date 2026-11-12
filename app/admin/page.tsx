import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EVENT_CONSTANTS } from "@/lib/constants";
import type { EventSettings, Comment } from "@/types";
import {
  Film,
  MessageSquare,
  Award,
  Database,
  CheckCircle2,
  ArrowRight,
  Settings,
  Download,
} from "lucide-react";
import Link from "next/link";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminDashboardOverviewPage() {
  unstable_noStore();
  const supabase = await createClient();

  // Load baseline statistics from database
  const [filmsRes, commentsRes, predictionsRes, settingsRes] = await Promise.all([
    supabase.from("films").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id, status"),
    supabase.from("predictions").select("id", { count: "exact", head: true }),
    supabase.from("event_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  const totalFilms = filmsRes.count ?? 0;
  const totalPredictions = predictionsRes.count ?? 0;

  const comments = (commentsRes.data as unknown as Pick<Comment, "id" | "status">[] | null) || [];
  const approvedComments = comments.filter((c) => c.status === "approved").length;
  const pendingComments = comments.filter((c) => c.status === "pending").length;

  const settings = settingsRes.data as unknown as EventSettings | null;
  const isPublished = settings?.is_published ?? true;
  const isManuallyClosed = settings?.is_voting_manually_closed ?? false;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Admin Dashboard</span>
            <Badge variant="gold">Event Operations</Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {EVENT_CONSTANTS.TITLE} • {EVENT_CONSTANTS.SCHOOL} • {EVENT_CONSTANTS.VENUE}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/comments"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comments ({pendingComments} pending)</span>
          </Link>
          <Link
            href="/admin/voting"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Votes</span>
          </Link>
        </div>
      </div>

      {/* Operational Status Banner */}
      <Card className="cinematic-card border-emerald-500/30 bg-emerald-950/20">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-slate-200">
            <span className="font-semibold text-emerald-300">Admin Operations Active:</span>{" "}
            Full management for Films (10 slots, crew, posters), Voting (schedule, manual toggle, CSV export), Comments (moderation workflow), and Event publication are operational.
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview Grid (PRD Section 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Films Card */}
        <Card className="cinematic-card hover:border-amber-400/50 transition-colors group">
          <Link href="/admin/films" className="block p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-slate-400">Total Films</span>
              <Film className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalFilms}</div>
            <p className="text-[11px] text-amber-300 font-medium mt-1 flex items-center gap-1">
              <span>Manage 10 Nominees</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>
        </Card>

        {/* Predictions Card */}
        <Card className="cinematic-card hover:border-amber-400/50 transition-colors group">
          <Link href="/admin/voting" className="block p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-slate-400">Total Predictions</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalPredictions}</div>
            <p className="text-[11px] text-amber-300 font-medium mt-1 flex items-center gap-1">
              <span>View Standings & Controls</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>
        </Card>

        {/* Community Comments Card */}
        <Card className="cinematic-card hover:border-amber-400/50 transition-colors group">
          <Link href="/admin/comments" className="block p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-slate-400">Community Comments</span>
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {approvedComments} <span className="text-xs font-normal text-slate-400">approved</span>
            </div>
            <p className="text-[11px] text-amber-400 font-medium mt-1 flex items-center gap-1">
              <span>{pendingComments} pending review</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>
        </Card>

        {/* Event Schedule Card */}
        <Card className="cinematic-card hover:border-amber-400/50 transition-colors group">
          <Link href="/admin/event" className="block p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-slate-400">Event & Schedule</span>
              <Settings className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-semibold text-white truncate">
              {isManuallyClosed ? "Voting Closed (Manual)" : isPublished ? "Published (Live)" : "Draft"}
            </div>
            <p className="text-[11px] text-amber-300 font-medium mt-1 flex items-center gap-1">
              <span>Edit Event Details</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>
        </Card>
      </div>

      {/* Quick Access Operations Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <Card className="cinematic-card p-5 space-y-3">
          <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-amber-200">
              Content & Film Showcase
            </CardTitle>
            <Film className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <p className="text-slate-400 leading-relaxed">
            Update movie synopsis, upload new posters, manage student crew member information, and set film card display order.
          </p>
          <div className="pt-1">
            <Link
              href="/admin/films"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold"
            >
              <span>Go to Film Management &rarr;</span>
            </Link>
          </div>
        </Card>

        <Card className="cinematic-card p-5 space-y-3">
          <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-amber-200">
              Voting & Predictions
            </CardTitle>
            <Award className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <p className="text-slate-400 leading-relaxed">
            Monitor real-time rankings, manage opening/closing timestamps, override voting status manually, and export voting records to CSV.
          </p>
          <div className="pt-1">
            <Link
              href="/admin/voting"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold"
            >
              <span>Go to Voting Management &rarr;</span>
            </Link>
          </div>
        </Card>
      </div>

      {/* Architecture & Verification Summary */}
      <Card className="cinematic-card">
        <CardContent className="p-6">
          <div className="text-sm font-bold text-amber-200 flex items-center gap-2 mb-3">
            <Database className="w-4 h-4" />
            <span>Production Architecture Summary (PRD Version 1.1)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div>
              <strong className="text-slate-200 block mb-1">Single Page Architecture:</strong>
              Homepage hosts Showcase, Prediction, Community, and Event Info without separate film detail pages or sub-routes.
            </div>
            <div>
              <strong className="text-slate-200 block mb-1">Administrative Autonomy:</strong>
              All event information, film metadata, crew details, posters, and voting state can be managed directly via dashboard without modifying code.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
