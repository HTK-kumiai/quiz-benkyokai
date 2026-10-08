# Memory Proyek - Souzai Kako

Tanggal catatan: 7 Oktober 2026

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
  - `kensetsu`: 695 soal
  - `rakuno`: 148 soal
  - `hatasaku-yasai`: 83 soal
  - `kunsei`: 35 soal
  - total lokal: 1259 soal
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
- File soal Kensetsu sudah diperbarui:
  - `public/data/question-bank/questions-kensetsu.json`
  - jumlah terbaru: 595 soal
  - tambahan terbaru: 100 soal level `shokyu`
  - id tambahan: 496-595
  - tahun sumber tambahan: 2020 dan 2025
  - semua `reading`, `answer`, dan `explanation` dimasukkan dari hasil konfirmasi user di `butuh-konfirmasi.md`.
- File sumber Kensetsu tambahan sudah dipindahkan dari `soal-asli/` ke `sudah-proses/`:
  - `kensetsu_2020_shokyu.pdf`
  - `kensetsu_2025_shokyu.pdf`
  - `kensetsu_2025-2_shokyu.pdf`
  - `kensetsu_2025-3_shokyu.pdf`
- Kategori `kunsei` sudah ditambahkan ke `public/data/question-bank/categories.json`.
- File soal Kunsei sudah dibuat:
  - `public/data/question-bank/questions-kunsei.json`
  - level: `senmonkyu`
  - tahun sumber: 2025
  - jumlah: 35 soal
  - semua `reading`, `answer`, dan `explanation` dimasukkan dari hasil konfirmasi user di `butuh-konfirmasi.md`.
- File sumber Kunsei sudah dipindahkan dari `soal-asli/` ke `sudah-proses/`:
  - `kunsei_2025_senmonkyu.docx`
- Penjelasan soal Kunsei sudah dianalisis ulang:
  - 35 dari 35 soal diperbarui dengan alasan faktual/prosedural yang spesifik.
  - 0 soal memerlukan konfirmasi tambahan.
  - Validasi question bank dan Cloudflare build lulus.
- Status milestone penjelasan: `kunsei` selesai; `sozai-kako` menjadi bidang berikutnya.
- Penjelasan soal `sozai-kako` sudah dianalisis ulang:
  - 56 dari 56 soal diperbarui dengan alasan faktual/prosedural yang spesifik.
  - 0 soal memerlukan konfirmasi tambahan.
  - Validasi question bank dan Cloudflare build lulus.
- Status milestone penjelasan: `kunsei` dan `sozai-kako` selesai; `hatasaku-yasai` menjadi bidang berikutnya.
- Penjelasan soal `hatasaku-yasai` sudah dianalisis ulang:
  - 83 dari 83 soal diperbarui dengan alasan faktual/prosedural yang spesifik.
  - 0 soal memerlukan konfirmasi tambahan.
  - Validasi question bank dan Cloudflare build lulus.
- Status milestone penjelasan: `kunsei`, `sozai-kako`, dan `hatasaku-yasai` selesai; `shisetsu-engei-kinoko` menjadi bidang berikutnya.
- Penjelasan soal `shisetsu-engei-kinoko` sudah dianalisis ulang:
  - 106 dari 106 soal diperbarui dengan alasan faktual/prosedural yang spesifik.
  - 0 soal memerlukan konfirmasi tambahan.
  - Validasi question bank dan Cloudflare build lulus.
- Status milestone penjelasan: `kunsei`, `sozai-kako`, `hatasaku-yasai`, dan `shisetsu-engei-kinoko` selesai; `shisetsu-engei` menjadi bidang berikutnya.
- Penjelasan soal `shisetsu-engei` sudah dianalisis ulang:
  - 136 dari 136 soal diperbarui dengan alasan faktual/prosedural spesifik.
  - 1 soal (ID 4) perlu konfirmasi karena kunci `×` bertentangan dengan isi pernyataan yang secara prosedural benar.
  - Validasi question bank dan Cloudflare build lulus.
