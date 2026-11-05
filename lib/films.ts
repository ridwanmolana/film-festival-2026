import { createClient } from "@/lib/supabase/server";
import type { Film } from "@/types";

export const INITIAL_FILMS: Film[] = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    title: "Langkah Harapan",
    genre: "Drama",
    duration: "12 mins",
    short_description:
      "Perjuangan seorang murid dalam menggapai mimpi di tengah keterbatasan dan ujian persahabatan sekolah.",
    poster_url:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Aditya Pratama",
        role: "Director & Writer",
        photo_url:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Siti Nurhaliza",
        role: "Cinematographer",
        photo_url:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 1,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    title: "Gema di Balik Layar",
    genre: "Mystery / Thriller",
    duration: "14 mins",
    short_description:
      "Misteri ruang teater tua yang menyimpan rekaman audio masa lalu dan mengubah pandangan para kru festival.",
    poster_url:
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Bima Wicaksono",
        role: "Director",
        photo_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Clara Anindya",
        role: "Sound Designer",
        photo_url:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 2,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111103",
    title: "Senja di Kota Tua",
    genre: "Coming of Age",
    duration: "11 mins",
    short_description:
      "Kisah perjalanan dua sahabat menyusuri sudut bersejarah untuk menemukan arti perpisahan yang bermakna.",
    poster_url:
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Daniel Setiawan",
        role: "Director & Editor",
        photo_url:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Eka Putri",
        role: "Producer",
        photo_url:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 3,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111104",
    title: "Cakrawala Rasa",
    genre: "Documentary",
    duration: "15 mins",
    short_description:
      "Potret hangat kehidupan para pahlawan kebersihan sekolah yang bekerja dengan ketulusan setiap fajar menyingsing.",
    poster_url:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Farhan Maulana",
        role: "Director",
        photo_url:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Gita Lestari",
        role: "Researcher",
        photo_url:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 4,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111105",
    title: "Melodi Tanpa Kata",
    genre: "Musical Drama",
    duration: "13 mins",
    short_description:
      "Seorang pianis muda tunarungu berkomunikasi lewat getaran ritme piano untuk menyatukan orkestra sekolah.",
    poster_url:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Hana Safitri",
        role: "Director & Composer",
        photo_url:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Irfan Hakim",
        role: "Music Director",
        photo_url:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 5,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111106",
    title: "Bayang Waktu",
    genre: "Sci-Fi / Drama",
    duration: "16 mins",
    short_description:
      "Penemuan arloji antik di laboratorium fisika yang membawa seorang siswa melihat masa depan sekolah 50 tahun lagi.",
    poster_url:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Jonathan Kevin",
        role: "Director & VFX",
        photo_url:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Kezia Aurelia",
        role: "Art Director",
        photo_url:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 6,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111107",
    title: "Harmoni Asa",
    genre: "Inspirational",
    duration: "10 mins",
    short_description:
      "Kisah inspiratif regu paduan suara yang mengatasi perbedaan karakter demi mempersembahkan karya terbaik.",
    poster_url:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Luthfi Ramadhan",
        role: "Director",
        photo_url:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Maya Anggraini",
        role: "Production Manager",
        photo_url:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 7,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111108",
    title: "Di Ujung Pelita",
    genre: "Historical Drama",
    duration: "14 mins",
    short_description:
      "Dramatisasi sejarah pemuda lokal Bekasi dalam mempertahankan kedaulatan tanah air dengan semangat juang tak padam.",
    poster_url:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Naufal Hadi",
        role: "Director & Screenplay",
        photo_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Olivia Zahrani",
        role: "Costume & Makeup",
        photo_url:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 8,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111109",
    title: "Jejak Langkah Sahabat",
    genre: "Adventure / Youth",
    duration: "12 mins",
    short_description:
      "Tiga sekawan pramuka tersesat saat perkemahan akhir pekan dan belajar memahami pentingnya kekompakan sejati.",
    poster_url:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Praditya Nugraha",
        role: "Director",
        photo_url:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Qonita Zahra",
        role: "Assistant Director",
        photo_url:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 9,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111110",
    title: "Titik Nadir",
    genre: "Psychological Drama",
    duration: "15 mins",
    short_description:
      "Eksplorasi mendalam tentang tekanan akademis dan keberanian untuk berbicara secara jujur kepada orang tua.",
    poster_url:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    crew: [
      {
        name: "Rizky Firmansyah",
        role: "Director & Cinematographer",
        photo_url:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Shabrina Dewi",
        role: "Editor",
        photo_url:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      },
    ],
    display_order: 10,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
];

export async function getFilms(): Promise<Film[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as unknown as Film[]).map((f) => ({
        ...f,
        crew: Array.isArray(f.crew) ? f.crew : [],
      }));
    }
  } catch {
    // If Supabase is unreachable or not configured, return default 10 films
  }

  return INITIAL_FILMS;
}

