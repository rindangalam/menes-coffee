# SPRINT.md — Menes Coffee & Eatery

> Dokumen ini menerjemahkan `PRD.md` (requirement), `DESIGN.md` (UI/UX spec), dan `AGENT-WORKFLOW.md` (cara kerja agent) menjadi urutan kerja konkret. Setiap task dikerjakan dengan loop **Read → Think → Build → Review (grilling) → Fix → Next Step** dari `AGENT-WORKFLOW.md`.

**Asumsi:** 1 builder (manusia) + 1 AI coding agent, sprint berdurasi ±1 minggu, bisa dipercepat/diperlambat sesuai kapasitas riil. **Urutan sprint tidak boleh dilompat** — Sprint 2 (Admin) bergantung pada skema data & komponen UI dari Sprint 0, Sprint 3 bergantung pada pola CRUD yang sudah established di Sprint 2.

**Notasi:**
- `FR-xx` / `FR-Axx` → merujuk ke `PRD.md` bagian 6 (Functional Requirements)
- `DESIGN §N` → merujuk ke nomor section di `DESIGN.md`

---

## Sprint 0 — Foundation & Setup (2–3 hari)

**Goal:** siapkan fondasi teknis sebelum membangun fitur apa pun. Tidak ada UI produk jadi di sprint ini — murni pondasi.

**Tasks**
- [ ] Buat Supabase project, buat seluruh tabel sesuai `PRD.md §8` (`categories`, `menu_items`, `reservations`, `gallery`, `testimonials`, `posts`, `contact_messages`, `settings`, `admin_users`)
- [ ] Terapkan seluruh RLS policy sesuai `PRD.md §8` (Row Level Security)
- [ ] Buat Supabase Storage bucket `menu-images` dan `gallery-images` (baca publik, tulis admin only)
- [ ] Scaffold project Vue 3 + Vite + Vue Router + Pinia + Tailwind CSS — struktur folder sesuai `DESIGN §49` dan bagian Konvensi Project di `AGENT-WORKFLOW.md`
- [ ] Implementasikan design tokens sebagai CSS variables sesuai `DESIGN §75` (jangan hardcode hex color di component)
- [ ] Setup font Manrope + DM Serif Display sesuai `DESIGN §6.1`
- [ ] Bangun komponen UI dasar di `components/ui/`: `Button`, `Input`, `Select`, `Modal`, `Badge`, `Toast`, `Skeleton` — mengikuti Button System (`DESIGN §14`) dan Component States (`DESIGN §50`)
- [ ] Setup Supabase client singleton di `lib/supabase.js`, environment variable `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`

**Definition of Done**
- [ ] RLS diuji manual: request sebagai anon vs authenticated menghasilkan akses yang sesuai tabel per tabel
- [ ] Komponen UI dasar render memakai token warna/spacing/radius, bukan nilai hardcode
- [ ] `npm run dev` berjalan tanpa error, tidak ada console warning

---

## Sprint 1 — Public Website Core (Minggu 1)

**Goal:** pengunjung bisa merasakan atmosphere, melihat menu, tahu lokasi/jam buka, dan submit reservasi/kontak. Cakupan: **FR-01 s/d FR-06**.

**Tasks**
- [ ] Public Layout: `Navbar.vue` (transparent di hero → solid setelah scroll, `DESIGN §12`) + `Footer.vue` (`DESIGN §35`)
- [ ] Homepage (`FR-01`) — rakit sesuai urutan section di `DESIGN §16`:
  - Hero (`§17`–`18`)
  - Brand Statement (`§19`)
  - Featured Menu 4–6 item (`§20`)
  - Menes Experience — 4 feature block: Indoor & Outdoor, Late Night, Photobox, Family & Pet Friendly (`§25`)
  - Location section (`§30`)
  - Reservation CTA — dark section (`§82`–`83`)
- [ ] Menu page (`FR-02`) — category tabs (`§21`), `MenuCard.vue` dengan state featured/popular/habis (`§22`), hover image scale (`§23`); struktur kategori: Breakfast, Starters, Main Course, Pizza, Pasta, Dessert, Beverages, Signature Latte
- [ ] Tentang page (`FR-03`) — layout large image + statement + facility badges (`§24`)
- [ ] Lokasi section/page (`FR-04`) — map embed + CTA "Buka di Google Maps" (`§30`, `§90`), jam buka dari tabel `settings`, tampilkan identity late-night bukan sekadar angka jam (`§88`)
- [ ] Reservasi page (`FR-05`) — form sesuai `§32`, validasi sesuai `§33`, success state non-toast dengan status "Pending Confirmation" (`§91`–`92`)
- [ ] Kontak page (`FR-06`) — form + info (IG, Maps, alamat) sesuai `§34`
- [ ] Responsive pass mengikuti Public Page Responsive Matrix (`§84`) dan Mobile UX Rules (`§57`)

**Definition of Done**
- [ ] Acceptance criteria `FR-01`–`FR-06` di `PRD.md` terpenuhi satu per satu
- [ ] Checklist "Public" di `DESIGN §97` tercentang untuk semua halaman di sprint ini
- [ ] Tidak ada horizontal overflow di mobile; tidak terlihat seperti "Hero → 3 cards → 3 cards" generik (`DESIGN §80`)

