# PROMPT.md — Menes Coffee & Eatery

> Kumpulan prompt siap-pakai untuk coding agent (mis. Claude Code). Salin satu blok prompt per sesi kerja, sesuai urutan di `SPRINT.md`. Jangan gabung banyak task sekaligus dalam satu prompt — loop **Read → Think → Build → Review → Fix → Next Step** di `AGENT-WORKFLOW.md` bekerja paling baik per unit kerja kecil.

**Prasyarat:** `PRD.md`, `DESIGN.md`, dan `AGENT-WORKFLOW.md` ada di root project (idealnya `AGENT-WORKFLOW.md` disimpan sebagai `CLAUDE.md` supaya otomatis terbaca agent).

---

## Sprint 0 — Foundation & Setup

### P0.1 — Skema Database & RLS

```
Baca PRD.md bagian 8 (Data Model) secara lengkap.

Buatkan SQL migration untuk Supabase yang berisi:
- Semua tabel: categories, menu_items, reservations, gallery,
  testimonials, posts, contact_messages, settings, admin_users
  (kolom persis sesuai PRD.md §8)
- Row Level Security policy untuk tiap tabel sesuai tabel
  "Row Level Security (ringkasan kebijakan)" di PRD.md §8
- Trigger/default value yang relevan (mis. testimonials.status
  default 'pending' agar tidak bisa di-override dari public insert)

Setelah menulis migration, jelaskan cara saya menjalankannya di
Supabase (dashboard SQL editor atau CLI), lalu tuliskan query test
manual yang bisa saya jalankan untuk memverifikasi RLS bekerja
(skenario: anon SELECT menu_items harus berhasil, anon SELECT
reservations harus gagal, anon INSERT reservations harus berhasil,
anon UPDATE reservations harus gagal).

Ikuti loop kerja di AGENT-WORKFLOW.md. Fase Review harus secara
eksplisit memverifikasi setiap baris di tabel RLS PRD.md §8 sudah
tercermin di policy yang ditulis.
```

### P0.2 — Scaffold Project & Design Tokens

```
Baca DESIGN.md bagian 49 (Component Architecture), 75 (Design
Tokens), dan 6.1 (Typography). Baca juga bagian "Konvensi Project"
di AGENT-WORKFLOW.md.

Scaffold project Vue 3 (Vite) dengan:
- Vue Router, Pinia, Tailwind CSS
- Struktur folder persis sesuai DESIGN.md §49 dan konvensi di
  AGENT-WORKFLOW.md
- CSS variables untuk seluruh token warna, radius, container-max
  dari DESIGN.md §75 — letakkan di satu file tema, jangan hardcode
  hex color di component manapun
- Font Manrope (sans, untuk UI/body) dan DM Serif Display (untuk
  hero/heading editorial), dengan fallback system-ui/sans-serif
- Supabase client singleton di lib/supabase.js, baca
  VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY dari env

Ikuti loop AGENT-WORKFLOW.md. Fase Review: pastikan `npm run dev`
jalan tanpa error/warning sebelum menandai task selesai.
```

### P0.3 — Komponen UI Dasar

```
Baca DESIGN.md bagian 14 (Button System), 50 (Component States),
51 (Loading States), 54 (Toast), 55 (Modal), dan 76 (Component
Naming).

Bangun komponen di src/components/ui/:
- Button.vue — varian primary/secondary/ghost, hover translateY(-1px),
  active scale(.98), transition 180–250ms (DESIGN §14)
- Input.vue dan Select.vue — mendukung label, helper text, error
  state terhubung ke field (DESIGN §72)
- Modal.vue — dengan focus management, bisa ditutup keyboard
  (DESIGN §66, §98)
- Badge.vue — untuk status (available/sold-out, pending/confirmed/
  cancelled, dst — DESIGN §74), gunakan text label + warna, jangan
  hanya warna
- Toast.vue — success/error/warning sesuai contoh DESIGN §54
- Skeleton.vue — untuk loading state content-heavy (DESIGN §51)

Semua komponen memakai CSS variable dari token yang sudah dibuat
di P0.2, bukan nilai hardcode.

Ikuti loop AGENT-WORKFLOW.md. Fase Review, cek eksplisit: apakah
setiap komponen punya state default/hover/focus/disabled sesuai
DESIGN.md §50, dan apakah warna kontras cukup (aksesibilitas dasar)?
```

