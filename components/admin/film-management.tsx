"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { Film, CrewMember } from "@/types";
import { saveFilm, deleteFilm, type FilmInput } from "@/lib/admin/films";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Film as FilmIcon,
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

interface FilmManagementProps {
  initialFilms: Film[];
}

export function FilmManagement({ initialFilms }: FilmManagementProps) {
  const [films, setFilms] = useState<Film[]>(initialFilms);
  const [editingFilm, setEditingFilm] = useState<FilmInput | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingFilm({
      title: "",
      genre: "Drama",
      duration: "12 mins",
      short_description: "",
      poster_url: "",
      trailer_url: "",
      display_order: films.length + 1,
      crew: [
        { name: "", role: "Director" },
        { name: "", role: "Cinematographer" },
      ],
    });
  };

  const handleOpenEdit = (film: Film) => {
    setIsNew(false);
    setEditingFilm({
      id: film.id,
      title: film.title,
      genre: film.genre || "",
      duration: film.duration || "",
      short_description: film.short_description,
      poster_url: film.poster_url || "",
      trailer_url: film.trailer_url || "",
      display_order: film.display_order,
      crew: film.crew.length > 0 ? film.crew : [{ name: "", role: "Director" }],
    });
  };

  const handleCloseModal = () => {
    setEditingFilm(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFilm) return;

    setMessage(null);
    startTransition(async () => {
      const res = await saveFilm(editingFilm);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        if (isNew) {
          const newFilmItem: Film = {
            id: res.filmId || String(Date.now()),
            title: editingFilm.title,
            genre: editingFilm.genre,
            duration: editingFilm.duration,
            short_description: editingFilm.short_description,
            poster_url: editingFilm.poster_url,
            trailer_url: editingFilm.trailer_url,
            display_order: Number(editingFilm.display_order) || 0,
            crew: editingFilm.crew,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setFilms((prev) => [...prev, newFilmItem].sort((a, b) => a.display_order - b.display_order));
        } else {
          setFilms((prev) =>
            prev
              .map((f) =>
                f.id === editingFilm.id
                  ? {
                      ...f,
                      title: editingFilm.title,
                      genre: editingFilm.genre,
                      duration: editingFilm.duration,
                      short_description: editingFilm.short_description,
                      poster_url: editingFilm.poster_url,
                      trailer_url: editingFilm.trailer_url,
                      display_order: Number(editingFilm.display_order) || 0,
                      crew: editingFilm.crew,
                      updated_at: new Date().toISOString(),
                    }
                  : f
              )
              .sort((a, b) => a.display_order - b.display_order)
          );
        }
        handleCloseModal();
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  const handleDelete = (filmId: string, title: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus film "${title}"?`)) {
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const res = await deleteFilm(filmId);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setFilms((prev) => prev.filter((f) => f.id !== filmId));
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  const handleCrewChange = (index: number, field: keyof CrewMember, value: string) => {
    if (!editingFilm) return;
    const newCrew = [...editingFilm.crew];
    newCrew[index] = { ...newCrew[index], [field]: value };
    setEditingFilm({ ...editingFilm, crew: newCrew });
  };

  const handleAddCrewMember = () => {
    if (!editingFilm) return;
    setEditingFilm({
      ...editingFilm,
      crew: [...editingFilm.crew, { name: "", role: "Crew Member" }],
    });
  };

  const handleRemoveCrewMember = (index: number) => {
    if (!editingFilm) return;
    setEditingFilm({
      ...editingFilm,
      crew: editingFilm.crew.filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Film Management</span>
            <Badge variant="gold">{films.length} Films</Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage participating films, synopsis, posters, trailers, crew, and display order.
          </p>
        </div>

        <Button
          type="button"
          variant="gold"
          size="sm"
          onClick={handleOpenAdd}
          className="gap-1.5 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Film</span>
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

      {/* Film Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {films.map((film) => (
          <div
            key={film.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition-all flex gap-4"
          >
            {/* Thumbnail Poster */}
            <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-800">
              {film.poster_url ? (
                <Image
                  src={film.poster_url}
                  alt={film.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <FilmIcon className="w-6 h-6" />
                </div>
              )}
              <div className="absolute top-1 left-1 bg-black/80 text-amber-300 px-1 py-0.5 rounded text-[10px] font-bold">
                #{film.display_order}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-white truncate">
                    {film.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(film)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Film"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(film.id, film.title)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Film"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  {film.genre && <span className="text-amber-300">{film.genre}</span>}
                  {film.duration && (
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{film.duration}</span>
                    </span>
                  )}
                  {film.trailer_url && (
                    <span className="text-blue-400 text-[10px]">▶ Trailer</span>
                  )}
                </div>

                <p className="text-xs text-slate-300/80 mt-2 line-clamp-2 leading-relaxed">
                  {film.short_description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-[10px] text-slate-400 border-t border-slate-900 mt-2">
                <Users className="w-3 h-3 text-amber-400" />
                <span>{film.crew.length} Crew members registered</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Film Modal Dialog */}
      {editingFilm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c1324] border border-amber-500/40 p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FilmIcon className="w-5 h-5 text-amber-400" />
                <span>{isNew ? "Add New Participating Film" : `Edit Film: ${editingFilm.title}`}</span>
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Film Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFilm.title}
                    onChange={(e) => setEditingFilm({ ...editingFilm, title: e.target.value })}
                    placeholder="e.g. Langkah Harapan"
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Display Order (1–10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={editingFilm.display_order}
                    onChange={(e) =>
                      setEditingFilm({ ...editingFilm, display_order: Number(e.target.value) })
                    }
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={editingFilm.genre || ""}
                    onChange={(e) => setEditingFilm({ ...editingFilm, genre: e.target.value })}
                    placeholder="e.g. Mystery / Drama"
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingFilm.duration || ""}
                    onChange={(e) => setEditingFilm({ ...editingFilm, duration: e.target.value })}
                    placeholder="e.g. 14 mins"
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  value={editingFilm.poster_url || ""}
                  onChange={(e) => setEditingFilm({ ...editingFilm, poster_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Trailer URL (optional)
                </label>
                <input
                  type="url"
                  value={editingFilm.trailer_url || ""}
                  onChange={(e) => setEditingFilm({ ...editingFilm, trailer_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Short Description / Synopsis <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingFilm.short_description}
                  onChange={(e) =>
                    setEditingFilm({ ...editingFilm, short_description: e.target.value })
                  }
                  placeholder="Sinopsis singkat film..."
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Crew Members Management (PRD Section 8: Manage crew information, upload crew photos) */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Crew Members ({editingFilm.crew.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCrewMember}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {editingFilm.crew.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Nama kru"
                        value={member.name}
                        onChange={(e) => handleCrewChange(idx, "name", e.target.value)}
                        className="flex-1 h-8 px-2.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Peran (e.g. Director)"
                        value={member.role}
                        onChange={(e) => handleCrewChange(idx, "role", e.target.value)}
                        className="w-36 h-8 px-2.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <input
                        type="url"
                        placeholder="Foto URL"
                        value={member.photo_url || ""}
                        onChange={(e) => handleCrewChange(idx, "photo_url", e.target.value)}
                        className="w-36 h-8 px-2.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCrewMember(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={isPending}
                  className="font-bold"
                >
                  {isPending ? "Saving..." : "Save Film"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
