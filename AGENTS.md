# Project Instructions

## Question Bank Review Format

- Untuk kolom `reading` romaji, tulis angka sebagai cara bacanya, bukan digit. Contoh: tulis `rokujuu`, bukan `60`.
- Di kolom `reading`, selalu beri spasi setelah koma. Contoh: tulis `hiyashi, tamete oku`, bukan `hiyashi,tamete oku`.
- Jika kalimat Jepang asli memiliki teks dalam kurung, sertakan juga bagian dalam kurung itu di kolom `reading`. Contoh: `そしりょう （かんそう、サイレージ など）` menjadi `soshiryou (kansou, saireeji nado)`.

## Workflow Pemrosesan Soal

1. Baca `MEMORY.md` terlebih dahulu untuk mengetahui state terakhir, kategori yang sudah ada, total soal, file sumber yang belum diproses, dan instruksi user terbaru seperti apakah deploy perlu ditunda.
2. Ambil file sumber dari `soal-asli/`. Ekstrak isi soal dari format yang tersedia (`docx`, `doc`, `pdf`, gambar, atau spreadsheet) dengan cara paling aman untuk format tersebut. Untuk `docx`, isi biasanya bisa dibaca dari XML internal; untuk PDF, gunakan tool/library ekstraksi yang tersedia; untuk format lama, cek hasil ekstraksi manual dan tandai keraguan.
3. Sebelum memasukkan ke aplikasi, tulis semua hasil ekstraksi ke `butuh-konfirmasi.md` sebagai draf review. File ini harus memuat ringkasan sumber, daftar hal yang perlu dikonfirmasi, dan tabel berisi `id`, `tahun`, `soal`, `terjemahan`, `reading`, `answer`, dan `catatan`.
4. Isi `catatan` dengan status seperti `source` jika kunci jawaban eksplisit ada di sumber, atau `inferred` jika kunci jawaban hasil inferensi. Bagian yang ragu harus ditulis jelas di bagian "Hal yang Perlu Dikonfirmasi".
5. Jangan masukkan soal ke aplikasi sebelum user menyatakan hasil konfirmasi sudah dicek/di-approve. Selama masih tahap review, edit hanya `butuh-konfirmasi.md` kecuali user meminta hal lain.
6. Setelah user menyatakan sudah dicek, buat atau perbarui file `public/data/question-bank/questions-<category-id>.json`. Struktur tiap soal:
   - `id`: nomor urut integer mulai dari 1 dalam kategori tersebut
   - `level`: biasanya `shokyu` kecuali sumber menyatakan level lain
   - `year`: tahun soal
   - `question`: teks Jepang asli
   - `reading`: romaji hasil konfirmasi
   - `image`: string kosong jika tidak ada gambar
   - `answer`: `○` atau `×`
   - `translation`: isi terjemahan bahasa Indonesia
   - `explanation`: alasan mengapa jawaban tersebut benar atau salah
7. Jika kategori belum ada, tambahkan metadata ke `public/data/question-bank/categories.json` dengan `id`, `title`, `name`, `shortName`, `subtitle`, `description`, `icon`, dan `filename`.
8. Setelah soal masuk aplikasi, pindahkan sumber yang sudah diproses dari `soal-asli/` ke `sudah-proses/`. Jangan hapus sumber permanen.
9. Jalankan validasi lokal:
   - `bash scripts/validate-question-bank.sh`
   - `bash scripts/cloudflare-build.sh`
10. Perbarui `MEMORY.md` dan `riwayat-pengembangan.md` dengan kategori baru, jumlah soal, total lokal terbaru, status sumber, dan hasil validasi.
11. Jangan deploy atau push kecuali user meminta. Jika user mengatakan masih ada bidang tambahan, hentikan di state lokal tervalidasi.
