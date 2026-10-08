# Riwayat Pengembangan

Tanggal pembaruan terakhir: 7 Oktober 2026

## Ringkasan Kondisi

Aplikasi sudah memiliki fitur utama untuk latihan kuis, autentikasi user dan admin, penyimpanan skor melalui Supabase, serta dashboard pengelolaan soal. Deployment yang digunakan adalah Cloudflare Pages.

## Yang Sudah Dilakukan

- Meninjau struktur dan jalur aplikasi aktif.
- Mengidentifikasi bahwa aplikasi aktif memakai folder `public/`, server lokal di `server/`, dan Supabase.
- Memeriksa tiga bank soal aktif:
  - Sozai Kako: 56 soal
  - Shisetsu Engei: 136 soal
  - Kensetsu: 695 soal
- Menambahkan kategori bank soal baru:
  - Shisetsu Engei Kinoko: 106 soal
  - Rakuno: 148 soal
  - Hatasaku Yasai: 83 soal
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
- Menambahkan kategori `shisetsu-engei-kinoko` ke manifest bank soal.
- Menambahkan file `public/data/question-bank/questions-shisetsu-engei-kinoko.json`.
- Memasukkan 106 soal Shisetsu Engei Kinoko level `shokyu` dari sumber 2018-2022.
- Menambahkan kategori `rakuno` ke manifest bank soal.
- Menambahkan file `public/data/question-bank/questions-rakuno.json`.
- Memasukkan 148 soal Rakuno level `shokyu` dari sumber 2013, 2016, 2018, 2019, 2020, 2021, 2024, dan 2025.
- Mengisi `reading`, `answer`, dan `explanation` untuk seluruh soal Rakuno setelah dikonfirmasi.
- Memindahkan sumber Rakuno dari `soal-asli/` ke `sudah-proses/`.
- Menambahkan kategori `hatasaku-yasai` ke manifest bank soal.
- Menambahkan file `public/data/question-bank/questions-hatasaku-yasai.json`.
- Memasukkan 83 soal Hatasaku Yasai level `shokyu` dari sumber 2020-2024.
- Mengisi `reading`, `answer`, dan `explanation` untuk seluruh soal Hatasaku Yasai setelah dikonfirmasi.
- Memindahkan sumber Hatasaku Yasai dari `soal-asli/` ke `sudah-proses/`.
- Menambahkan 100 soal Kensetsu level `shokyu` ke `public/data/question-bank/questions-kensetsu.json`.
- Memasukkan tambahan soal Kensetsu dari sumber 2020 dan 2025 setelah dikonfirmasi user.
- Memindahkan sumber Kensetsu tambahan dari `soal-asli/` ke `sudah-proses/`.
- Menambahkan 100 soal Kensetsu level `shokyu` ID 596-695 dari sumber 2017-2020.
- Mengisi reading, jawaban, dan terjemahan Kensetsu 2017-2020 serta mencatatnya di `butuh-konfirmasi.md` untuk koreksi sambil jalan.
- Memindahkan empat sumber Kensetsu 2017-2020 dari `soal-asli/` ke `sudah-proses/`.
- Menormalisasi seluruh 200 soal Kensetsu level `shokyu` (ID 496-695) menjadi hiragana penuh dan memperjelas spasi pada reading romaji.
- Menambahkan kategori `kunsei` ke manifest bank soal.
- Menambahkan file `public/data/question-bank/questions-kunsei.json`.
- Memasukkan 35 soal Kunsei level `senmonkyu` dari sumber 2025 setelah dikonfirmasi user.
- Memindahkan sumber Kunsei dari `soal-asli/` ke `sudah-proses/`.
- Mengisi `reading` dan `answer` untuk seluruh soal Shisetsu Engei Kinoko setelah dikonfirmasi.
- Mengekstrak gambar soal 2022 tentang bagian `かさ` ke `public/assets/images/kinoko_2022_q19.png`.
- Membuat `butuh-konfirmasi.md` sebagai catatan kerja konfirmasi reading, jawaban, dan transkripsi.
- Memvalidasi seluruh bank soal setelah penambahan kategori baru.
- Tidak ada file yang dihapus secara permanen.

## Yang Belum Dilakukan

### Verifikasi Produksi