---

## Sprint 1 — Public Website Core

### P1.1 — Public Layout (Navbar + Footer)

```
Baca PRD.md FR-01, DESIGN.md §12 (Navigation) dan §35 (Footer).

Bangun components/public/Navbar.vue dan Footer.vue:
- Navbar: transparent di atas hero, jadi solid setelah scroll;
  desktop menampilkan Menu/Tentang/Galeri/Lokasi + CTA Reservasi;
  mobile pakai drawer fullscreen dengan urutan sesuai DESIGN §86
  (Menu, Promo, Tentang, Galeri, Lokasi, Kontak, lalu Reservasi
  dan Instagram)
- Footer: sesuai layout DESIGN §35 (nama brand besar, link
  navigasi, sosial media, alamat)

Touch target minimum 44×44px di mobile (DESIGN §57).

Ikuti loop AGENT-WORKFLOW.md.
```

### P1.2 — Homepage

```
Baca PRD.md FR-01 dan DESIGN.md §16 (Homepage Design), §17-18
(Hero), §19 (Brand Statement), §20 (Featured Menu), §25 (Menes
Experience), §30 (Location), §82-83 (Dark Section / Reservation
CTA), §81 (Visual Rhythm), dan §80 (Anti-Generic Café Website
Rules) — homepage TIDAK BOLEH berbentuk "hero lalu grid 3-card
berulang".

Rakit HomeView.vue dengan urutan section:
Hero → Brand Statement → Featured Menu (4-6 item) → Menes
Experience (4 feature block: Indoor & Outdoor, Late Night,
Photobox, Family & Pet Friendly) → Location → Reservation CTA
(dark section, background Ink 950).

Gunakan copy Bahasa Indonesia yang natural sesuai contoh di
DESIGN.md (mis. "Ngopi, makan, dan nongkrong sampai larut."),
bukan copy generic seperti "Experience our premium coffee."
(DESIGN §3.2).

Pastikan ada pergantian visual (light/dark/image-dominant) setiap
2-3 section sesuai DESIGN §81.

Ikuti loop AGENT-WORKFLOW.md. Fase Review, cocokkan dengan
checklist Public di DESIGN.md §97 dan §79 (Avoiding AI-Slop UI) —
tidak boleh ada gradient ungu generik, glassmorphism tanpa alasan,
atau semua section center-aligned.
```

### P1.3 — Menu Page

```
Baca PRD.md FR-02 dan DESIGN.md §21 (Menu Page), §22 (Menu Card),
§23 (Menu Image Interaction).

Bangun MenuView.vue:
- Category tabs: All, Breakfast, Starters, Main Course, Pizza,
  Pasta, Dessert, Beverages, Signature Latte — horizontal scroll
  di mobile, tab biasa di desktop
- components/public/MenuCard.vue: image, name, description, harga
  format Rupiah (Rp 45.000); state featured/popular; state
  is_available=false menampilkan badge "Habis" dengan image
  opacity 0.65, item tetap terlihat (jangan disembunyikan total)
- Hover di desktop: image scale(1.03), transition ~400ms,
  overflow hidden pada container

Data menu diambil dari tabel menu_items + categories via
Supabase client, urut berdasarkan sort_order.

Ikuti loop AGENT-WORKFLOW.md. Fase Review: cek acceptance
criteria FR-02 di PRD.md satu per satu, termasuk filter kategori
dan penanganan item habis.
```

### P1.4 — Tentang, Lokasi, Kontak

