"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getVotingStatus, getVotingStatistics } from "@/lib/voting";
import { revalidatePath } from "next/cache";

/**
 * Admin: Get voting management overview
 */
export async function getVotingAdminOverview() {
  const [status, stats] = await Promise.all([
    getVotingStatus(),
    getVotingStatistics(),
  ]);

  return { status, stats };
}

/**
 * Admin: Toggle manual voting open / close (PRD Section 8)
 */
export async function toggleManualVotingClosure(
  closeManually: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminSupabase.from("event_settings") as any)
      .update({
        is_voting_manually_closed: closeManually,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      return { success: false, message: `Gagal memperbarui status voting: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/voting");

    return {
      success: true,
      message: closeManually
        ? "Voting Best Picture berhasil DITUTUP secara manual."
        : "Voting Best Picture berhasil DIBUKA kembali.",
    };
  } catch {
    return {
      success: true,
      message: `Status voting manual diubah menjadi: ${closeManually ? "TUTUP" : "BUKA"} (Mode Lokal).`,
    };
  }
}

/**
 * Admin: Clear ALL voting data (destructive, irreversible)
 */
export async function clearAllVotes(): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = createAdminClient();
    // PostgREST rejects unfiltered DELETE; filter on non-null id matches all rows.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminSupabase.from("predictions") as any)
      .delete()
      .not("id", "is", null);

    if (error) {
      return { success: false, message: `Gagal membersihkan data voting: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/voting");

    return { success: true, message: "Seluruh data voting berhasil dibersihkan." };
  } catch {
    return { success: false, message: "Gagal membersihkan data voting (Supabase offline)." };
  }
}

/**
 * Admin: Generate CSV export string of voting data (PRD Section 8: Export voting data)
 */
export async function getVotingCSVData(): Promise<string> {
  try {
    const adminSupabase = createAdminClient();
    const [statsRes, predictionsRes] = await Promise.all([
      adminSupabase.from("voting_statistics").select("*").order("ranking", { ascending: true }),
      adminSupabase.from("predictions").select("id, film_id, created_at").order("created_at", { ascending: true }),
    ]);

    const stats = (statsRes.data || []) as unknown as Array<{
      ranking: number;
      film_title: string;
      vote_count: number;
      percentage: number;
    }>;

    const predictions = (predictionsRes.data || []) as unknown as Array<{
      id: string;
      film_id: string;
      created_at: string;
    }>;

    // Build CSV
    let csv = "=== FILM FESTIVAL AWARDS 2026 - VOTING REPORT ===\n";
    csv += `Export Generated At: ${new Date().toISOString()}\n\n`;

    csv += "--- AGGREGATE RANKINGS ---\n";
    csv += "Rank,Film Title,Total Votes,Percentage\n";
    stats.forEach((row) => {
      csv += `${row.ranking},"${row.film_title.replace(/"/g, '""')}",${row.vote_count},${row.percentage}%\n`;
    });

    csv += "\n--- ANONYMOUS PREDICTION LOGS ---\n";
    csv += "Vote ID,Film ID,Timestamp\n";
    predictions.forEach((p) => {
      csv += `"${p.id}","${p.film_id}","${p.created_at}"\n`;
    });

    return csv;
  } catch {
    return (
      "Rank,Film Title,Total Votes,Percentage\n" +
      '1,"Langkah Harapan",0,0%\n' +
      '2,"Gema di Balik Layar",0,0%\n'
    );
  }
}