- Alur user di URL Cloudflare Pages sudah diverifikasi: login, kuis, dan penyimpanan skor berhasil.
- Akses admin dan riwayat skor dari deployment produksi sudah diverifikasi.
- Pengujian lintas perangkat/browser sudah berhasil.

### Supabase

- Schema dan RLS dari `sql/supabase-schema.sql` sudah dijalankan.
- Akun admin sudah berhasil digunakan untuk login dan mengakses dashboard.
- URL Cloudflare Pages sudah berhasil digunakan dalam pengujian produksi.
- Pastikan tidak ada `service_role` key yang pernah dimasukkan ke frontend.

### Pengelolaan Bank Soal

- Schema `question_bank` sudah dijalankan di project Supabase.
- Sinkronisasi awal seluruh bank soal sudah berhasil dilakukan.
- Setelah migrasi, perubahan soal admin akan disimpan ke Supabase; JSON lokal tetap menjadi fallback.

### Penanganan Error

- Status penyimpanan skor sudah ditampilkan pada halaman hasil kuis.
- Retry otomatis dan tombol simpan ulang masih belum tersedia.
- Belum ada automated test untuk login, alur kuis, penyimpanan skor, dan akses admin.

### Dokumentasi dan Deployment

- Konfigurasi Cloudflare Pages menggunakan build command `bash scripts/cloudflare-build.sh` dan output directory `public`.
- Setelah deploy perubahan bank soal lokal, admin perlu menjalankan sinkronisasi ulang dari tab **Setup** agar kategori/soal baru masuk ke Supabase.

## Prioritas Berikutnya

1. Tambahkan automated test dan CI untuk validasi kode, bank soal, serta alur utama.
2. Tambahkan backup dan audit perubahan bank soal.
3. Tingkatkan dashboard admin dengan pagination, filter tanggal, dan export skor.
4. Tambahkan reset password dan penanganan sesi kedaluwarsa.
5. Tambahkan retry serta tombol simpan ulang jika penyimpanan skor gagal.
6. Uji RLS Supabase secara berkala dengan akun user biasa dan admin.

## Rencana Penyempurnaan Berikutnya

### 1. Automated Test dan CI

- Jalankan validasi JSON, syntax check JavaScript, dan pemeriksaan build secara otomatis sebelum deployment.
- Tambahkan pengujian untuk filter soal, perhitungan skor, login, penyimpanan skor, dan akses admin.

### 2. Backup dan Audit Bank Soal

- Sediakan export `question_bank` ke JSON atau CSV.
- Simpan backup sebelum sinkronisasi besar.
- Catat admin, waktu, dan jenis perubahan soal.

### 3. Peningkatan Dashboard Admin

- Tambahkan pagination untuk daftar soal dan riwayat skor.
- Tambahkan filter rentang tanggal pada riwayat skor.
- Tambahkan export riwayat skor ke CSV.
- Tampilkan preview dan ringkasan sebelum import atau sinkronisasi.

### 4. Peningkatan Autentikasi

- Tambahkan alur reset password.
- Tangani sesi Supabase yang kedaluwarsa dengan pesan yang jelas.
- Tambahkan indikator loading dan cegah submit login berulang.

### 5. Keandalan Penyimpanan Skor

- Tambahkan retry otomatis ketika koneksi sementara gagal.
- Sediakan tombol untuk mencoba menyimpan skor kembali.
- Tampilkan status skor yang berhasil atau belum berhasil disimpan.

### 6. Keamanan Supabase

- Uji bahwa user biasa hanya dapat membaca soal dan skor miliknya.
- Uji bahwa hanya admin yang dapat mengubah `question_bank`.
- Pastikan `service_role key`, password, dan token tidak masuk repository.

## Panduan Operasional

### Push Perubahan ke GitHub

Jalankan perintah dari root repository:

```bash
cd /mnt/data/1-Projects/sozai-kako/souzai-kako
git status
git add .
git commit -m "Deskripsi singkat perubahan"
git push origin main
```

Setelah push, cek deployment baru di Cloudflare Pages dan lakukan hard refresh:

- Windows/Linux: `Ctrl + Shift + R`
- macOS: `Cmd + Shift + R`

Jangan commit `service_role key`, password, token Cloudflared, atau secret lainnya.

### Testing Development Lokal

Jalankan server lokal:

```bash
cd /mnt/data/1-Projects/sozai-kako/souzai-kako
node server/app-server.js
```