```
Baca PRD.md FR-03, FR-04, FR-06 dan DESIGN.md §24 (About Section),
§30-31 (Location & Opening Hours), §34 (Contact Page), §88 (UX
for Late-Night Identity), §90 (Google Maps).

Bangun tiga halaman:
1. AboutView.vue — large interior image + brand statement +
   facility badges (Outdoor, Photobox, Pet Friendly) sesuai §24
2. LocationView.vue (atau section) — map embed dengan koordinat
   lat -0.9405632, lng 100.3599237, alamat Jl. Kartini No. 24
   Padang, jam buka per hari DIAMBIL DARI TABEL settings (bukan
   hardcode), CTA "Buka di Google Maps →". Tampilkan identitas
   late-night secara visual (contoh copy di §88), bukan cuma
   angka jam.
3. ContactView.vue — form (nama, email, pesan) yang insert ke
   contact_messages, plus info Instagram/Maps/alamat sesuai §34

Ikuti loop AGENT-WORKFLOW.md. Fase Review: pastikan jam buka
benar-benar dari database, coba ubah data di tabel settings dan
verifikasi tampilan berubah tanpa redeploy.
```

### P1.5 — Reservation Form

```
Baca PRD.md FR-05 dan DESIGN.md §32-33 (Reservation Page & Form
UX), §91-92 (Reservation Trust & Confirmation), §93 (Form
Security UX).

Bangun ReservationView.vue dengan components/public/
ReservationForm.vue:
- Field: Nama, Nomor WhatsApp/Telepon, Email, Tanggal, Jam,
  Jumlah Tamu, Catatan
- Validasi: field wajib (nama, telepon, tanggal, jam, jumlah
  tamu) tidak boleh kosong; tanggal >= hari ini; jumlah tamu
  minimum 1
- Saat submit: tombol berubah jadi "Mengirim..." dan disabled,
  cegah duplicate submission
- Setelah sukses: JANGAN pakai toast saja — tampilkan
  confirmation state penuh sesuai §92 yang secara eksplisit bilang
  status "Pending Confirmation", BUKAN "reservasi kamu sudah
  confirmed" (status di database memang 'pending')
- Insert ke tabel reservations sesuai skema PRD.md §8

Ikuti loop AGENT-WORKFLOW.md. Fase Review: coba submit dengan
tanggal masa lalu, field kosong, dan submit ganda cepat — pastikan
semua tertangani dengan pesan non-teknis (DESIGN §96).
```

---

## Sprint 2 — Admin Panel Core

### P2.1 — Admin Layout, Auth Guard, Login

```
Baca PRD.md FR-A01 dan DESIGN.md §36-38 (Admin Panel Design
Direction, Layout, Sidebar), §71 (Admin Permission UX).

Bangun:
- AdminLayout.vue: sidebar (Dashboard, lalu grup CONTENT: Menu/
  Categories/Gallery/Testimonials/Posts, grup OPERATIONS:
  Reservations/Messages, grup SYSTEM: Settings/Admin Users) +
  header, sesuai §38. "Admin Users" hanya terlihat untuk role
  superadmin.
- Navigation guard di router: cek sesi Supabase Auth sebelum
  render route /admin/*, redirect ke /admin/login jika belum
  login
- LoginView.vue: email/password via Supabase Auth, error jelas
  saat salah password, sesi bertahan setelah refresh

PENTING: navigation guard ini HANYA lapisan UX. Keamanan
sesungguhnya tetap dari RLS di database (sudah dibuat di P0.1) —
jangan anggap task ini selesai kalau RLS belum menahan akses
publik ke tabel admin.

Ikuti loop AGENT-WORKFLOW.md.
```

### P2.2 — Dashboard

```
Baca PRD.md FR-A02 dan DESIGN.md §39 (Admin Dashboard).

Bangun DashboardView.vue yang menjawab "apa yang perlu saya
lakukan sekarang?":
- Top stats: Reservasi Hari Ini, Pesan Belum Dibaca, Reservasi
  Pending, Menu Tersedia — angka real dari query Supabase, bukan
  dummy
- Reservation Widget: daftar reservasi terbaru (jam, nama, jumlah
  orang) + link "Lihat Semua"
- Quick Actions: Tambah Menu, Tambah Promo, Lihat Reservasi,
  Lihat Pesan

Ikuti loop AGENT-WORKFLOW.md. Fase Review: pastikan setiap angka
di dashboard memang query real-time ke database, bukan hardcode.
```

