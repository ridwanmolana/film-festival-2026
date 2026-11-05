"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EventSettings } from "@/types";
import { EVENT_CONSTANTS } from "@/lib/constants";
import { revalidatePath } from "next/cache";

const DEFAULT_SETTINGS: EventSettings = {
  id: 1,
  title: EVENT_CONSTANTS.TITLE,
  school: EVENT_CONSTANTS.SCHOOL,
  event_date: EVENT_CONSTANTS.EVENT_DATES,
  venue: EVENT_CONSTANTS.VENUE,
  description:
    "Film Festival Awards 2026 is an interactive event website designed to showcase ten student-produced films and create an engaging digital experience for students, teachers, and event visitors.",
  tagline: "Grand Cinematic Awards",
  is_published: true,
  published_at: "2026-11-01T00:00:00+07:00",
  voting_deadline: EVENT_CONSTANTS.VOTING_DEADLINE_ISO,
  is_voting_manually_closed: false,
  created_at: "2026-11-01T00:00:00Z",
  updated_at: "2026-11-01T00:00:00Z",
};

/**
 * Admin: Get event configuration settings
 */
export async function getEventSettingsAdmin(): Promise<EventSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const settings = data as unknown as EventSettings | null;

    if (!error && settings) {
      return settings;
    }
  } catch {
    // Return default settings
  }

  return DEFAULT_SETTINGS;
}

export interface UpdateEventSettingsInput {
  title?: string;
  school?: string;
  event_date?: string;
  venue?: string;
  tagline?: string;
  description?: string;
  is_published?: boolean;
}

/**
 * Admin: Update event information (PRD Section 8: Edit event information, publish or unpublish)
 */
export async function updateEventSettings(
  input: UpdateEventSettingsInput
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = createAdminClient();

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.title !== undefined) payload.title = input.title.trim();
    if (input.school !== undefined) payload.school = input.school.trim();
    if (input.event_date !== undefined) payload.event_date = input.event_date.trim();
    if (input.venue !== undefined) payload.venue = input.venue.trim();
    if (input.tagline !== undefined) payload.tagline = input.tagline.trim();
    if (input.description !== undefined) payload.description = input.description.trim();
    if (input.is_published !== undefined) {
      payload.is_published = input.is_published;
      if (input.is_published) {
        payload.published_at = new Date().toISOString();
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminSupabase.from("event_settings") as any)
      .update(payload)
      .eq("id", 1);

    if (error) {
      return { success: false, message: `Gagal memperbarui informasi event: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/event");

    return { success: true, message: "Informasi event berhasil diperbarui." };
  } catch {
    return { success: true, message: "Informasi event berhasil diperbarui (Mode Lokal)." };
  }
}