Buka:

```text
http://localhost:3000/
http://localhost:3000/admin.html
```

Pemeriksaan sebelum push:

```bash
node --check public/assets/js/app.js
node --check public/assets/js/admin.js
node --check public/assets/js/supabase-client.js
bash scripts/validate-question-bank.sh
bash scripts/cloudflare-build.sh
```

### Sinkronisasi Bank Soal

1. Login ke `/admin.html` sebagai admin.
2. Buka tab **Setup**.
3. Klik **Sinkronkan Semua Soal**.
4. Verifikasi jumlah data di Supabase.

```sql
select category_id, count(*) as jumlah_soal
from public.question_bank
group by category_id
order by category_id;
```

Jumlah saat ini di file JSON lokal:

- `kensetsu`: 595
- `rakuno`: 148
- `hatasaku-yasai`: 83
- `shisetsu-engei`: 136
- `shisetsu-engei-kinoko`: 106
- `sozai-kako`: 56
- `kunsei`: 35
- Total: 1159 soal

Setelah deploy penambahan Shisetsu Engei Kinoko, Rakuno, Hatasaku Yasai, tambahan Kensetsu, dan Kunsei:

1. Push perubahan ke branch `main`.
2. Tunggu deployment Cloudflare Pages selesai.
3. Login ke `/admin.html` sebagai admin di URL produksi.
4. Buka tab **Setup**.
5. Klik **Sinkronkan Semua Soal**.
6. Cek jumlah data di Supabase:

```sql
select category_id, count(*) as jumlah_soal
from public.question_bank
group by category_id
order by category_id;
```

Hasil yang diharapkan:

- `kensetsu`: 595
- `rakuno`: 148
- `hatasaku-yasai`: 83
- `shisetsu-engei`: 136
- `shisetsu-engei-kinoko`: 106
- `sozai-kako`: 56
- `kunsei`: 35
- Total: 1159 soal

### Menjalankan dan Restart Docker

Jalankan aplikasi dan rebuild image:

```bash
docker compose up -d --build
docker compose ps
```

Restart aplikasi tanpa rebuild:

```bash
docker compose restart souzai-kako-app
```

Update kode dari GitHub lalu rebuild:

```bash
git pull
docker compose up -d --build
```

Jalankan Cloudflared bersama aplikasi:

```bash
docker compose --profile public up -d --build
docker compose logs -f cloudflared
```

Lihat log dan hentikan service:

```bash
docker compose logs -f souzai-kako-app
docker compose ps
docker compose down
```

Jika port bentrok, ubah mapping port di `compose.yaml`, misalnya dari `9090:3000` menjadi `9091:3000`, lalu jalankan ulang container.

### Cloudflare Pages

Pengaturan deployment:

- Root directory: root repository
- Build command: `bash scripts/cloudflare-build.sh`
- Output directory: `public`

Setiap push ke branch `main` memicu deployment baru. Jika build gagal, periksa hasil validasi bank soal di detail deployment Cloudflare.

### Perubahan Schema Supabase

Jalankan `sql/supabase-schema.sql` hanya ketika ada perubahan struktur database atau policy. Setelah menjalankannya:

1. Pastikan tabel dan RLS tidak error.
2. Uji login user dan admin.
3. Uji penyimpanan skor.
4. Uji pembacaan dan sinkronisasi `question_bank`.

### Troubleshooting dan Pemulihan

Jika soal tidak muncul:

- Pastikan deployment Cloudflare terbaru berstatus **Success**.
- Pastikan tabel `question_bank` berisi data.
- Pastikan user sudah login.
- Jalankan validator bank soal.
- Lakukan hard refresh.
- Periksa browser console.

Jika sinkronisasi gagal:

- Pastikan schema terbaru sudah dijalankan.
- Pastikan akun memiliki `is_admin = true`.
- Pastikan URL Supabase dan anon key benar.
- Periksa policy RLS `question_bank`.
- Gunakan JSON lokal sebagai fallback sementara.

Jika Docker bermasalah:

```bash
docker compose ps
docker compose logs --tail=100 souzai-kako-app
docker compose logs --tail=100 cloudflared
```

Untuk membatalkan commit yang sudah dipush, gunakan `git revert` agar riwayat tetap aman:

```bash
git log --oneline -5
git revert <commit-id>
git push origin main
```

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
