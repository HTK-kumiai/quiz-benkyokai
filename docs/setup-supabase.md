# Setup Supabase untuk Cloudflare Pages

Panduan ini sesuai dengan struktur proyek saat ini per 3 September 2026.

Tujuan setup ini:

- `public/` di-host di Cloudflare Pages
- login user memakai Supabase Auth
- skor tersimpan di Supabase
- admin login memakai akun Supabase biasa yang ditandai `is_admin = true`
- tidak ada `service_role` key di frontend

## 1. Buat Project Supabase

1. Buka https://supabase.com
2. Buat project baru
3. Pilih region terdekat
4. Tunggu sampai project aktif

## 2. Jalankan SQL Schema

1. Buka **SQL Editor**
2. Jalankan isi file [sql/supabase-schema.sql](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/sql/supabase-schema.sql:1)

Schema itu membuat:

- tabel `profiles`
- tabel `scores`
- index
- RLS untuk user biasa dan admin

Perilaku aksesnya:

- user biasa hanya bisa melihat profil sendiri
- user biasa hanya bisa insert skor miliknya sendiri
- admin bisa melihat semua skor jika `profiles.is_admin = true`

## 3. Aktifkan Auth Email

Di dashboard Supabase:

1. Buka **Authentication** → **Providers**
2. Pastikan **Email** aktif
3. Jika kamu ingin login langsung tanpa verifikasi email, matikan **Confirm email**

## 4. Ambil Public Keys

Di **Settings** → **API**, salin:

- `Project URL`
- `anon public key`

Jangan pakai `service_role key` untuk frontend ini.

## 5. Isi Konfigurasi Frontend

Edit file [public/config/supabase.config.js](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/public/config/supabase.config.js:1):

```js
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-key";
```

## 6. Buat User Pertama

Karena aplikasi menggunakan deployment statis Cloudflare Pages, pembuatan user tidak dilakukan dari browser admin.

Caranya:

1. Buka **Authentication** → **Users**
2. Tambah user baru
3. Isi email dan password

Saat user pertama kali login, aplikasi akan otomatis membuat baris profilnya di tabel `profiles`.

## 7. Jadikan Akun Sebagai Admin

Setelah akun admin pernah login minimal sekali, buka **Table Editor** → `profiles`, lalu set:

```text
is_admin = true
```

Kolom lain yang penting:

- `email`
- `username`
- `name`

## 8. Test Lokal

1. Jalankan:

```bash
node server/app-server.js
```

2. Buka:

- `http://localhost:3000/`
- `http://localhost:3000/admin.html`

3. Login user biasa dari halaman kuis
4. Selesaikan kuis untuk memastikan skor masuk
5. Login admin dari halaman admin untuk memastikan tab skor bisa dibuka

## 9. Deploy ke Cloudflare Pages

Atur project Cloudflare Pages dengan konfigurasi berikut:

- Root directory: root repository
- Build command: `bash scripts/cloudflare-build.sh`
- Output directory: `public`

Build command akan memvalidasi seluruh bank soal sebelum folder `public/` dipublikasikan.

Setelah deployment, tambahkan URL Cloudflare Pages ke **Supabase → Authentication → URL Configuration** sebagai **Site URL** dan **Redirect URL**.

## 10. Troubleshooting

### Login user gagal

- cek `SUPABASE_URL`
- cek `SUPABASE_ANON_KEY`
- cek user memang ada di Supabase Auth

### Admin tidak bisa lihat skor

- pastikan akun itu punya baris di `profiles`
- pastikan `is_admin = true`
- pastikan SQL schema dan RLS sudah dijalankan

### Kategori atau soal tidak muncul di Cloudflare Pages

- cek file `public/data/question-bank/categories.json`
- jalankan `./scripts/validate-question-bank.sh`
- pastikan commit terbaru sudah ter-deploy

## File Penting

- [public/config/supabase.config.js](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/public/config/supabase.config.js:1)
- [sql/supabase-schema.sql](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/sql/supabase-schema.sql:1)
- [public/assets/js/app.js](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/public/assets/js/app.js:1)
- [public/assets/js/admin.js](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/public/assets/js/admin.js:1)
- [public/data/question-bank/categories.json](/Users/dwikiprayoga24/1 Projects/sozai-kako/souzai-kako/public/data/question-bank/categories.json:1)
