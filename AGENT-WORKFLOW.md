# Agent Operating Guide — Website & Admin Panel Cafe

> Simpan file ini sebagai `CLAUDE.md` di root project bila memakai Claude Code, atau jadikan system prompt/instruksi standar untuk coding agent lain yang mengerjakan project ini.

**Rujukan requirement:** `PRD-Website-Cafe.md` — semua fitur punya ID (FR-xx / FR-Axx) yang dipakai sebagai acuan task.

---

## Prinsip Dasar

Agent WAJIB mengerjakan setiap task lewat loop berikut, secara berurutan, tanpa melompati fase mana pun — termasuk untuk task yang terlihat kecil atau "obvious".

```
READ → THINK → BUILD → REVIEW (grilling) → FIX → NEXT STEP
                  ↑___________________________|
                  (ulangi sampai review bersih)
```

---

## 1. READ

Sebelum menulis satu baris kode pun:

- Baca requirement terkait di `PRD-Website-Cafe.md` (cari FR-ID yang relevan) — jangan mengerjakan dari asumsi/ingatan.
- Baca kode yang sudah ada di project (struktur folder, komponen, composable, store) — jangan asumsikan struktur, selalu cek file secara langsung.
- Cek apakah ada pattern serupa yang sudah dibangun sebelumnya (misalnya CRUD lain) untuk dijadikan acuan konsistensi.
- Cek skema tabel & RLS policy Supabase yang terkait task ini.

**Output fase ini:** daftar file yang akan disentuh, acceptance criteria yang jelas, dan constraint yang harus dipatuhi.

## 2. THINK

- Pecah task menjadi langkah-langkah kecil dan berurutan.
- Identifikasi edge case secara eksplisit — contoh: tanggal reservasi di masa lalu, upload gambar gagal/format salah, kategori menu dihapus padahal masih dipakai item, user submit form dua kali.
- Tentukan implikasi keamanan: siapa yang boleh SELECT/INSERT/UPDATE/DELETE data ini, apakah RLS policy yang ada sudah cukup atau perlu ditambah.
- Kalau requirement di PRD masih ambigu, JANGAN menebak lalu lanjut build — catat asumsi secara eksplisit di kode/commit message, atau hentikan dan tanyakan.

**Output fase ini:** rencana implementasi singkat (boleh berupa checklist/komentar) sebelum mulai coding.

## 3. BUILD

- Implementasikan sesuai rencana dari fase Think, ikuti konvensi project (lihat bagian Konvensi di bawah).
- Commit dalam potongan kecil yang logis per unit kerja, bukan satu commit raksasa di akhir.
- Tulis kode yang mudah dibaca ulang orang lain — hindari trik yang "pintar" tapi sulit ditelusuri.
- Untuk fitur yang menyentuh data sensitif (reservasi, kontak, admin), tulis/uji RLS policy bersamaan dengan kode, bukan belakangan.

## 4. REVIEW (grilling)

Ini bukan pengecekan sekilas "kelihatannya sudah jalan" — agent harus menginterogasi hasil kerjanya sendiri seketat mungkin sebelum menganggap task selesai. Untuk setiap task, jawab pertanyaan berikut secara eksplisit, satu per satu:

- Apakah fitur ini memenuhi **semua** acceptance criteria di FR-ID terkait? Cek poin per poin, jangan digeneralisir.
- Kalau saya user publik (belum login), apa saja yang bisa saya akses/ubah lewat API ini? Coba pikirkan skenario penyalahgunaan — apakah RLS benar-benar menahannya, atau hanya UI yang menyembunyikan tombolnya?
- Apa yang terjadi kalau request gagal (network error, validasi form salah, upload gambar gagal)? Apakah user mendapat pesan yang jelas, atau layar diam/blank?
- Apakah tampilan tetap benar di lebar layar mobile (~375px) dan desktop?
- Apakah ada console error/warning yang muncul dan belum dijelaskan/ditangani?
- Kalau ada linter/type checker di project, apakah hasilnya bersih?

Kalau ada satu saja jawaban yang meragukan, task belum selesai — lanjut ke fase Fix.

## 5. FIX

- Perbaiki semua temuan dari fase Review sebelum melangkah ke task berikutnya.
- Setelah fix, ulangi fase Review pada bagian yang diperbaiki (bukan asumsi otomatis benar).
- Jangan menunda perbaikan ke "nanti" atau menandai task selesai dengan catatan "known issue" kecuali sudah didiskusikan secara eksplisit.

## 6. NEXT STEP

- Update status task (checklist/task tracker, atau tandai FR-ID terkait sebagai selesai).
- Catat singkat apa yang dikerjakan dan keputusan/asumsi penting yang diambil (jejak untuk task berikutnya atau reviewer manusia).
- Ambil task berikutnya sesuai prioritas di PRD (Must → Should → Could), lalu ulangi loop dari **READ**.

---

## Definition of Done (checklist wajib tiap fitur)

- [ ] Memenuhi acceptance criteria FR-ID terkait di PRD
- [ ] RLS policy diverifikasi untuk skenario publik maupun admin
- [ ] Responsive di mobile & desktop
- [ ] Error state ditangani dengan pesan yang jelas ke user
- [ ] Tidak ada console error/warning yang belum dijelaskan
- [ ] Kode konsisten dengan pattern/konvensi yang sudah ada di project

---

## Konvensi Project

**Struktur folder (usulan):**
```
src/
  assets/
  components/
    common/
    menu/
    admin/
  composables/
    useAuth.js
    useMenu.js
    useReservations.js
  layouts/
    PublicLayout.vue
    AdminLayout.vue
  views/
    public/
      Home.vue
      Menu.vue
      About.vue
      Contact.vue
    admin/
      Login.vue
      Dashboard.vue
      MenuManager.vue
      ReservationManager.vue
  router/
    index.js
  stores/
    auth.js
    menu.js
    reservations.js
  lib/
    supabase.js
  App.vue
  main.js
```

- Komponen Vue: `PascalCase.vue`
- Composable: `useXxx.js`, camelCase
- Store Pinia: satu file per domain (auth, menu, reservations, dst)
- Environment variable: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — jangan pernah hardcode key di kode
- Semua akses Supabase lewat satu client singleton di `lib/supabase.js`, jangan inisialisasi client baru di tiap komponen
- Route admin (`/admin/*`) wajib punya navigation guard yang cek sesi Supabase Auth sebelum render — tapi ingat, ini hanya lapisan UX; keamanan sesungguhnya tetap dari RLS di database

---

## Urutan Pengerjaan Task

Agent mengambil task dari **PRD-Website-Cafe.md bagian 6 (Functional Requirements)** secara berurutan sesuai prioritas: semua **Must** di Fase 1 selesai dan lolos Definition of Done dulu, baru lanjut **Should**, baru **Could** — jangan lompat ke fitur Fase 2 sebelum Fase 1 tuntas, kecuali disepakati ulang.
