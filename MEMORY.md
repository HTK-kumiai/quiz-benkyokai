# Memory Proyek - Souzai Kako

Tanggal catatan: 7 Oktober 2026

## Lokasi Repo

Repo aktif:

```text
/mnt/data/1-Projects/sozai-kako/souzai-kako
```

## Catatan Workflow

- Untuk bidang baru berikutnya, baca `AGENTS.md` dan `MEMORY.md` terlebih dahulu.

- Masukkan soal yang sudah diproses ke `sudah-proses/`.

## Milestone: Menambahkan Semua Bidang Ujian

- Total bidang pada `DAFTAR-BIDANG.md`: 23.
- Pembagian pekerjaan: 16 sesi, satu bidang per sesi sesuai `TAMBAH-BIDANG.md`.

### Pembagian Phase

1. 育林 + 養豚 (finish)
2. とび + 型枠工事 (finish)
3. 鉄筋組立 + 溶接
4. パン製造 + 加熱生水産加工
5. 缶詰 + 牛豚部分肉製造
6. 食鳥処理加工 + 介護
7. 機械製材 + 自動車整備
8. 射出成形 + 製本
9. Audit dan pelengkapan bidang yang sudah ada
10. Normalisasi kategori, pemetaan, dan metadata
11. Pembaruan UI serta filter bidang/level
12. Validasi menyeluruh dan dokumentasi

## Status Terbaru

- とび: 20 soal shokyu dimasukkan ke `questions-tobi.json`; sumber belum dipindahkan karena masih ada berkas DOC/PDF dan draf perlu audit.
- 型枠工事: 20 soal shokyu dimasukkan ke `questions-katawaku-koji.json`; empat sumber tetap di `soal-asli/` karena tiga set tambahan belum diproses penuh dan perlu audit transkripsi.
- 13 bidang resmi yang belum memiliki kategori telah ditambahkan ke `categories.json` beserta file JSON kosong: 鉄筋組立、溶接、パン製造、加熱生水産加工、調味加工品製造、缶詰、牛豚部分肉製造、食鳥処理加工、介護、機械製材、自動車整備、射出成形、製本.
- Sumber soal untuk bidang-bidang baru belum ditemukan di `soal-asli/`; file JSON sengaja masih kosong.
- Validator question bank dan Cloudflare build lulus setelah penambahan kategori.

#### Setiap 1 phase tercapai

Tambahkan finish di samping pembagian phase. Contoh 育林 + 養豚 (finish). Kemudian, tambahkan selanjutnya di samping phase berikutnya, contoh とび + 型枠工事 (berikutnya)
