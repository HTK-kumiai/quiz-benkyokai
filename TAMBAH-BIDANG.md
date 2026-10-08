# Instruksi Menambahkan Bidang Ujian

Gunakan dokumen ini sebagai instruksi kerja setiap kali menambahkan bidang ujian
baru ke aplikasi. Baca juga `AGENTS.md` dan `MEMORY.md` sebelum mulai.

## Tujuan

Tambahkan semua bidang yang tercantum di `DAFTAR-BIDANG.md`, tanpa membuat
kategori duplikat, dan dukung level `shokyu` maupun `senmonkyu` jika sumbernya
tersedia. Bidang boleh tampil meskipun baru memiliki sebagian soal atau belum
memiliki soal.

## Milestone dan Pembagian Sesi

Target milestone ini adalah memastikan seluruh 23 bidang dalam
`DAFTAR-BIDANG.md` terdaftar dan dapat tampil dengan benar di aplikasi, bukan
hanya menambahkan file kategori atau soal. Level yang belum tersedia tidak
menghalangi bidang untuk ditampilkan.

Sebanyak 7 bidang sudah memiliki kategori atau pemetaan di aplikasi, sehingga
terdapat 16 bidang yang perlu ditambahkan. Kerjakan dalam dua fase:

1. **Registrasi batch:** audit seluruh bidang, tambahkan metadata dan file JSON
   kosong untuk semua bidang yang belum ada, lalu validasi aplikasi.
2. **Pemrosesan sumber:** proses sumber soal per bidang atau kelompok sumber.
   Satu sesi tidak wajib sama dengan satu bidang; gabungkan sumber yang aman
   untuk dikerjakan bersama.

Bidang yang perlu ditambahkan:

1. 育林
2. 養豚
3. とび
4. 型枠工事
5. 鉄筋組立
6. 溶接
7. パン製造
8. 加熱生水産加工
9. 缶詰
10. 牛豚部分肉製造
11. 食鳥処理加工
12. 介護
13. 機械製材
14. 自動車整備
15. 射出成形
16. 製本

Pada fase registrasi batch:

- menambahkan metadata kategori tanpa duplikasi;
- membuat file JSON soal kosong jika sumber belum tersedia;
- memastikan semua kategori dapat dimuat aplikasi.

Pada fase pemrosesan sumber:

- membuat atau memperbarui file JSON soal yang sesuai;
- mencatat level, jumlah soal, sumber, dan status validasi.

Audit tampilan dan filter dilakukan sekali setelah registrasi batch. Setelah
seluruh sumber selesai, lakukan validasi menyeluruh untuk
memastikan seluruh 23 bidang tampil konsisten dan tidak ada kategori yang
hilang atau terduplikasi. Jangan deploy atau push sebelum diminta user.

### Checkpoint State Antar-Sesi

Setiap sesi harus meninggalkan state ringkas. State aplikasi yang sebenarnya
tetap berada di `categories.json`, file JSON soal, serta lokasi sumber di
`soal-asli/` atau `sudah-proses/`. Gunakan tabel ringkas berikut di
`MEMORY.md`; detail soal yang menunggu review tetap berada di
`butuh-konfirmasi.md`.

Format state:

```md
| Bidang | Kategori ID | Level | Soal | Status sumber | Status | Catatan |
|---|---|---|---:|---|---|---|
```

Sebelum memulai pekerjaan, baca baris bidang yang relevan di `MEMORY.md` dan
bagian terkait di `butuh-konfirmasi.md`. Jangan mengulang bidang yang sudah
selesai dan jangan melanjutkan data yang masih ambigu sebelum konfirmasi user
tersedia.

## Pemetaan bidang yang sudah diketahui

Gunakan pemetaan berikut saat membandingkan daftar bidang dengan kategori lama:

| Nama di daftar bidang | Kategori/file aplikasi saat ini |
|---|---|
| `建設（掘削・締固め）` | `建設施工` / `kensetsu` / `questions-kensetsu.json` |
| `そうざい加工` | `惣菜製造業` / `sozai-kako` / `questions-sozai-kako.json` |
| `調味加工品製造` | `くん製` / `kunsei` / `questions-kunsei.json` |
| `施設園芸` | `shisetsu-engei` |
| `施設園芸きのこ` | `shisetsu-engei-kinoko` |
| `畑作・野菜` | `hatasaku-yasai` |
| `酪農` | `rakuno` |

Jangan mengubah nama atau menggabungkan kategori tersebut hanya karena nama
Jepangnya berbeda. Jika menemukan pemetaan baru yang belum tercantum, tanyakan
kepada user sebelum menggabungkan kategori.

## Langkah kerja

### 1. Audit awal dan registrasi batch

1. Baca `MEMORY.md`.
2. Baca `DAFTAR-BIDANG.md`.
3. Baca `public/data/question-bank/categories.json`.
4. Cocokkan bidang memakai tabel pemetaan di atas.
5. Buat matriks bidang dan level: sudah ada, sebagian ada, atau belum ada.
6. Periksa file sumber di `soal-asli/` dan jangan menghapus sumber apa pun.
7. Tambahkan seluruh kategori yang belum ada dan file JSON kosongnya dalam satu
   batch.
8. Audit tampilan, filter bidang, filter level, dan kategori tanpa soal satu
   kali setelah batch selesai.

### 2. Tambahkan metadata bidang

Untuk bidang yang belum ada, tambahkan satu objek ke
`public/data/question-bank/categories.json` dengan:

