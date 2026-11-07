"use client";

import { useState, useTransition } from "react";
import type { EventSettings } from "@/types";
import { updateEventSettings, type UpdateEventSettingsInput } from "@/lib/admin/event";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  Play,
} from "lucide-react";

interface EventManagementProps {
  initialSettings: EventSettings;
}

export function EventManagement({ initialSettings }: EventManagementProps) {
  const [form, setForm] = useState<UpdateEventSettingsInput>({
    title: initialSettings.title,
    school: initialSettings.school,
    event_date: initialSettings.event_date,
    venue: initialSettings.venue,
    tagline: initialSettings.tagline,
    description: initialSettings.description,
    trailer_url: initialSettings.trailer_url || "",
    is_published: initialSettings.is_published,
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await updateEventSettings(form);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Event Management</span>
            <Badge variant="gold">Grand Cinematic</Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure official event details, venue, dates, and publication status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {form.is_published ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Globe className="w-3.5 h-3.5" />
              <span>OFFICIALLY PUBLISHED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Lock className="w-3.5 h-3.5" />
              <span>DRAFT (UNPUBLISHED)</span>
            </span>
          )}
        </div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Publication Control Banner (PRD Section 8: Publish or unpublish the event) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Event Publication Status</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Voting opens automatically when the event is officially published. Publication timestamp is recorded automatically.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            <span className="ml-3 text-xs font-semibold text-slate-200">
              {form.is_published ? "Published (Live)" : "Unpublished (Draft)"}
            </span>
          </label>
        </div>

        {/* Event Core Details Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              School Name
            </label>
            <input
              type="text"
              required
              value={form.school || ""}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Dates
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={form.event_date || ""}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Venue
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={form.venue || ""}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Tagline
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.tagline || ""}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Official Event Trailer URL (YouTube / Video Link)
            </label>
            <div className="relative">
              <Play className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.trailer_url || ""}
                onChange={(e) => setForm({ ...form, trailer_url: e.target.value })}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Jika diisi, tombol &quot;Watch Trailer&quot; akan otomatis aktif dan muncul di Hero Section homepage.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Description (Homepage Overview)
            </label>
            <textarea
              rows={4}
              required
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="gold"
            disabled={isPending}
            className="text-xs font-bold px-6"
          >
            {isPending ? "Saving Settings..." : "Save Event Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}

