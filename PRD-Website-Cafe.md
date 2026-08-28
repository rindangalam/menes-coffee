# PRD — Website & Admin Panel Menes Coffee & Eatery

**Nama bisnis:** Menes Coffee & Eatery - Padang
**Alamat:** Jl. Kartini No. 24, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat
**Google Maps:** https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z (lat -0.9405632, lng 100.3599237)
**Instagram:** [@menescoffee](https://www.instagram.com/menescoffee/)
**Jam operasional (data Google Maps):** Setiap hari 08.00–04.00 — *beberapa sumber sosial media menyebut 09.00–03.00, perlu dikonfirmasi ke pemilik sebelum go-live*
**Traction saat ini:** rating Google 4.6/5 dari ±550 review, aktif di Instagram & TikTok — website ini melengkapi kehadiran online yang sudah ada, bukan membangun dari nol

**Versi:** 1.1 — disesuaikan dengan data riil bisnis
**Tech stack:** Vue.js 3 (Composition API) + Supabase (Postgres, Auth, Storage, RLS)
**Status:** Draft — siap untuk fase development

---

## 1. Ringkasan Produk

Website publik untuk **Menes Coffee & Eatery - Padang** — coffee shop & eatery aesthetic dengan area indoor/outdoor luas, buka hingga dini hari, populer di kalangan mahasiswa, anak muda, dan keluarga di Kota Padang. Website menampilkan menu (kopi/signature latte, makanan berat, pizza, pasta, dessert), lokasi/jam buka, dan menerima reservasi meja — dikelola sepenuhnya oleh staff non-teknis lewat admin panel terintegrasi, tanpa perlu developer untuk update konten sehari-hari.

## 2. Masalah & Latar Belakang

- Menes sudah punya traction kuat di Instagram (@menescoffee) dan TikTok, tapi info menu, harga, dan promo tersebar di banyak post/reels dan sulit dicari calon pelanggan baru.
- Belum ada satu sumber informasi resmi (menu lengkap + harga, jam buka, lokasi) yang mudah diakses tanpa harus scroll Instagram/TikTok.
- Promo harian (mis. menu diskon jam makan siang yang sering muncul di konten mereka) saat ini hanya diumumkan lewat post media sosial yang cepat tenggelam.
- Reservasi meja untuk rombongan/acara (mis. buka bersama) saat ini dilakukan manual lewat DM/telepon, rawan miss saat jam ramai.

**Solusi:** satu aplikasi Vue.js dengan dua permukaan (publik + admin) di atas satu backend Supabase, sehingga staff bisa mengelola menu, promo harian, galeri, dan reservasi sendiri — jadi kanal resmi yang melengkapi Instagram & TikTok yang sudah berjalan.

## 3. Tujuan & Success Metrics

| Tujuan | Metrik | Target |
|---|---|---|
| Website cepat diakses | LCP (largest contentful paint) | < 3 detik di koneksi 4G |
| Konten mudah diupdate staff | Waktu update 1 item menu | < 5 menit tanpa bantuan developer |
| Reservasi online berjalan | Jumlah reservasi via web per minggu | Baseline terbentuk dalam 1 bulan pertama |
| Mobile-friendly | % traffic mobile yang bounce di halaman menu | < 40% |

## 4. Target Pengguna

1. **Pengunjung website** — mayoritas mahasiswa/pelajar dan anak muda pencari tempat nongkrong/kerja tugas, plus keluarga (family-friendly) dan kelompok yang butuh tempat meeting/acara (mis. bukber). Mayoritas akses dari mobile, sering datang dari link di bio Instagram/TikTok.
2. **Admin/staff cafe** — 1–3 orang, non-teknis, mengelola menu/reservasi/konten harian termasuk promo.
3. **Superadmin** — pemilik/manajer, kelola user admin lain dan pengaturan umum.

## 4.1 Ciri Khas (dari riset lapangan: Google review & konten sosial media)

- Area indoor & outdoor luas — cocok untuk nongkrong rombongan, meeting, dan acara seperti buka bersama.
- Buka hingga dini hari — pilihan late-night hangout, bukan cafe jam kerja standar.
- Ada photobox — daya tarik dokumentasi/selfie yang sering disebut di review & konten sosial media.
- Family & pet-friendly — ramah untuk keluarga dan hewan peliharaan kecil.
- Menu campuran: kopi & minuman signature (matcha latte, pistachio latte), makanan lokal (nasi sarden, nasi telur), hingga western (pizza, pasta, saikoro beef black pepper).
- Positioning harga terjangkau–menengah, dengan promo menu diskon di jam tertentu (mis. jam makan siang).

Poin-poin ini penting ditampilkan di Beranda & halaman Menu agar website mencerminkan identitas yang sudah dikenal lewat Instagram/TikTok, bukan template cafe generik.

## 5. Ruang Lingkup

### In scope (MVP — Fase 1)
- Halaman publik: Beranda, Menu, Tentang, Lokasi & Jam Buka, Kontak
- Admin panel: login, CRUD menu & kategori, kelola reservasi, kelola pesan kontak
- Reservasi meja via form (tanpa payment/DP)

### In scope (Fase 2)
- Galeri foto, testimoni pelanggan (dengan approval admin), promo/blog
- Pengaturan umum dinamis (jam buka, kontak, sosmed) dari admin panel

### Out of scope (belum, kandidat Fase 3)
- Online payment / DP reservasi
- Pre-order / pemesanan online penuh
- Multi-outlet / multi-cabang
- Multi-bahasa (ID/EN)
- Notifikasi otomatis email/WA (kecuali disepakati sebagai bagian Fase 1 — lihat Open Questions)

## 6. Functional Requirements

Prioritas: **M** = Must, **S** = Should, **C** = Could

### 6.1 Website Publik

| ID | Fitur | Deskripsi | Prioritas | Acceptance Criteria |
|---|---|---|---|---|
| FR-01 | Beranda | Hero section, highlight menu, CTA ke menu/reservasi | M | Halaman render < 3s; CTA mengarah ke route yang benar |
| FR-02 | Menu | List menu per kategori (Breakfast, Starters, Main Course, Pizza, Pasta, Dessert, Beverages/Signature Latte), foto, harga (format Rupiah), deskripsi | M | Item dengan `is_available=false` tidak tampil atau tampil dengan badge "habis"; filter kategori berfungsi; struktur kategori mengikuti menu riil Menes |
| FR-03 | Tentang Kami | Cerita cafe, foto interior, ciri khas (area outdoor, photobox, late-night, family/pet-friendly) | M | Konten statis dari CMS/tabel `posts` atau hardcode, tampil benar di mobile & desktop |
| FR-04 | Lokasi & Jam Buka | Peta embed (Jl. Kartini No. 24, Padang; lat -0.9405632, lng 100.3599237), jam operasional per hari | M | Data jam buka diambil dari tabel `settings`, bukan hardcode; nilai awal setiap hari 08.00–04.00, dikonfirmasi ulang ke pemilik sebelum go-live |
| FR-05 | Form Reservasi | Nama, telepon, tanggal, jam, jumlah tamu, catatan | M | Validasi: tanggal tidak boleh di masa lalu; semua field wajib terisi sebelum submit; sukses submit menampilkan konfirmasi visual |
| FR-06 | Form Kontak | Nama, email, pesan | S | Pesan tersimpan ke `contact_messages`, muncul di admin panel real-time atau setelah refresh |
| FR-07 | Galeri | Grid foto per kategori | S | Foto lazy-load, tidak memperlambat halaman lain |
| FR-08 | Testimoni | Tampilkan review yang sudah di-approve | S | Hanya `status='approved'` yang tampil publik |
| FR-09 | Promo/Blog | List promo aktif (mis. menu diskon jam makan siang) & artikel event | **S** *(naik prioritas dari draft awal — promo harian penting untuk bisnis ini)* | Hanya `status='published'` yang tampil; promo dengan `valid_until` yang sudah lewat otomatis hilang; sort by `published_at` desc |

### 6.2 Admin Panel

| ID | Fitur | Deskripsi | Prioritas | Acceptance Criteria |
|---|---|---|---|---|
| FR-A01 | Login Admin | Login email/password via Supabase Auth | M | Salah password menampilkan error jelas; sesi bertahan setelah refresh; redirect ke `/admin/login` bila belum login |
| FR-A02 | Dashboard | Ringkasan reservasi hari ini, pesan belum dibaca, menu terpopuler (opsional) | S | Angka yang tampil sesuai data real di database saat itu |
| FR-A03 | CRUD Menu | Tambah/edit/hapus item + kategori, upload foto | M | Upload foto tersimpan di Supabase Storage; perubahan langsung tercermin di website publik tanpa perlu redeploy |
| FR-A04 | Kelola Reservasi | Lihat list, ubah status (pending/confirmed/cancelled) | M | Perubahan status tersimpan dan tervalidasi RLS (hanya admin yang bisa update) |
| FR-A05 | Kelola Pesan Kontak | Lihat pesan, tandai sudah dibaca | S | Status `is_read` berubah saat dibuka |
| FR-A06 | Kelola Galeri | Upload/hapus foto, atur urutan | S | Urutan tampil di publik mengikuti `sort_order` |
| FR-A07 | Kelola Testimoni | Approve/reject review masuk | S | Review dengan status `pending` tidak tampil di publik sampai di-approve |
| FR-A08 | Kelola Promo/Blog | CRUD artikel | C | Draft tidak tampil di publik |
| FR-A09 | Pengaturan Umum | Edit jam buka, alamat, kontak, sosmed | S | Perubahan tersimpan ke tabel `settings` dan langsung terlihat di halaman publik terkait |
| FR-A10 | Manajemen User Admin | Superadmin tambah/hapus akun staff | C | Hanya role `superadmin` yang bisa akses menu ini |

## 7. Non-Functional Requirements

- **Performa:** LCP < 3 detik pada koneksi 4G; gambar dikompresi/di-lazy-load.
- **Responsive:** mobile-first, breakpoint minimal mobile/tablet/desktop.
- **Keamanan:** semua tabel sensitif dilindungi Row Level Security; tidak ada kredensial di sisi client; admin route dilindungi navigation guard + validasi sesi server-side (RLS), bukan hanya UI hiding.
- **SEO dasar:** meta title/description per halaman, sitemap.xml, struktur heading yang benar.
- **Aksesibilitas dasar:** kontras warna cukup, form punya label, gambar punya alt text.
- **Browser support:** 2 versi terakhir Chrome, Safari, Firefox, Edge (desktop & mobile).
- **Lokalisasi:** harga ditampilkan dalam format Rupiah (`Rp 45.000`), seluruh konten berbahasa Indonesia.

## 8. Data Model (Supabase Postgres)

| Tabel | Kolom | Catatan |
|---|---|---|
| `categories` | id uuid PK, name text, slug text unique, sort_order int, created_at timestamptz | |
| `menu_items` | id uuid PK, category_id uuid FK→categories, name text, description text, price numeric(10,2), image_url text, is_available bool default true, is_featured bool default false, sort_order int, created_at, updated_at | |
| `reservations` | id uuid PK, name text, phone text, email text, reservation_date date, reservation_time time, guest_count int, status text default 'pending', notes text, created_at | status: pending/confirmed/cancelled |
| `gallery` | id uuid PK, image_url text, caption text, category text, sort_order int, created_at | |
| `testimonials` | id uuid PK, customer_name text, rating int, message text, status text default 'pending', created_at | rating 1–5; status: pending/approved/rejected |
| `posts` | id uuid PK, title text, slug text unique, content text, image_url text, type text default 'article' ('article'/'promo'), valid_from timestamptz null, valid_until timestamptz null, published_at timestamptz, status text default 'draft', created_at | status: draft/published; `valid_until` dipakai untuk promo harian/berkala (mis. diskon jam makan siang) |
| `contact_messages` | id uuid PK, name text, email text, message text, is_read bool default false, created_at | |
| `settings` | key text PK, value jsonb, updated_at | key-value: jam_buka, alamat, kontak, sosmed |
| `admin_users` | id uuid PK, auth_uid uuid FK→auth.users unique, name text, role text default 'staff', created_at | role: superadmin/staff |

### Row Level Security (ringkasan kebijakan)

| Tabel | SELECT publik | INSERT publik | UPDATE/DELETE |
|---|---|---|---|
| `categories`, `menu_items`, `gallery` | ✅ | ❌ | admin only |
| `posts` | ✅ hanya `status='published'` | ❌ | admin only |
| `testimonials` | ✅ hanya `status='approved'` | ✅ (status dipaksa `pending`) | admin only |
| `reservations`, `contact_messages` | ❌ | ✅ | admin only |
| `settings` | ✅ | ❌ | admin only (idealnya superadmin) |
| `admin_users` | ❌ | ❌ | self / superadmin only |

## 9. User Flows Utama

1. **Pengunjung reservasi:** Beranda → Menu (opsional lihat dulu) → klik "Reservasi" → isi form → submit → konfirmasi tampil → data masuk ke admin panel.
2. **Admin update menu:** Login → Menu Manager → tambah item baru → upload foto → simpan → cek langsung di website publik (tanpa redeploy).
3. **Admin proses reservasi:** Login → Dashboard/Reservasi → lihat reservasi baru → ubah status jadi confirmed → (opsional) hubungi pelanggan manual via WA/telepon.

## 10. Arsitektur Teknis (ringkas)

- Satu project Vue 3 (Composition API + Vue Router + Pinia), route `/admin/*` dipisah dan dilindungi navigation guard yang memvalidasi sesi Supabase Auth.
- Satu Supabase project sebagai backend: Postgres (dengan RLS), Auth (email/password untuk admin), Storage (bucket `menu-images`, `gallery-images`, akses baca publik/tulis admin only).
- Tailwind CSS untuk styling.

## 11. Milestone & Fase

| Fase | Cakupan | Estimasi |
|---|---|---|
| Fase 1 — MVP | FR-01 s/d FR-06, FR-A01 s/d FR-A05, skema DB inti + RLS | 2–3 minggu |
| Fase 2 | FR-07, FR-08, FR-09, FR-A06 s/d FR-A09 | 1–2 minggu |
| Fase 3 (opsional) | Multi-bahasa, pre-order, payment/DP, notifikasi otomatis | TBD sesuai kebutuhan |

## 12. Risiko & Asumsi

- **Asumsi:** minimal satu staff bisa mengecek admin panel secara rutin untuk memproses reservasi/pesan masuk.
- **Risiko:** tanpa DP/payment, reservasi berisiko no-show tinggi — perlu diputuskan apakah ini blocker untuk MVP.
- **Risiko keamanan:** kesalahan konfigurasi RLS bisa membocorkan data reservasi/kontak pelanggan ke publik — wajib diuji eksplisit sebelum go-live (lihat dokumen agent workflow, bagian Review).

## 13. Open Questions

- Apakah dibutuhkan notifikasi otomatis (email/WA) saat ada reservasi baru masuk, atau cukup admin cek manual?
- Apakah reservasi butuh DP/payment di MVP, atau boleh ditunda ke Fase 3? (relevan terutama untuk reservasi rombongan/acara seperti bukber)
- Apakah cafe punya lebih dari satu cabang (mempengaruhi struktur data `settings` dan `reservations`)?
- Jam operasional resmi yang mana yang dipakai — 08.00–04.00 (data Google Maps) atau 09.00–03.00 (info yang beredar di sosial media)? Perlu konfirmasi dari pemilik.
- Nomor telepon/WhatsApp resmi untuk ditampilkan di website belum ditemukan dari sumber publik — perlu diminta langsung ke pemilik.
- Apakah photobox perlu jadi fitur booking terpisah (mengingat sering disebut sebagai daya tarik di review/konten sosial media), atau cukup ditampilkan sebagai bagian fasilitas di halaman Tentang/Galeri?
