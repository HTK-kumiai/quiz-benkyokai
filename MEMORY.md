# Memory Proyek - Souzai Kako

Tanggal catatan: 15 September 2026

## Lokasi Repo

Repo aktif:

```text
/mnt/data/1-Projects/sozai-kako/souzai-kako
```

## State Terakhir

- Kategori aktif di file JSON lokal:
  - `sozai-kako`: 56 soal
  - `shisetsu-engei`: 136 soal
  - `shisetsu-engei-kinoko`: 106 soal
  - `kensetsu`: 495 soal
  - `rakuno`: 148 soal
  - `hatasaku-yasai`: 83 soal
  - total lokal: 1024 soal
- Kategori `rakuno` sudah ditambahkan ke `public/data/question-bank/categories.json`.
- File soal Rakuno sudah dibuat:
  - `public/data/question-bank/questions-rakuno.json`
  - level: `shokyu`
  - tahun sumber: 2013, 2016, 2018, 2019, 2020, 2021, 2024, 2025
  - semua `reading`, `answer`, dan `explanation` sudah dimasukkan dari hasil konfirmasi user.
- File sumber Rakuno sudah dipindahkan dari `soal-asli/` ke `sudah-proses/`.
- Kategori `hatasaku-yasai` sudah ditambahkan ke `public/data/question-bank/categories.json`.
- File soal Hatasaku Yasai sudah dibuat:
  - `public/data/question-bank/questions-hatasaku-yasai.json`
  - level: `shokyu`
  - tahun sumber: 2020, 2021, 2022, 2023, 2024
  - semua `reading`, `answer`, dan `explanation` sudah dimasukkan dari hasil konfirmasi user.
- File sumber Hatasaku Yasai sudah dipindahkan dari `soal-asli/` ke `sudah-proses/`.
- `soal-asli/` saat ini kosong setelah pemrosesan Hatasaku Yasai.
- File konfirmasi:
  - `butuh-konfirmasi.md`
  - saat ini berisi tabel final konfirmasi Hatasaku Yasai dengan kolom soal, terjemahan, reading, answer, dan catatan.
- Workflow dan aturan format reading sudah ditambahkan ke `AGENTS.md`.

## Validasi Terakhir

Perintah yang sudah lulus:

```bash
bash scripts/validate-question-bank.sh
bash scripts/cloudflare-build.sh
```

Hasil:

- semua question bank valid
- `public/` siap dipublish
- total lokal setelah Hatasaku Yasai: 1024 soal

## Deploy Nanti

User meminta belum deploy dulu karena masih ada tambahan bidang lagi.

Saat nanti deploy, jalur produksi utama tetap Cloudflare Pages.

Setelah deploy perubahan bank soal lokal, admin perlu:

1. Login admin di URL produksi.
2. Buka `/admin.html`.
3. Masuk tab **Setup**.
4. Klik **Sinkronkan Semua Soal** agar Supabase mendapat kategori dan soal baru.

Jumlah yang diharapkan setelah sinkronisasi saat ini:

- `kensetsu`: 495
- `rakuno`: 148
- `hatasaku-yasai`: 83
- `shisetsu-engei`: 136
- `shisetsu-engei-kinoko`: 106
- `sozai-kako`: 56
- total: 1024 soal

## Catatan Workflow

- Untuk bidang baru berikutnya, baca `AGENTS.md` dan `MEMORY.md` terlebih dahulu.
- Proses sumber dari `soal-asli/` ke `butuh-konfirmasi.md` dulu.
- Setelah user menyatakan sudah dicek, baru masukkan ke aplikasi dan pindahkan sumber ke `sudah-proses/`.