### P2.3 — Menu Manager (CRUD)

```
Baca PRD.md FR-A03 dan DESIGN.md §40 (Admin Data Table), §41
(Admin Form), §42 (Image Upload UX), §94-95 (Delete Confirmation,
Success Feedback).

Bangun MenuManagerView.vue:
- components/admin/DataTable.vue: search, filter kategori, tombol
  + Add, kolom Item/Category/Price/Status; di mobile beralih ke
  card list, JANGAN paksa table desktop di layar kecil (§40)
- Form tambah/edit 2-kolom desktop (Main Information kiri,
  Publishing kanan berisi Available/Featured/Sort Order) — di
  mobile jadi 1 kolom berurutan (§41)
- components/admin/ImageUploader.vue: dropzone drag & drop,
  validasi JPG/PNG/WEBP max 5MB, preview dengan tombol
  Replace/Remove setelah upload — JANGAN pakai input file default
  browser (§42). Upload ke Supabase Storage bucket menu-images.
- Delete pakai modal konfirmasi (§94): "Menu '[nama]' akan
  dihapus. Tindakan ini tidak dapat dibatalkan."
- Feedback sukses non-teknis: "Menu berhasil ditambahkan/
  disimpan/dihapus." (§95); error juga non-teknis (§96), contoh:
  kalau slug/nama duplikat, jangan tampilkan error Postgres mentah

Ikuti loop AGENT-WORKFLOW.md. Fase Review: cek FR-A03 acceptance
criteria — perubahan di sini harus langsung tercermin di halaman
publik Menu (P1.3) tanpa redeploy.
```

### P2.4 — Reservation & Messages Manager

```
Baca PRD.md FR-A04, FR-A05 dan DESIGN.md §43-44 (Reservation
Management & Detail), §45 (Contact Messages).

Bangun:
- ReservationManagerView.vue: list reservasi + detail (nama,
  telepon, tanggal, jam, jumlah tamu, catatan, status), tombol
  Confirm/Cancel. Status pakai text label + warna (pending=amber,
  confirmed=green, cancelled=muted/red) — JANGAN hanya warna
  (§43, aksesibilitas).
- MessagesView.vue: distinction visual jelas antara pesan belum
  dibaca (dot indicator) dan sudah dibaca (§45); klik pesan
  menandainya sebagai is_read=true

Ikuti loop AGENT-WORKFLOW.md. Fase Review: verifikasi lewat RLS
bahwa hanya admin yang bisa UPDATE status reservasi/pesan, publik
hanya bisa INSERT.
```

---

## Sprint 3 — Fase 2: Konten Dinamis

### P3.1 — Galeri (Public + Admin)

```
Baca PRD.md FR-07, FR-A06 dan DESIGN.md §26 (Gallery).

Bangun:
- GalleryView.vue (public): editorial asymmetric grid di desktop
  (bukan grid seragam N-kolom identik), stack/horizontal scroll
  di mobile. Gambar lazy-load.
- Admin Gallery view: upload/hapus foto, atur sort_order (drag
  atau input angka), pakai ImageUploader.vue yang sudah dibuat
  di P2.3

Ikuti loop AGENT-WORKFLOW.md. Fase Review: pastikan urutan tampil
di publik mengikuti sort_order dari admin.
```

### P3.2 — Promo & Testimonials (Public + Admin)