```json
{
  "id": "nama-id-kebab-case",
  "title": "Nama Jepang",
  "name": "🎯 Nama Jepang (Romaji)",
  "shortName": "🎯 Nama Jepang",
  "subtitle": "Romaji (terjemahan Indonesia)",
  "description": "Deskripsi singkat materi bidang.",
  "icon": "🎯",
  "filename": "questions-nama-id-kebab-case.json"
}
```

Gunakan ID stabil dan unik. Jika file soal belum tersedia, buat file JSON
kosong `[]` agar bidang tetap dapat ditampilkan oleh aplikasi. Jangan membuat
metadata duplikat untuk kategori yang sudah ada.

### 3. Perbarui tampilan dan filter

Periksa `public/index.html`, `public/assets/js/app.js`,
`public/assets/js/category-config.js`, dan stylesheet terkait hanya pada audit
awal atau jika perubahan kode memang diperlukan.

- Pastikan semua kategori dari `categories.json` tampil.
- Pastikan kategori tanpa soal tidak menyebabkan aplikasi error.
- Pastikan pilihan level tetap mendukung `shokyu` dan `senmonkyu`.
- Level yang belum memiliki soal boleh ditampilkan sebagai tidak tersedia atau
  dinonaktifkan secara wajar.
- Filter bidang dan level tidak boleh menghilangkan bidang baru secara tidak
  sengaja.
- Jangan memasukkan daftar kategori kedua yang dapat menjadi tidak sinkron.

### 4. Proses sumber soal

Untuk setiap file di `soal-asli/`:

1. Ekstrak soal dengan metode yang sesuai format file.
2. Tentukan bidang dan level berdasarkan sumber.
3. Tulis hanya hasil yang benar-benar meragukan ke `butuh-konfirmasi.md`; hasil yang jelas dapat langsung diproses ke JSON aplikasi.
4. Gunakan tabel dengan kolom `id`, `tahun`, `soal`, `terjemahan`, `reading`,
   `answer`, dan `catatan`.
5. Tandai `source` jika kunci jawaban eksplisit di sumber.
6. Tandai `inferred` jika jawaban berasal dari inferensi.
7. Masukkan ke bagian **Hal yang Perlu Dikonfirmasi** semua hal yang tidak
   yakin, termasuk bidang, level, teks, reading, terjemahan, atau jawaban.

Aturan `reading` mengikuti `AGENTS.md`. Secara singkat, pastikan reading
berupa romaji yang konsisten dan tidak mengandung kana.

Sebelum validasi akhir, periksa bahwa `reading` tidak mengandung karakter
hiragana atau katakana (`ぁ-ゖ`, `ァ-ヺ`).

### 5. Masukkan soal ke aplikasi

Jika jawaban atau data soal jelas, soal boleh dimasukkan ke file kategori.
Jika ada keraguan substantif, jangan menebak: masukkan ke
`butuh-konfirmasi.md`. Jika tidak ada keraguan substantif, langsung masukkan ke JSON.

Setiap soal harus memiliki struktur:

```json
{
  "id": 1,
  "level": "shokyu",
  "year": 2025,
  "question": "teks Jepang asli",
  "reading": "romaji",
  "image": "",
  "answer": "○",
  "translation": "Terjemahan bahasa Indonesia.",
  "explanation": "Alasan spesifik mengapa jawaban benar atau salah."
}
```

ID harus integer berurutan mulai dari 1 dalam file kategori. Jangan menghapus
soal lama saat menambahkan soal baru.

Setelah soal sudah dimasukkan dan diproses, pindahkan sumbernya dari
`soal-asli/` ke `sudah-proses/`; jangan menghapus sumber permanen.

### 6. Validasi

Jalankan setelah registrasi batch dan pada validasi akhir:

```bash
bash scripts/validate-question-bank.sh
bash scripts/cloudflare-build.sh
```

Perbaiki semua error sebelum menyatakan pekerjaan selesai. Pastikan juga:

- JSON valid.
- Tidak ada ID duplikat dalam kategori.
- Semua `filename` mengarah ke file yang ada.
- Level hanya `shokyu` atau `senmonkyu`.
- Filter bidang dan level dapat digunakan.
- Kategori tanpa soal tidak merusak halaman utama.

### 7. Dokumentasi akhir

Perbarui `MEMORY.md` menggunakan tabel state ringkas. Perbarui
`riwayat-pengembangan.md` per milestone atau kelompok pekerjaan, bukan dengan
checkpoint panjang setiap sesi. Catat:

- bidang yang ditambahkan atau dipetakan;
- level dan jumlah soal tiap bidang;
- total soal lokal terbaru;
- status sumber (`soal-asli/`, `sudah-proses/`, atau menunggu review);
- hasil validasi.

Jangan deploy atau push kecuali user memintanya secara eksplisit. Jika masih
ada soal atau bidang yang menunggu konfirmasi, lanjutkan soal yang sudah jelas
dan berhenti hanya pada item yang memang ambigu, dalam state lokal yang sudah
tervalidasi.

## Ringkasan instruksi singkat

Audit dan registrasikan semua bidang secara batch, lalu proses sumber soal
secara bertahap. Ikuti aturan `reading` di `AGENTS.md`, catat hanya data
ambigu di `butuh-konfirmasi.md`, validasi setelah registrasi dan pada akhir
milestone, lalu dokumentasikan state secara ringkas. Jangan meminta prompt
lanjutan untuk langkah yang sudah jelas; hanya minta konfirmasi untuk hal yang
benar-benar ambigu atau kunci jawaban yang tidak dapat dipastikan.
