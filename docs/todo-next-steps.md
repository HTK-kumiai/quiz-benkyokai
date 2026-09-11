# Todo Next Steps

Tanggal acuan: 4 September 2026.

Dokumen ini berisi hal-hal yang masih perlu kamu lakukan sendiri agar proyek siap dipakai penuh di GitHub Pages + Supabase.

## 1. Setup Supabase

- Buat project Supabase jika belum ada.
- Buka **SQL Editor** di Supabase.
- Jalankan file [sql/supabase-schema.sql](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/sql/supabase-schema.sql:1).
- Pastikan tabel `profiles` dan `scores` berhasil dibuat.
- Pastikan RLS policy ikut terpasang tanpa error.

## 2. Isi Konfigurasi Frontend

- Edit file [public/config/supabase.config.js](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/public/config/supabase.config.js:1).
- Isi `SUPABASE_URL`.
- Isi `SUPABASE_ANON_KEY`.
- Jangan isi `service_role` key di frontend.

## 3. Setup Auth Supabase

- Buka **Authentication** → **Providers**.
- Pastikan login Email aktif.
- Jika ingin login langsung tanpa verifikasi email, matikan **Confirm email**.
- Buka **Authentication** → **URL Configuration**.
- Isi `Site URL` dengan URL GitHub Pages final.
- Tambahkan URL GitHub Pages yang sama ke `Redirect URLs`.

## 4. Buat Akun User dan Admin

- Buat minimal 1 akun user di **Authentication** → **Users**.
- Login sekali dengan akun admin lewat halaman app atau admin agar row profile otomatis dibuat.
- Buka tabel `profiles`.
- Set `is_admin = true` untuk akun admin.
- Pastikan kolom `email`, `username`, dan `name` terisi benar.

## 5. Verifikasi Lokal

- Jalankan `node server/app-server.js`.
- Buka `http://localhost:3000/`.
- Login sebagai user biasa.
- Kerjakan kuis sampai selesai.
- Pastikan skor masuk ke tabel `scores`.
- Buka `http://localhost:3000/admin.html`.
- Login sebagai admin.
- Pastikan tab **Riwayat Skor** bisa membaca semua skor.

## 6. Deploy GitHub Pages

- Push repo ini ke GitHub.
- Buka **Settings** → **Pages** di repo GitHub.
- Pada **Build and deployment**, pilih **GitHub Actions**.
- Pastikan workflow [/.github/workflows/deploy-pages.yml](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/.github/workflows/deploy-pages.yml:1) berjalan sukses.
- Buka URL GitHub Pages hasil deploy.

## 7. Verifikasi Produksi

- Tes login user di GitHub Pages.
- Tes login admin di GitHub Pages.
- Pastikan kategori muncul semua.
- Pastikan file soal bisa dimuat.
- Pastikan submit skor berhasil masuk ke Supabase.
- Pastikan admin bisa melihat skor di halaman admin.

## 8. Kalau Mau Menambah Bidang Baru

- Jalankan `./scripts/add-category.sh ...`.
- Tambah soal pakai `./scripts/add-question.sh ...` atau edit file JSON langsung.
- Jalankan `./scripts/validate-question-bank.sh`.
- Commit lalu deploy ulang.

## 9. File Referensi Penting

- [docs/setup-supabase.md](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/docs/setup-supabase.md:1)
- [docs/manage-categories-and-questions.md](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/docs/manage-categories-and-questions.md:1)
- [public/config/supabase.config.js](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/public/config/supabase.config.js:1)
- [sql/supabase-schema.sql](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/sql/supabase-schema.sql:1)
