# Riwayat Pengembangan

Tanggal pembaruan terakhir: 11 September 2026

## Ringkasan Kondisi

Aplikasi sudah memiliki fitur utama untuk latihan kuis, autentikasi user dan admin, penyimpanan skor melalui Supabase, serta dashboard pengelolaan soal. Deployment yang digunakan adalah Cloudflare Pages.

## Yang Sudah Dilakukan

- Meninjau struktur dan jalur aplikasi aktif.
- Mengidentifikasi bahwa aplikasi aktif memakai folder `public/`, server lokal di `server/`, dan Supabase.
- Memeriksa tiga bank soal aktif:
  - Sozai Kako: 56 soal
  - Shisetsu Engei: 136 soal
  - Kensetsu: 495 soal
- Menjalankan pemeriksaan syntax JavaScript tanpa error.
- Menjalankan validator bank soal; ketiga bank soal aktif lulus validasi.
- Memastikan fitur utama yang tersedia:
  - Login user dengan Supabase.
  - Login admin dengan pemeriksaan `is_admin`.
  - Pemilihan bidang, level, tahun, dan jumlah soal.
  - Kuis interaktif dengan pembahasan jawaban.
  - Penyimpanan skor dan riwayat skor admin.
  - Tambah, edit, hapus, impor, dan ekspor soal.
  - Deployment statis melalui Cloudflare Pages.
- Memindahkan file versi lama ke `archive/legacy/`.
- Memindahkan data lama dan file yang tidak dipakai ke `archive/unused-data/`.
- Memindahkan file metadata macOS seperti `.DS_Store` dan `._*` ke `archive/metadata/`.
- Memperbarui dokumentasi deployment dari GitHub Pages ke Cloudflare Pages.
- Menambahkan `scripts/cloudflare-build.sh` untuk memvalidasi bank soal sebelum deployment.
- Mengarsipkan workflow GitHub Pages yang sudah tidak digunakan.
- Menambahkan status penyimpanan skor pada halaman hasil kuis.
- Memperjelas status kesiapan konfigurasi Supabase di dashboard admin.
- Menambahkan tabel `question_bank` dan RLS admin/user ke schema Supabase.
- Menambahkan pembacaan bank soal dari Supabase dengan fallback ke JSON lokal.
- Menambahkan sinkronisasi awal semua bank soal dan penyimpanan otomatis perubahan admin ke Supabase.
- Memverifikasi deployment Cloudflare Pages: user dapat login, menyelesaikan kuis, dan skor berhasil masuk ke Supabase.
- Memverifikasi login admin dan tampilan riwayat skor dari Cloudflare Pages.
- Memverifikasi aplikasi dari perangkat atau browser yang berbeda.
- Tidak ada file yang dihapus secara permanen.

## Yang Belum Dilakukan

### Verifikasi Produksi

- Alur user di URL Cloudflare Pages sudah diverifikasi: login, kuis, dan penyimpanan skor berhasil.
- Akses admin dan riwayat skor dari deployment produksi sudah diverifikasi.
- Pengujian lintas perangkat/browser sudah berhasil.

### Supabase

- Pastikan schema dan RLS dari `sql/supabase-schema.sql` sudah dijalankan.
- Pastikan akun admin memiliki `is_admin = true` di tabel `profiles`.
- Pastikan URL Cloudflare Pages sudah masuk ke Site URL dan Redirect URLs Supabase.
- Pastikan tidak ada `service_role` key yang pernah dimasukkan ke frontend.

### Pengelolaan Bank Soal

- Schema `question_bank` perlu dijalankan di project Supabase.
- Sinkronisasi awal perlu dijalankan sekali dari dashboard admin.
- Setelah migrasi, perubahan soal admin akan disimpan ke Supabase; JSON lokal tetap menjadi fallback.

### Penanganan Error

- Jika penyimpanan skor ke Supabase gagal, hasil kuis tetap ditampilkan tanpa pesan yang jelas kepada user.
- Belum ada automated test untuk login, alur kuis, penyimpanan skor, dan akses admin.

### Dokumentasi dan Deployment

- Konfigurasi Cloudflare Pages perlu dipastikan menggunakan build command `bash scripts/cloudflare-build.sh` dan output directory `public`.

## Prioritas Berikutnya

1. Jalankan migrasi awal bank soal melalui dashboard admin.
2. Periksa isi tabel `question_bank` setelah sinkronisasi.
3. Pastikan user membaca soal dari Supabase setelah migrasi.
4. Tambahkan notifikasi jika penyimpanan skor gagal.
5. Pastikan konfigurasi Cloudflare Pages memakai build command dan output directory yang benar.
6. Tambahkan automated test dasar untuk login, kuis, penyimpanan skor, dan akses admin.

## Langkah Aktivasi Bank Soal Terpusat

Ikuti langkah berikut agar tabel `question_bank` mulai digunakan sebagai sumber utama soal.

### 1. Jalankan Schema Supabase

1. Buka project Supabase.
2. Masuk ke **SQL Editor**.
3. Buka file `sql/supabase-schema.sql` dari repository ini.
4. Salin seluruh isinya ke SQL Editor.
5. Jalankan query.
6. Buka **Table Editor** dan pastikan tabel `question_bank` sudah dibuat.

Tabel ini menyimpan semua bidang dalam satu tabel. Pemisah bidang menggunakan kolom `category_id`:

- `sozai-kako`
- `shisetsu-engei`
- `kensetsu`

### 2. Pastikan Akun Admin Siap

1. Buka halaman admin di Cloudflare Pages.
2. Login memakai akun Supabase.
3. Pastikan akun tersebut memiliki `is_admin = true` di tabel `profiles`.
4. Jika login berhasil, dashboard admin akan terbuka.

### 3. Sinkronkan Bank Soal Awal

1. Di dashboard admin, buka tab **Setup**.
2. Pastikan status Supabase menunjukkan konfigurasi dan library siap.
3. Klik tombol **Sinkronkan Semua Soal**.
4. Tunggu sampai muncul notifikasi bahwa seluruh bidang berhasil disimpan.
5. Buka tabel `question_bank` di Supabase.
6. Pastikan data dari ketiga bidang sudah muncul.

### 4. Uji sebagai User Biasa

1. Logout dari dashboard admin.
2. Buka halaman kuis.
3. Login memakai akun user biasa.
4. Pilih salah satu bidang.
5. Mulai kuis dan pastikan soal tampil.
6. Selesaikan kuis.
7. Pastikan hasil kuis muncul dan status skor menunjukkan berhasil disimpan.
8. Periksa tabel `scores` di Supabase.

### 5. Uji Perubahan Soal Admin

1. Login kembali sebagai admin.
2. Buka tab **Kelola Soal**.
3. Edit satu soal secara kecil dan simpan.
4. Pastikan muncul notifikasi bahwa perubahan tersimpan di Supabase.
5. Buka halaman kuis memakai browser atau perangkat lain.
6. Pastikan perubahan soal terlihat di sana.

### 6. Jika Sinkronisasi Gagal

- Pastikan schema terbaru sudah dijalankan.
- Pastikan akun admin memiliki `is_admin = true`.
- Pastikan Supabase URL dan anon key benar di `public/config/supabase.config.js`.
- Periksa pesan error di dashboard admin.
- Pastikan RLS dan policy untuk `question_bank` sudah dibuat.
- Selama Supabase belum berhasil digunakan, aplikasi masih memakai JSON lokal sebagai fallback.

## Catatan

File-file lama dipindahkan ke folder `archive/`, bukan dihapus. Jika versi lama masih diperlukan untuk perbandingan atau pemulihan, file tersebut masih tersedia di sana.