---

## Sprint 2 — Admin Panel Core (Minggu 2)

**Goal:** staff bisa login dan mengelola menu, reservasi, serta pesan masuk. Cakupan: **FR-A01, FR-A02, FR-A03, FR-A04, FR-A05**.

**Tasks**
- [ ] Admin layout: sidebar + header (`§37`–`38`), navigation guard yang memvalidasi sesi Supabase Auth sebelum render `/admin/*`
- [ ] Login page (`FR-A01`)
- [ ] Dashboard (`FR-A02`) — top stats, reservation widget, quick actions (`§39`)
- [ ] Menu Manager (`FR-A03`) — `DataTable.vue` (`§40`), form 2-kolom (`§41`), `ImageUploader.vue` dropzone (`§42`)
- [ ] Reservation Manager (`FR-A04`) — list + detail + ubah status dengan text label + warna, bukan warna saja (`§43`–`44`)
- [ ] Messages (`FR-A05`) — distinction unread/read yang jelas (`§45`)
- [ ] Toast, modal konfirmasi delete, pesan sukses/error non-teknis sesuai `§54`–`55`, `§94`–`96`

**Definition of Done**
- [ ] Acceptance criteria `FR-A01`–`FR-A05` terpenuhi
- [ ] Checklist "Admin" relevan di `DESIGN §97` tercentang
- [ ] RLS diverifikasi ulang dari sisi admin: staff vs superadmin, dan publik tetap tidak bisa akses data admin

---

## Sprint 3 — Fase 2: Konten Dinamis (Minggu 3)

**Goal:** fitur promo, galeri, dan testimoni — publik maupun admin. Cakupan: **FR-07, FR-08, FR-09, FR-A06, FR-A07, FR-A08, FR-A09**.

**Public**
- [ ] Galeri page (`FR-07`) — editorial asymmetric grid (`§26`), bukan grid seragam
- [ ] Promo section di homepage + halaman promo (`FR-09`) — `§27`–`28`, promo dengan `valid_until` terlewati tidak boleh render
- [ ] Testimonials di homepage (`FR-08`) — maksimum 3–5 testimoni, tanpa auto-carousel cepat (`§29`)

**Admin**
- [ ] Gallery admin (`FR-A06`) — upload/hapus/atur `sort_order`
- [ ] Testimonials moderation (`FR-A07`) — approve/reject, `§46`
- [ ] Posts/Promo editor (`FR-A08`, mendukung `FR-09`) — field sesuai `§47` termasuk `type`, `valid_from`, `valid_until`
- [ ] Settings UI (`FR-A09`) — Business, Opening Hours, Social Media, form sederhana untuk staff non-teknis (`§48`, `§70`)

**Definition of Done**
- [ ] Acceptance criteria `FR-07`–`FR-09`, `FR-A06`–`FR-A09` terpenuhi
- [ ] Uji manual: promo dengan `valid_until` di masa lalu otomatis hilang dari publik
- [ ] Perubahan di Settings admin langsung terlihat di halaman publik terkait tanpa redeploy

---

## Sprint 4 — QA, Polish & Launch Prep (Minggu 4)

**Goal:** memastikan seluruh produk lolos checklist sebelum go-live. Cakupan: **FR-A10** + seluruh QA checklist di `DESIGN.md`.

**Tasks**
- [ ] Admin Users management (`FR-A10`) — hanya `superadmin` yang bisa akses (`§71`)
- [ ] Jalankan penuh Design QA Checklist — Public & Admin (`§97`)
- [ ] Jalankan penuh Accessibility QA Checklist (`§98`)
- [ ] Jalankan penuh Performance QA Checklist (`§99`), verifikasi LCP < 3 detik
- [ ] SEO dasar tiap halaman publik: title, meta description, canonical, Open Graph image (`§67`, `PRD.md §7`)
- [ ] Cross-browser & responsive final check sesuai `§84`–`85`
- [ ] Konfirmasi ulang Open Questions di `PRD.md §13` (jam operasional resmi, nomor telepon/WA, kebutuhan photobox booking) dan input nilai final ke tabel `settings`

**Definition of Done**
- [ ] Semua item checklist di atas tercentang
- [ ] Tidak ada requirement **Must** atau **Should** di `PRD.md` yang belum terpenuhi
- [ ] `AGENT-WORKFLOW.md` Definition of Done terpenuhi untuk seluruh fitur yang dibangun sepanjang project

---

## Ringkasan Pemetaan

| Sprint | Fokus | FR-ID | Fase PRD |
|---|---|---|---|
| 0 | Setup teknis | – | Prasyarat Fase 1 |
| 1 | Public core | FR-01 s/d FR-06 | Fase 1 (MVP) |
| 2 | Admin core | FR-A01 s/d FR-A05 | Fase 1 (MVP) |
| 3 | Konten dinamis | FR-07, FR-08, FR-09, FR-A06 s/d FR-A09 | Fase 2 |
| 4 | QA & launch | FR-A10 + QA checklist | Penutup Fase 2 |

Untuk prompt siap-pakai per task di atas, lihat `PROMPT.md`.
