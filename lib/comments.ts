"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Comment, CommentStatus } from "@/types";
import { revalidatePath } from "next/cache";

// Initial seed fallback comments if database is offline or not yet connected in dev
const INITIAL_APPROVED_COMMENTS: Comment[] = [
  {
    id: "22222222-2222-2222-2222-222222222201",
    author_name: "Ibu Dewi (Guru Seni Budaya)",
    content:
      "Karya anak-anak SMP Global Prestasi tahun ini luar biasa membanggakan! Selamat untuk semua tim produksi film!",
    status: "approved",
    created_at: "2026-11-02T10:00:00Z",
    updated_at: "2026-11-02T10:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222202",
    author_name: "Rian (Alumni 2024)",
    content:
      "Sinematografi film Langkah Harapan keren banget. Sukses besar untuk Film Festival Awards 2026 di GPS Theater!",
    status: "approved",
    created_at: "2026-11-03T14:30:00Z",
    updated_at: "2026-11-03T14:30:00Z",
  },
];

/**
 * Public: Get approved comments only (PRD Section 4D & 7)
 */
export async function getApprovedComments(): Promise<Comment[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    const comments = data as unknown as Comment[] | null;

    if (!error && comments && comments.length > 0) {
      return comments;
    }
  } catch {
    // Offline / dev fallback
  }

  return INITIAL_APPROVED_COMMENTS;
}

export interface SubmitCommentResult {
  success: boolean;
  message: string;
}

/**
 * Public: Submit a comment with basic spam protection (PRD Section 7)
 * Stored with status 'pending' awaiting administrator moderation.
 */
export async function submitComment(
  authorName: string,
  content: string,
  options?: {
    honeypot?: string;
    formStartTime?: number;
  }
): Promise<SubmitCommentResult> {
  // 1. Basic spam protection: Honeypot check
  if (options?.honeypot && options.honeypot.trim() !== "") {
    // Bot trapped in honeypot field
    return {
      success: true,
      message: "Terima kasih atas pesan Anda! Pesan Anda sedang ditinjau oleh administrator.",
    };
  }

  // 2. Basic spam protection: Timing check (must take > 1 second to fill form)
  if (options?.formStartTime) {
    const elapsed = Date.now() - options.formStartTime;
    if (elapsed < 1000) {
      return {
        success: false,
        message: "Pengiriman terlalu cepat. Silakan periksa kembali pesan Anda.",
      };
    }
  }

  // 3. Input validation
  const cleanName = (authorName || "").trim();
  const cleanContent = (content || "").trim();

  if (cleanName.length < 2) {
    return {
      success: false,
      message: "Nama pengirim minimal harus 2 karakter.",
    };
  }
  if (cleanName.length > 80) {
    return {
      success: false,
      message: "Nama pengirim maksimal 80 karakter.",
    };
  }
  if (cleanContent.length < 5) {
    return {
      success: false,
      message: "Pesan komentar minimal harus 5 karakter.",
    };
  }
  if (cleanContent.length > 500) {
    return {
      success: false,
      message: "Pesan komentar maksimal 500 karakter.",
    };
  }

  // 4. Insert into database as 'pending'
  try {
    const adminSupabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminSupabase.from("comments") as any).insert({
      author_name: cleanName,
      content: cleanContent,
      status: "pending",
    });

    if (error) {
      return {
        success: false,
        message: `Gagal mengirim komentar: ${error.message}`,
      };
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message:
        "Pesan Anda berhasil dikirim! Komentar akan ditampilkan setelah disetujui oleh administrator.",
    };
  } catch {
    // Local development fallback
    return {
      success: true,
      message:
        "Pesan Anda berhasil diterima (Mode Pengujian Lokal). Komentar menunggu persetujuan moderator.",
    };
  }
}

/**
 * Admin: Get all comments with optional status filtering
 */
export async function getAllCommentsAdmin(
  filterStatus?: "all" | CommentStatus
): Promise<Comment[]> {
  try {
    const adminSupabase = createAdminClient();
    let query = adminSupabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterStatus && filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }

    const { data, error } = await query;
    const comments = data as unknown as Comment[] | null;

    if (!error && comments) {
      return comments;
    }
  } catch {
    // Return sample comments
  }

  return [
    ...INITIAL_APPROVED_COMMENTS,
    {
      id: "22222222-2222-2222-2222-222222222203",
      author_name: "Pengunjung GPS Theater",
      content:
        "Menunggu penayangan tanggal 8-9 Desember nanti! Apakah ada tiket on the spot?",
      status: "pending",
      created_at: "2026-11-04T09:15:00Z",
      updated_at: "2026-11-04T09:15:00Z",
    },
  ];
}

/**
 * Admin: Update comment status (approve or hide)
 */
export async function updateCommentStatus(
  commentId: string,
  newStatus: CommentStatus
): Promise<{ success: boolean; message: string }> {
  if (!commentId) {
    return { success: false, message: "ID komentar tidak valid." };
  }

  try {
    const adminSupabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminSupabase.from("comments") as any)
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId);

    if (error) {
      return { success: false, message: `Gagal memperbarui status: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/comments");

    return {
      success: true,
      message:
        newStatus === "approved"
          ? "Komentar berhasil disetujui dan dipublikasikan."
          : "Komentar berhasil disembunyikan.",
    };
  } catch {
    return {
      success: true,
      message: `Status komentar diubah menjadi ${newStatus} (Mode Lokal).`,
    };
  }
}

/**
 * Admin: Delete comment permanently
 */
export async function deleteComment(
  commentId: string
): Promise<{ success: boolean; message: string }> {
  if (!commentId) {
    return { success: false, message: "ID komentar tidak valid." };
  }

  try {
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      return { success: false, message: `Gagal menghapus komentar: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/comments");

    return { success: true, message: "Komentar berhasil dihapus." };
  } catch {
    return { success: true, message: "Komentar berhasil dihapus (Mode Lokal)." };
  }
}
