-- ==============================================================================
-- FILM FESTIVAL AWARDS 2026 - SEED DATA
-- Single Source of Truth: PRD.md (Section 1, 4, 5, 6, 7)
-- ==============================================================================

-- 1. Initialize Event Settings (id = 1)
INSERT INTO event_settings (
  id,
  title,
  school,
  event_date,
  venue,
  description,
  tagline,
  is_published,
  published_at,
  voting_deadline,
  is_voting_manually_closed
)
VALUES (
  1,
  'Film Festival Awards 2026',
  'SMP Global Prestasi Bekasi',
  '8–9 December 2026',
  'GPS Theater',
  'Film Festival Awards 2026 is an interactive event website designed to showcase ten student-produced films and create an engaging digital experience for students, teachers, and event visitors.',
  'Grand Cinematic Awards',
  true,
  '2026-11-01 00:00:00+07',
  '2026-12-04 23:59:59+07',
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  school = EXCLUDED.school,
  event_date = EXCLUDED.event_date,
  venue = EXCLUDED.venue,
  description = EXCLUDED.description,
  tagline = EXCLUDED.tagline,
  is_published = EXCLUDED.is_published,
  published_at = EXCLUDED.published_at,
  voting_deadline = EXCLUDED.voting_deadline,
  is_voting_manually_closed = EXCLUDED.is_voting_manually_closed;

-- 2. Seed Ten Participating Student Films (PRD Section 4B)
-- Exactly 10 films showcase; order 1 to 10.
INSERT INTO films (id, title, genre, duration, short_description, poster_url, crew, display_order)
VALUES
(
  '11111111-1111-1111-1111-111111111101',
  'Langkah Harapan',
  'Drama',
  '12 mins',
  'Perjuangan seorang murid dalam menggapai mimpi di tengah keterbatasan dan ujian persahabatan sekolah.',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Aditya Pratama", "role": "Director & Writer", "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"},
    {"name": "Siti Nurhaliza", "role": "Cinematographer", "photo_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  1
),
(
  '11111111-1111-1111-1111-111111111102',
  'Gema di Balik Layar',
  'Mystery / Thriller',
  '14 mins',
  'Misteri ruang teater tua yang menyimpan rekaman audio masa lalu dan mengubah pandangan para kru festival.',
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Bima Wicaksono", "role": "Director", "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"},
    {"name": "Clara Anindya", "role": "Sound Designer", "photo_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  2
),
(
  '11111111-1111-1111-1111-111111111103',
  'Senja di Kota Tua',
  'Coming of Age',
  '11 mins',
  'Kisah perjalanan dua sahabat menyusuri sudut bersejarah untuk menemukan arti perpisahan yang bermakna.',
  'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Daniel Setiawan", "role": "Director & Editor", "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"},
    {"name": "Eka Putri", "role": "Producer", "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  3
),
(
  '11111111-1111-1111-1111-111111111104',
  'Cakrawala Rasa',
  'Documentary',
  '15 mins',
  'Potret hangat kehidupan para pahlawan kebersihan sekolah yang bekerja dengan ketulusan setiap fajar menyingsing.',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Farhan Maulana", "role": "Director", "photo_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80"},
    {"name": "Gita Lestari", "role": "Researcher", "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  4
),
(
  '11111111-1111-1111-1111-111111111105',
  'Melodi Tanpa Kata',
  'Musical Drama',
  '13 mins',
  'Seorang pianis muda tunarungu berkomunikasi lewat getaran ritme piano untuk menyatukan orkestra sekolah.',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Hana Safitri", "role": "Director & Composer", "photo_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"},
    {"name": "Irfan Hakim", "role": "Music Director", "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  5
),
(
  '11111111-1111-1111-1111-111111111106',
  'Bayang Waktu',
  'Sci-Fi / Drama',
  '16 mins',
  'Penemuan arloji antik di laboratorium fisika yang membawa seorang siswa melihat masa depan sekolah 50 tahun lagi.',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Jonathan Kevin", "role": "Director & VFX", "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"},
    {"name": "Kezia Aurelia", "role": "Art Director", "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  6
),
(
  '11111111-1111-1111-1111-111111111107',
  'Harmoni Asa',
  'Inspirational',
  '10 mins',
  'Kisah inspiratif regu paduan suara yang mengatasi perbedaan karakter demi mempersembahkan karya terbaik.',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Luthfi Ramadhan", "role": "Director", "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"},
    {"name": "Maya Anggraini", "role": "Production Manager", "photo_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  7
),
(
  '11111111-1111-1111-1111-111111111108',
  'Di Ujung Pelita',
  'Historical Drama',
  '14 mins',
  'Dramatisasi sejarah pemuda lokal Bekasi dalam mempertahankan kedaulatan tanah air dengan semangat juang tak padam.',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Naufal Hadi", "role": "Director & Screenplay", "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"},
    {"name": "Olivia Zahrani", "role": "Costume & Makeup", "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  8
),
(
  '11111111-1111-1111-1111-111111111109',
  'Jejak Langkah Sahabat',
  'Adventure / Youth',
  '12 mins',
  'Tiga sekawan pramuka tersesat saat perkemahan akhir pekan dan belajar memahami pentingnya kekompakan sejati.',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Praditya Nugraha", "role": "Director", "photo_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80"},
    {"name": "Qonita Zahra", "role": "Assistant Director", "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  9
),
(
  '11111111-1111-1111-1111-111111111110',
  'Titik Nadir',
  'Psychological Drama',
  '15 mins',
  'Eksplorasi mendalam tentang tekanan akademis dan keberanian untuk berbicara secara jujur kepada orang tua.',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  '[
    {"name": "Rizky Firmansyah", "role": "Director & Cinematographer", "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"},
    {"name": "Shabrina Dewi", "role": "Editor", "photo_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"}
  ]'::jsonb,
  10
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  genre = EXCLUDED.genre,
  duration = EXCLUDED.duration,
  short_description = EXCLUDED.short_description,
  poster_url = EXCLUDED.poster_url,
  crew = EXCLUDED.crew,
  display_order = EXCLUDED.display_order;

-- 3. Seed Initial Community Comments (PRD Section 4D & 7)
INSERT INTO comments (id, author_name, content, status)
VALUES
(
  '22222222-2222-2222-2222-222222222201',
  'Ibu Dewi (Guru Seni Budaya)',
  'Karya anak-anak SMP Global Prestasi tahun ini luar biasa membanggakan! Selamat untuk semua tim produksi film!',
  'approved'
),
(
  '22222222-2222-2222-2222-222222222202',
  'Rian (Alumni 2024)',
  'Sinematografi film Langkah Harapan keren banget. Sukses besar untuk Film Festival Awards 2026 di GPS Theater!',
  'approved'
),
(
  '22222222-2222-2222-2222-222222222203',
  'Pengunjung GPS Theater',
  'Menunggu penayangan tanggal 8-9 Desember nanti! Apakah ada tiket on the spot?',
  'pending'
)
ON CONFLICT (id) DO NOTHING;

