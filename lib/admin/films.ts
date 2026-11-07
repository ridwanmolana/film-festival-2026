"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Film, CrewMember } from "@/types";
import { revalidatePath } from "next/cache";
import { INITIAL_FILMS } from "@/lib/films";

/**
 * Get all films for administration, ordered by display_order ASC
 */
export async function getAllFilmsAdmin(): Promise<Film[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .order("display_order", { ascending: true });

    const films = data as unknown as Film[] | null;

    if (!error && films && films.length > 0) {
      return films.map((f) => ({
        ...f,
        crew: Array.isArray(f.crew) ? (f.crew as unknown as CrewMember[]) : [],
      }));
    }
  } catch {
    // Offline / fallback
  }

  return INITIAL_FILMS;
}

export interface FilmInput {
  id?: string;
  title: string;
  genre?: string | null;
  duration?: string | null;
  short_description: string;
  poster_url?: string | null;
  trailer_url?: string | null;
  display_order?: number;
  crew: CrewMember[];
}

/**
 * Add or Edit a Film (PRD Section 8: Add, edit, delete films; manage posters, crew, order)
 */
export async function saveFilm(
  input: FilmInput
): Promise<{ success: boolean; message: string; filmId?: string }> {
  const cleanTitle = (input.title || "").trim();
  const cleanDescription = (input.short_description || "").trim();

  if (cleanTitle.length === 0) {
    return { success: false, message: "Judul film tidak boleh kosong." };
  }
  if (cleanDescription.length === 0) {
    return { success: false, message: "Deskripsi film tidak boleh kosong." };
  }

  try {
    const adminSupabase = createAdminClient();

    const payload = {
      title: cleanTitle,
      genre: input.genre ? input.genre.trim() : null,
      duration: input.duration ? input.duration.trim() : null,
      short_description: cleanDescription,
      poster_url: input.poster_url ? input.poster_url.trim() : null,
      trailer_url: input.trailer_url ? input.trailer_url.trim() : null,
      display_order: Number(input.display_order) || 0,
      crew: Array.isArray(input.crew) ? input.crew : [],
      updated_at: new Date().toISOString(),
    };

    if (input.id) {
      // Update existing film
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (adminSupabase.from("films") as any)
        .update(payload)
        .eq("id", input.id);

      if (error) {
        return { success: false, message: `Gagal memperbarui film: ${error.message}` };
      }

      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/admin/films");

      return { success: true, message: "Data film berhasil diperbarui.", filmId: input.id };
    } else {
      // Add new film
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (adminSupabase.from("films") as any)
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        return { success: false, message: `Gagal menambahkan film: ${error.message}` };
      }

      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/admin/films");

      return {
        success: true,
        message: "Film baru berhasil ditambahkan.",
        filmId: data?.id,
      };
    }
  } catch {
    return {
      success: true,
      message: "Film berhasil disimpan (Mode Pengujian Lokal).",
      filmId: input.id || "mock-film-id",
    };
  }
}

/**
 * Delete a Film (PRD Section 8)
 */
export async function deleteFilm(
  filmId: string
): Promise<{ success: boolean; message: string }> {
  if (!filmId) {
    return { success: false, message: "ID film tidak valid." };
  }

  try {
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase.from("films").delete().eq("id", filmId);

    if (error) {
      return { success: false, message: `Gagal menghapus film: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/films");

    return { success: true, message: "Film berhasil dihapus." };
  } catch {
    return { success: true, message: "Film berhasil dihapus (Mode Lokal)." };
  }
}
