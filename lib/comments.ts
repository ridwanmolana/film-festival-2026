"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Comment, CommentStatus } from "@/types";
import { revalidatePath } from "next/cache";

export const COMMENTS_PAGE_SIZE = 10;

export interface ApprovedCommentsResult {
  comments: Comment[];
  total: number;
}

/**
 * Public: Get visible comments, paginated (PRD Section 4D & 7)
 * Instant publication: only 'hidden' is excluded, so new comments show immediately.
 * Uses the service-role client so unmoderated comments bypass the public
 * "approved only" RLS policy while stays hidden.
 */
export async function getApprovedComments(
  offset = 0,
  limit = COMMENTS_PAGE_SIZE
): Promise<ApprovedCommentsResult> {
  const safeOffset = Math.max(0, Math.floor(offset));
  const safeLimit = Math.max(1, Math.floor(limit));

  try {
    const adminSupabase = createAdminClient();
    const { data, error, count } = await adminSupabase
      .from("comments")
      .select("*", { count: "exact" })
      .neq("status", "hidden")
      .order("created_at", { ascending: false })
      .range(safeOffset, safeOffset + safeLimit - 1);

    const comments = data as unknown as Comment[] | null;

    if (!error && comments) {
      return { comments, total: count ?? comments.length };
    }
  } catch {
    // DB unreachable: show empty wall rather than fake data
  }

  return { comments: [], total: 0 };
}

export interface SubmitCommentResult {
  success: boolean;
  message: string;
}

/**
 * Public: Submit a comment with basic spam protection (PRD Section 7)
 * Published instantly as 'approved'; admins can hide it later.
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

  // 4. Insert into database, published immediately (explicit status so DB default cannot queue it)
  try {
    const adminSupabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminSupabase.from("comments") as any).insert({
      author_name: cleanName,
      content: cleanContent,
      status: "approved",
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
        "Pesan Anda berhasil dikirim dan langsung tampil di kolom komentar!",
    };
  } catch {
    return {
      success: false,
      message: "Gagal terhubung ke database komentar. Coba lagi sebentar.",
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
    // DB unreachable
  }

  return [];
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
      success: false,
      message: "Gagal terhubung ke database. Status komentar tidak berubah.",
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
    return { success: false, message: "Gagal terhubung ke database. Komentar tidak dihapus." };
  }
}
