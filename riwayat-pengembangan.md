# Riwayat Pengembangan

Tanggal pembaruan terakhir: 8 Oktober 2026

## Kondisi Saat Ini

Aplikasi kuis berjalan dengan frontend di `public/`, server lokal di `server/`, Supabase, dan deployment Cloudflare Pages. Fitur yang tersedia:

- Login user dan admin melalui Supabase (`is_admin`).
- Pemilihan bidang, level, tahun, dan jumlah soal.
- Kuis interaktif, pembahasan, penyimpanan skor, dan riwayat skor admin.
- Dashboard admin untuk tambah, edit, hapus, impor, ekspor, dan sinkronisasi soal.
- Bank soal dari Supabase dengan fallback ke JSON lokal.
- Schema `question_bank` dan RLS telah dijalankan.
- Validasi JavaScript, bank soal, dan build Cloudflare telah lulus.
- Deployment produksi telah diuji untuk login, kuis, penyimpanan skor, admin, serta beberapa perangkat/browser.
- File lama tidak dihapus; dipindahkan ke `archive/`.

## Bank Soal Lokal

| Kategori | Jumlah |
|---|---:|
| `kensetsu` | 695 |
| `rakuno` | 148 |
| `shisetsu-engei` | 136 |
| `shisetsu-engei-kinoko` | 106 |
| `hatasaku-yasai` | 83 |
| `sozai-kako` | 56 |
| `kunsei` | 35 |
| `youton` | 80 |
| `ikurin` | 43 |
| `tobi` | 20 draf |
| `katawaku-koji` | 20 draf |
| **Total soal lengkap** | **1.382** |

Catatan:

- Kensetsu berjumlah 695; analisis explanation awal sudah dilakukan, tetapi audit manual lanjutan masih diperlukan.
- Tobi dan Katawaku Koji masih berupa draf; sebagian sumber belum terekstrak penuh dan tetap dicatat di `butuh-konfirmasi.md`.
- Ikurin memiliki 43 soal masuk aplikasi dan 17 soal ambigu/gambar masih menunggu review.
- Youton 2019 nomor 19 telah diperbaiki setelah teks sumber dilengkapi.
- Kunsei, Sozai Kako, Rakuno, Hatasaku Yasai, dan Shisetsu Engei Kinoko telah dianalisis ulang tanpa item `NEED-CONFIRM`.
- Shisetsu Engei ID 4 telah diperbaiki setelah konfirmasi user.

## Pekerjaan dan Migrasi Utama

- Menambahkan kategori serta bank soal Rakuno, Hatasaku Yasai, Shisetsu Engei Kinoko, Kunsei, Youton, Ikurin, Tobi, dan Katawaku Koji.
- Menormalisasi soal Shokyu ke kana dan reading romaji ber-spasi; angka dalam reading ditulis sebagai cara baca.
- Memisahkan field `translation` dan `explanation` pada soal.
- Mengekstrak gambar Kinoko 2022 ke `public/assets/images/kinoko_2022_q19.png`.
- Menambahkan `scripts/cloudflare-build.sh` dan memperbarui dokumentasi deployment.
- Menambahkan `butuh-konfirmasi.md` sebagai catatan review reading, jawaban, transkripsi, dan soal bergambar.
- Sumber yang selesai diproses dipindahkan ke `sudah-proses/`; tidak ada sumber yang dihapus permanen.

## Status Supabase dan Deployment

- Schema dan RLS dari `sql/supabase-schema.sql` sudah dijalankan.
- Sinkronisasi awal bank soal telah berhasil.
- Setelah perubahan bank soal lokal dideploy, login sebagai admin lalu buka **Setup → Sinkronkan Semua Soal**.
- JSON lokal tetap menjadi fallback.
- Jangan pernah memasukkan `service_role key`, password, token, atau secret ke frontend/repository.

## Yang Masih Perlu Dikerjakan

1. Audit manual explanation Kensetsu dan review draf Tobi, Katawaku Koji, serta 17 soal Ikurin.
2. Tambahkan automated test dan CI untuk validasi, filter soal, skor, login, penyimpanan skor, dan akses admin.
3. Tambahkan backup serta audit perubahan `question_bank`.
4. Tambahkan pagination, filter tanggal, export skor, dan preview sebelum impor/sinkronisasi.
5. Tambahkan reset password, penanganan sesi kedaluwarsa, loading state, dan pencegahan submit berulang.
6. Tambahkan retry serta tombol simpan ulang jika penyimpanan skor gagal.
7. Uji RLS secara berkala dengan akun user biasa dan admin.

## Perintah Validasi Lokal

```bash
node --check public/assets/js/app.js
node --check public/assets/js/admin.js
node --check public/assets/js/supabase-client.js
bash scripts/validate-question-bank.sh
bash scripts/cloudflare-build.sh
```

## Operasional Singkat

Cloudflare Pages:

- Root directory: root repository
- Build command: `bash scripts/cloudflare-build.sh`
- Output directory: `public`

Server lokal:

```bash
node server/app-server.js
```

Docker:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f souzai-kako-app
```

Jika soal tidak muncul, periksa status deployment, login user, isi `question_bank`, validator, hard refresh, dan browser console. Jika sinkronisasi gagal, periksa schema, `is_admin`, konfigurasi Supabase, dan policy RLS; aplikasi dapat memakai JSON lokal sebagai fallback.

## Referensi Kerja

- `MEMORY.md`: state pekerjaan terbaru dan sumber yang belum selesai.
- `butuh-konfirmasi.md`: daftar soal yang memerlukan review.
- `soal-asli/`: sumber yang belum selesai diproses.
- `sudah-proses/`: sumber yang telah diproses.
- `archive/`: file lama dan metadata yang dipertahankan untuk pemulihan.

## Bidang yang Baru Ditambahkan

Kategori dan file JSON kosong telah dibuat untuk 13 bidang resmi yang sebelumnya belum tersedia: `tekkin-kumitate`, `yousetsu`, `pan-seizou`, `kanetsu-nama-suisan-kako`, `choumi-kakouhin-seizou`, `kanzume`, `gyuuton-bubun-niku-seizou`, `shokucho-shori-kako`, `kaigo`, `kikai-seizai`, `jidousha-seibi`, `shashutsu-seikei`, dan `seihon`. Sumber soal belum tersedia di `soal-asli/`, sehingga belum ada soal yang dimasukkan. Validasi bank soal dan build Cloudflare lulus.