- Status milestone penjelasan: `kunsei`, `sozai-kako`, `hatasaku-yasai`, `shisetsu-engei-kinoko`, dan `shisetsu-engei` selesai; `rakuno` menjadi bidang berikutnya.
- Penjelasan soal `rakuno` sudah dianalisis ulang:
  - 148 dari 148 soal diperbarui dengan alasan faktual/prosedural yang spesifik.
  - 0 soal memerlukan konfirmasi tambahan.
  - Validasi question bank dan Cloudflare build lulus.
- Status milestone penjelasan: `kunsei`, `sozai-kako`, `hatasaku-yasai`, `shisetsu-engei-kinoko`, `shisetsu-engei`, dan `rakuno` selesai; `kensetsu` sedang dikerjakan.
- Shisetsu Engei ID 4 dikonfirmasi user: jawaban sumber `×` salah dan telah dikoreksi menjadi `○`; penjelasan menyatakan ventilasi membuang panas saat suhu meningkat.
- Kensetsu: seluruh 695 field `explanation` diperbarui pada tahap awal; 66 soal pertama ditinjau manual, sisanya masih perlu audit manual agar alasan tidak generik. Validasi question bank dan Cloudflare build lulus.
- Tambahan Kensetsu 2017-2020 sudah dimasukkan:
  - 100 soal level `shokyu`, ID 596-695
  - tahun sumber: 2017, 2018, 2019, dan 2020
  - sumber sudah dipindahkan ke `sudah-proses/`
- Seluruh soal Kensetsu level `shokyu` (ID 496-695) sudah dinormalisasi menjadi teks soal hiragana penuh dan reading romaji ber-spasi.
- `soal-asli/` saat ini kosong setelah pemrosesan Kensetsu 2017-2020.
- File konfirmasi:
  - `butuh-konfirmasi.md`
  - berisi tabel final Kunsei dan tabel review tambahan Kensetsu 2017-2020 dengan kolom soal, terjemahan, reading, answer, dan catatan.
- Workflow dan aturan format reading sudah ditambahkan ke `AGENTS.md`.
- Skema bank soal sudah memisahkan `translation` (terjemahan Indonesia) dari `explanation` (alasan jawaban benar/salah) pada seluruh 1.259 soal lokal.
- UI kuis, dashboard admin, validator, skrip penambahan soal, dan schema Supabase sudah diperbarui untuk field `translation`.

## Validasi Terakhir

Perintah yang sudah lulus:

```bash
bash scripts/validate-question-bank.sh
bash scripts/cloudflare-build.sh
```

Hasil:

- semua question bank valid
- `public/` siap dipublish
- total lokal setelah tambahan Kensetsu 2017-2020: 1259 soal

## Deploy Nanti

User meminta belum deploy dulu karena masih ada tambahan bidang lagi.

Saat nanti deploy, jalur produksi utama tetap Cloudflare Pages.

Setelah deploy perubahan bank soal lokal, admin perlu:

1. Login admin di URL produksi.
2. Buka `/admin.html`.
3. Masuk tab **Setup**.
4. Klik **Sinkronkan Semua Soal** agar Supabase mendapat kategori dan soal baru.

Jumlah yang diharapkan setelah sinkronisasi saat ini:

  - `kensetsu`: 695
- `rakuno`: 148
- `hatasaku-yasai`: 83
- `shisetsu-engei`: 136
- `shisetsu-engei-kinoko`: 106
- `sozai-kako`: 56
- `kunsei`: 35
  - total: 1259 soal

## Catatan Workflow

- Untuk bidang baru berikutnya, baca `AGENTS.md` dan `MEMORY.md` terlebih dahulu.
- Proses sumber dari `soal-asli/` ke `butuh-konfirmasi.md` dulu.
- Setelah user menyatakan sudah dicek, baru masukkan ke aplikasi dan pindahkan sumber ke `sudah-proses/`.