```
Baca PRD.md FR-08, FR-09, FR-A07, FR-A08 dan DESIGN.md §27-28
(Promo Section & Card), §29 (Testimonials), §46 (Testimonials
Moderation), §47 (Posts/Promo Editor).

Bangun:
1. PromoCard.vue + section promo di homepage + halaman /promo —
   promo dengan valid_until yang sudah lewat TIDAK BOLEH dirender
   di publik sama sekali (bukan cuma disembunyikan via CSS)
2. TestimonialCard.vue + section testimoni di homepage — hanya
   status='approved' yang tampil, maksimum 3-5 item, tanpa
   auto-carousel yang bergerak cepat
3. Admin Testimonials Moderation: table (Customer/Rating/Message/
   Status/Created/Action), tombol Approve/Reject
4. Admin Posts/Promo Editor: field Title, Slug, Type
   (Article/Promo), Content, Featured Image, Valid From, Valid
   Until, Status, Published At — Valid From/Until WAJIB muncul
   kalau Type=Promo

Ikuti loop AGENT-WORKFLOW.md. Fase Review: uji eksplisit dengan
membuat promo yang valid_until-nya kemarin, pastikan tidak muncul
di publik.
```

### P3.3 — Settings

```
Baca PRD.md FR-A09 dan DESIGN.md §48 (Settings UI), §70 (Admin UX
Principles — Do/Don't).

Bangun SettingsView.vue dengan 3 grup form:
- Business: Business Name, Address, Phone, Email
- Opening Hours: input per hari (Senin-Minggu)
- Social Media: Instagram, TikTok, Google Maps

Form harus mudah diedit staff non-teknis: bahasa sederhana,
default value masuk akal, TIDAK menampilkan UUID atau
terminologi database (§70). Data disimpan ke tabel settings
sebagai key-value.

Ikuti loop AGENT-WORKFLOW.md. Fase Review: ubah salah satu jam
buka lewat form ini, verifikasi halaman Lokasi publik (P1.4)
berubah tanpa redeploy.
```

---

## Sprint 4 — QA, Polish & Launch Prep

### P4.1 — Admin Users Management

```
Baca PRD.md FR-A10 dan DESIGN.md §71 (Admin Permission UX).

Bangun AdminUsersView.vue, hanya bisa diakses role superadmin
(tegakkan baik di UI navigation guard MAUPUN di RLS tabel
admin_users). Superadmin bisa menambah/menghapus akun staff.

Ikuti loop AGENT-WORKFLOW.md.
```

### P4.2 — Full QA Pass

```
Baca DESIGN.md bagian 97 (Design QA Checklist), 98 (Accessibility
QA Checklist), dan 99 (Performance QA Checklist) secara lengkap.

Jalankan ketiga checklist itu terhadap seluruh halaman publik dan
admin yang sudah dibangun (Sprint 1-3). Untuk setiap item yang
GAGAL, catat halaman mana yang bermasalah, lalu perbaiki satu per
satu — jangan lanjut ke item berikutnya sebelum item sebelumnya
benar-benar fixed (fase Fix di AGENT-WORKFLOW.md).

Fokus khusus:
- LCP < 3 detik di seluruh halaman publik (§99, PRD.md §7)
- Tidak ada horizontal overflow di mobile
- Semua form: label, keyboard navigation, focus state terlihat
  (§98)
- Semua icon-only button punya aria-label

Setelah selesai, laporkan ringkasan: berapa item lolos, berapa
yang diperbaiki, dan apakah ada item yang butuh keputusan manusia
(bukan bisa diperbaiki lewat kode saja).
```

### P4.3 — SEO Dasar & Final Settings

```
Baca DESIGN.md bagian 67 (SEO Design Considerations) dan PRD.md
bagian 7 (Non-Functional Requirements) serta bagian 13 (Open
Questions).

Tambahkan ke setiap halaman publik: title, meta description,
canonical URL, Open Graph image. Pastikan tiap halaman punya
tepat 1 H1 dan struktur heading yang benar (bukan sekadar untuk
styling).

Sebelum menandai project siap launch, pastikan Open Questions di
PRD.md §13 sudah dijawab oleh pemilik cafe (jam operasional resmi,
nomor telepon/WA, dsb.) dan nilai final sudah di-input lewat
admin Settings — JANGAN biarkan data placeholder tayang di
production.

Ikuti loop AGENT-WORKFLOW.md sebagai penutup seluruh project.
```
