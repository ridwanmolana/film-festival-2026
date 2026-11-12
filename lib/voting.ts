"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { EVENT_CONSTANTS } from "@/lib/constants";
import { INITIAL_FILMS } from "@/lib/films";
import type { VotingStatisticsItem, VotingStatus, EventSettings } from "@/types";
import { headers } from "next/headers";
import crypto from "crypto";

const VOTING_DEADLINE_MS = new Date(EVENT_CONSTANTS.VOTING_DEADLINE_ISO).getTime();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// CAPTCHA is mandatory in production. Accept literal "your-..." placeholders so
// local dev keeps working, but a real-looking key must verify.
function isTurnstileEnforced(): boolean {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  return Boolean(secret) && !secret!.startsWith("your-");
}

/**
 * Server-side check if voting is currently open according to server clock and database settings
 */
export async function getVotingStatus(): Promise<VotingStatus> {
  const now = Date.now();

  // Primary check: Server clock vs official deadline (4 December 2026 23:59:59 WIB)
  const isPastDeadline = now > VOTING_DEADLINE_MS;

  try {
    const supabase = await createClient();
    const [settingsRes, countRes] = await Promise.all([
      supabase
        .from("event_settings")
        .select("is_published, published_at, voting_deadline, is_voting_manually_closed")
        .eq("id", 1)
        .maybeSingle(),
      supabase
        .from("predictions")
        .select("id", { count: "exact", head: true }),
    ]);

    const settings = settingsRes.data as unknown as Pick<
      EventSettings,
      "is_published" | "published_at" | "voting_deadline" | "is_voting_manually_closed"
    > | null;

    const totalVotes = countRes.count ?? 0;

    if (settings) {
      const isPublished = settings.is_published;
      const isManuallyClosed = settings.is_voting_manually_closed;
      const dbDeadlineMs = settings.voting_deadline
        ? new Date(settings.voting_deadline).getTime()
        : VOTING_DEADLINE_MS;

      const isOpen = isPublished && !isManuallyClosed && now <= dbDeadlineMs;

      return {
        is_open: isOpen,
        published_at: settings.published_at,
        voting_deadline: settings.voting_deadline || EVENT_CONSTANTS.VOTING_DEADLINE_ISO,
        is_manually_closed: isManuallyClosed,
        total_votes: totalVotes,
      };
    }
  } catch {
    // If Supabase is offline/placeholder in dev
  }

  return {
    is_open: !isPastDeadline,
    published_at: "2026-11-01T00:00:00+07:00",
    voting_deadline: EVENT_CONSTANTS.VOTING_DEADLINE_ISO,
    is_manually_closed: false,
    total_votes: 0,
  };
}

/**
 * Fetch aggregate voting statistics (PRD Section 4C & 5)
 * Aggregate-only: never exposes individual browser tokens or IP addresses
 */
export async function getVotingStatistics(): Promise<VotingStatisticsItem[]> {
  try {
    const supabase = await createClient();
    const { data: rawStats, error } = await supabase
      .from("voting_statistics")
      .select("*")
      .order("ranking", { ascending: true });

    const stats = rawStats as unknown as VotingStatisticsItem[] | null;

    if (!error && stats && stats.length > 0) {
      return stats.map((s) => ({
        film_id: s.film_id,
        film_title: s.film_title,
        poster_url: s.poster_url,
        display_order: s.display_order,
        vote_count: Number(s.vote_count),
        percentage: Number(s.percentage),
        ranking: Number(s.ranking),
      }));
    }
  } catch {
    // Fallback if Supabase not yet connected
  }

  // Fallback initial baseline stats with 0 votes for each film
  return INITIAL_FILMS.map((film, index) => ({
    film_id: film.id,
    film_title: film.title,
    poster_url: film.poster_url,
    display_order: film.display_order,
    vote_count: 0,
    percentage: 0,
    ranking: index + 1,
  }));
}

/**
 * Look up the existing prediction for an anonymous browser token
 */
export async function getMyPrediction(browserToken: string): Promise<string | null> {
  if (!browserToken || typeof browserToken !== "string" || browserToken.trim() === "") {
    return null;
  }

  try {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from("predictions")
      .select("film_id")
      .eq("browser_token", browserToken.trim())
      .maybeSingle();

    const record = data as unknown as { film_id: string } | null;

    if (!error && record) {
      return record.film_id;
    }
  } catch {
    // Return null if offline
  }

  return null;
}

