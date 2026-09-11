# Souzai Kako

Mode utama proyek ini sekarang adalah frontend statis di GitHub Pages dengan autentikasi dan penyimpanan skor memakai Supabase.

## Struktur Folder

- `public/` — file frontend yang disajikan ke browser
- `public/assets/` — CSS, JavaScript, dan gambar
- `public/data/question-bank/` — bank soal JSON yang diakses frontend
- `data/` — data lokal untuk mode server/dev lama
- `server/` — server Node.js lokal untuk testing tanpa GitHub Pages
- `scripts/` — utilitas konversi dan builder soal
- `docs/` — dokumentasi dan template
- `source/` — file sumber mentah seperti Excel
- `archive/` — file cadangan lama yang tidak dipakai aplikasi aktif
- `config/` — file konfigurasi terpisah
- `public/config/` — konfigurasi frontend yang ikut dideploy

## Jalur Pakai

### Produksi

- host `public/` di GitHub Pages
- pakai Supabase untuk login dan skor

Panduan:

- Setup Supabase: `docs/setup-supabase.md`
- Tambah bidang dan soal: `docs/manage-categories-and-questions.md`

### Testing Lokal

Jalankan server lokal:

```bash
node server/app-server.js
```

Lalu buka:

- `http://localhost:3000/`
- `http://localhost:3000/admin.html`

## Panduan Tambahan

- Penambahan bidang dan soal: `docs/manage-categories-and-questions.md`
- Deploy Docker + cloudflared: `docs/deploy-ubuntu-docker.md`
- Setup Supabase: `docs/setup-supabase.md`
