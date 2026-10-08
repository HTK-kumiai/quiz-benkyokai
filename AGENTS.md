# Project Instructions

## Question Bank Review Format

- Untuk kolom `reading` romaji, tulis angka sebagai cara bacanya, bukan digit. Contoh: tulis `rokujuu`, bukan `60`.
- Di kolom `reading`, selalu beri spasi setelah koma. Contoh: tulis `hiyashi, tamete oku`, bukan `hiyashi,tamete oku`.
- Jika kalimat Jepang asli memiliki teks dalam kurung, sertakan juga bagian dalam kurung itu di kolom `reading`. Contoh: `そしりょう （かんそう、サイレージ など）` menjadi `soshiryou (kansou, saireeji nado)`.

## Workflow Pemrosesan Soal

1. Baca `MEMORY.md` terlebih dahulu untuk mengetahui state terakhir, kategori yang sudah ada, total soal, file sumber yang belum diproses, dan instruksi user terbaru seperti apakah deploy perlu ditunda.
2. Ambil file sumber dari `soal-asli/`. Ekstrak isi soal dari format yang tersedia (`docx`, `doc`, `pdf`, gambar, atau spreadsheet) dengan cara paling aman untuk format tersebut. Untuk `docx`, isi biasanya bisa dibaca dari XML internal; untuk PDF, gunakan tool/library ekstraksi yang tersedia.

1. Buat atau perbarui file `public/data/question-bank/questions-<category-id>.json`. Struktur tiap soal:
   - `id`: nomor urut integer mulai dari 1 dalam kategori tersebut
   - `level`: biasanya `shokyu` kecuali sumber menyatakan level lain
   - `year`: tahun soal
   - `question`: teks Jepang asli
   - `reading`: romaji hasil konfirmasi
   - `image`: string kosong jika tidak ada gambar
   - `answer`: `○` atau `×`
   - `translation`: isi terjemahan bahasa Indonesia
   - `explanation`: alasan mengapa jawaban tersebut benar atau salah
2. Jika kategori belum ada, tambahkan metadata ke `public/data/question-bank/categories.json` dengan `id`, `title`, `name`, `shortName`, `subtitle`, `description`, `icon`, dan `filename`.
3. Setelah soal masuk aplikasi, pindahkan sumber yang sudah diproses dari `soal-asli/` ke `sudah-proses/`. Jangan hapus sumber permanen.
4. Jalankan validasi lokal:
   - `bash scripts/validate-question-bank.sh`
   - `bash scripts/cloudflare-build.sh`
5. Perbarui `MEMORY.md` dengan kategori baru, jumlah soal, total lokal terbaru, status sumber, dan hasil validasi.
6. Jangan deploy atau push