export interface SubmitVoteResult {
  success: boolean;
  message: string;
  filmId?: string;
  isUpdate?: boolean;
}

/**
 * Server-side voting submission with server clock validation, CAPTCHA verification, and UPSERT
 */
export async function submitPrediction(
  filmId: string,
  browserToken: string,
  captchaToken?: string
): Promise<SubmitVoteResult> {
  // 1. Validate inputs
  if (!filmId || typeof filmId !== "string" || filmId.trim() === "") {
    return { success: false, message: "Pilihan film tidak valid." };
  }
  if (!browserToken || typeof browserToken !== "string" || browserToken.trim() === "") {
    return { success: false, message: "Browser token tidak ditemukan." };
  }
  // ponytail: tokens are client-supplied UUIDs. Stronger anti-fraud = IP-based
  // rate limiting + server-issued signed token; add only if ballot stuffing is seen.
  if (!UUID_RE.test(browserToken.trim())) {
    return { success: false, message: "Browser token tidak valid." };
  }

  const cleanFilmId = filmId.trim();
  const cleanToken = browserToken.trim();

  // 2. DB-shaped validation of the film id
  if (!UUID_RE.test(cleanFilmId)) {
    return { success: false, message: "Pilihan film tidak valid." };
  }

  // 3. Server-side schedule check
  const status = await getVotingStatus();
  if (!status.is_open) {
    return {
      success: false,
      message: "Periode prediksi Best Picture saat ini ditutup. Batas akhir: 4 Desember 2026, 23:59 WIB.",
    };
  }

  // 4. CAPTCHA verification (Cloudflare Turnstile) - required in production
  const isProduction = process.env.NODE_ENV === "production";
  if (isTurnstileEnforced() || isProduction) {
    if (!captchaToken) {
      return { success: false, message: "Verifikasi CAPTCHA diperlukan sebelum mengirim prediksi." };
    }

    try {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY ?? "",
          response: captchaToken,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return { success: false, message: "Verifikasi CAPTCHA gagal. Silakan coba lagi." };
      }
    } catch {
      return { success: false, message: "Gagal memverifikasi CAPTCHA. Silakan periksa koneksi Anda." };
    }
  }

  // 4. IP hash & User Agent for fraud auditing
  let ipHash: string | null = null;
  let userAgent: string | null = null;
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = forwardedFor ? forwardedFor.split(",")[0] : headersList.get("x-real-ip") || "unknown";
    ipHash = crypto.createHash("sha256").update(realIp).digest("hex").slice(0, 32);
    userAgent = headersList.get("user-agent") || null;
  } catch {
    // Header reading fallback
  }

  // 5. Validate film exists and Database UPSERT (One active prediction per token)
  try {
    const adminSupabase = createAdminClient();

    const { data: filmRow, error: filmError } = await adminSupabase
      .from("films")
      .select("id")
      .eq("id", cleanFilmId)
      .maybeSingle();

    if (filmError || !filmRow) {
      return { success: false, message: "Film yang dipilih tidak ditemukan." };
    }

    // Check if token already has an existing vote (to indicate whether this is an update)
    const { data: existingData, error: existingError } = await adminSupabase
      .from("predictions")
      .select("id, film_id")
      .eq("browser_token", cleanToken)
      .maybeSingle();

    if (existingError) {
      return { success: false, message: "Gagal memeriksa prediksi Anda. Silakan coba lagi." };
    }

    const isUpdate = Boolean(existingData);

    const upsertPayload: Record<string, unknown> = {
      browser_token: cleanToken,
      film_id: cleanFilmId,
      ip_hash: ipHash,
      user_agent: userAgent,
      updated_at: new Date().toISOString(),
    };

    const { error } = await adminSupabase
      .from("predictions")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(upsertPayload as any, {
        onConflict: "browser_token",
      });

    if (error) {
      return { success: false, message: `Gagal menyimpan prediksi: ${error.message}` };
    }

    return {
      success: true,
      message: isUpdate
        ? "Prediksi Best Picture Anda berhasil diperbarui!"
        : "Terima kasih! Prediksi Best Picture Anda berhasil disimpan.",
      filmId: cleanFilmId,
      isUpdate,
    };
  } catch (err) {
    // Never report a vote as saved when it was not persisted.
    console.error("submitPrediction failed:", err);
    return { success: false, message: "Terjadi kesalahan saat menyimpan prediksi. Silakan coba lagi." };
  }
}
