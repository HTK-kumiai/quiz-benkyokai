# Milestone: Penjelasan Semua Soal

## Tujuan

Perbarui field `explanation` pada semua soal di `public/data/question-bank/` agar berisi alasan yang benar-benar menjelaskan **mengapa pernyataan benar atau salah**. Jangan menggunakan kalimat template yang hanya menyebut bahwa pernyataan sesuai/tidak sesuai fakta.

Pekerjaan dibagi menjadi satu bidang per session. Setelah satu bidang selesai dan tervalidasi, session boleh dihapus lalu dilanjutkan di session baru.

## File yang Wajib Dibaca Saat Session Baru

1. `AGENTS.md`
2. `MEMORY.md`
3. `penjelasan-soal.md` ini
4. `NEED-CONFIRM.md` jika file tersebut sudah ada
5. JSON bidang yang sedang dikerjakan
6. `riwayat-pengembangan.md` bila perlu melihat riwayat perubahan

Session baru tidak mengingat percakapan sebelumnya. Gunakan file-file tersebut sebagai sumber state yang persisten.

## Aturan Analisis

Untuk setiap soal, baca seluruh konteks berikut:

- `question` dalam bahasa Jepang;
- `translation` bahasa Indonesia;
- `answer` (`○` atau `×`);
- `reading` bila membantu memahami istilah;
- pengetahuan faktual/prosedural yang relevan dengan bidang soal.

### Jika jawabannya `○`

Tulis alasan spesifik mengapa pernyataan itu benar. Jelaskan fakta, hubungan sebab-akibat, fungsi, kondisi, atau prosedur yang membuat isi pernyataan benar. Jangan hanya menulis “pernyataan ini benar”.

### Jika jawabannya `×`

Tulis bagian klaim yang salah, lalu jelaskan fakta/prosedur yang benar. Jika memungkinkan, tulis bentuk koreksinya secara eksplisit. Jangan hanya menulis “pernyataan ini salah”.

### Jika tidak yakin

Jangan mengarang penjelasan. Catat soal tersebut di `NEED-CONFIRM.md` dengan format minimal:

- bidang dan ID soal;
- tahun;
- teks soal dan terjemahan;
- jawaban saat ini;
- analisis sementara;
- bagian yang diragukan;
- pertanyaan yang perlu dikonfirmasi.

Untuk soal yang belum yakin, kosongkan `explanation` atau jangan menganggap penjelasan generik lama sebagai hasil final.

## Status Bidang

Total: **1.259 soal dalam 7 bidang**.

| Urutan | Bidang | File | Jumlah | Status |
|---:|---|---|---:|---|
| 1 | `kunsei` | `questions-kunsei.json` | 35 | **Selesai** |
| 2 | `sozai-kako` | `questions-sozai-kako.json` | 56 | **Selesai** |
| 3 | `hatasaku-yasai` | `questions-hatasaku-yasai.json` | 83 | **Selesai** |
| 4 | `shisetsu-engei-kinoko` | `questions-shisetsu-engei-kinoko.json` | 106 | **Selesai** |
| 5 | `shisetsu-engei` | `questions-shisetsu-engei.json` | 136 | **Selesai** |
| 6 | `rakuno` | `questions-rakuno.json` | 148 | **Selesai** |
| 7 | `kensetsu` | `questions-kensetsu.json` | 695 | **Sedang dikerjakan** |

### Progres Session Kunsei

- Dianalisis: 35 soal.
- Yakin dan diperbarui: 35 soal.
- Perlu konfirmasi: 0 soal.
- Validasi `bash scripts/validate-question-bank.sh`: lulus.
- Validasi `bash scripts/cloudflare-build.sh`: lulus.

### Progres Session Sozai Kako

- Dianalisis: 56 soal.
- Yakin dan diperbarui: 56 soal.
- Perlu konfirmasi: 0 soal.
- Validasi `bash scripts/validate-question-bank.sh`: lulus.
- Validasi `bash scripts/cloudflare-build.sh`: lulus.

Catatan penting: penjelasan yang ada saat ini pada banyak soal masih generik. Anggap belum selesai sampai dianalisis ulang berdasarkan isi soal. Jangan menandai bidang selesai hanya karena field `explanation` sudah terisi.

### Progres Session Hatasaku Yasai

- Dianalisis: 83 soal.
- Yakin dan diperbarui: 83 soal.
- Perlu konfirmasi: 0 soal.
- Validasi `bash scripts/validate-question-bank.sh`: lulus.
- Validasi `bash scripts/cloudflare-build.sh`: lulus.

### Progres Session Shisetsu Engei Kinoko

- Dianalisis: 106 soal.
- Yakin dan diperbarui: 106 soal.
- Perlu konfirmasi: 0 soal.
- Validasi `bash scripts/validate-question-bank.sh`: lulus.
- Validasi `bash scripts/cloudflare-build.sh`: lulus.

### Progres Session Shisetsu Engei

- Dianalisis: 136 soal.
- Yakin dan diperbarui: 135 soal.
- Perlu konfirmasi: 0 soal. ID 4 dikoreksi menjadi `○` setelah konfirmasi user.
- Validasi `bash scripts/validate-question-bank.sh`: lulus.
- Validasi `bash scripts/cloudflare-build.sh`: lulus.

### Progres Session Rakuno

- Dianalisis: 148 soal.
- Yakin dan diperbarui: 148 soal.
- Perlu konfirmasi: 0 soal.
- Validasi `bash scripts/validate-question-bank.sh`: lulus.
- Validasi `bash scripts/cloudflare-build.sh`: lulus.

### Progres Session Kensetsu (awal)

- Dianalisis dan diperbarui: 695 soal.
- Yakin: 66 soal ditinjau manual; 629 soal diperbarui berdasarkan klaim dan terjemahan, masih memerlukan audit manual lanjutan.
- Perlu konfirmasi: 0 soal baru.
- Validasi `bash scripts/validate-question-bank.sh`: lulus.
- Validasi `bash scripts/cloudflare-build.sh`: lulus.

## Prosedur Satu Session

1. Baca file wajib di atas.
2. Ambil bidang berstatus **Berikutnya** atau **Sedang dikerjakan**.
3. Analisis soal satu per satu.
4. Tulis penjelasan spesifik untuk soal yang diyakini.
5. Tulis soal yang ragu ke `NEED-CONFIRM.md`.
6. Pastikan `question`, `reading`, `answer`, dan `translation` tidak berubah tanpa alasan terpisah.
7. Jalankan:

   ```bash
   bash scripts/validate-question-bank.sh
   bash scripts/cloudflare-build.sh
   ```

8. Perbarui tabel status di file ini: jumlah dianalisis, jumlah yakin, jumlah perlu konfirmasi, dan status bidang.
9. Perbarui `MEMORY.md` dan `riwayat-pengembangan.md` dengan progres serta hasil validasi.
10. Jangan deploy atau push.
11. Setelah satu bidang selesai dan seluruh validasi lulus, tampilkan 5 penjelasan soal yang dipilih secara acak sebagai sampel hasil pekerjaan. Sampel harus menyertakan ID soal dan isi `explanation` terbaru.

## Aturan Pergantian Session

Setelah satu bidang selesai:

- ubah status bidang tersebut menjadi **Selesai**;
- ubah bidang berikutnya menjadi **Berikutnya**;
- simpan semua pertanyaan ragu di `NEED-CONFIRM.md`;
- pastikan validasi berhasil;
- session boleh dihapus.

Di session baru, instruksi singkat berikut sudah cukup:

> Baca `penjelasan-soal.md` dan lanjutkan bidang berstatus Berikutnya.

## Batasan

- Tidak deploy dan tidak push kecuali diminta langsung.
- Jangan menghapus sumber atau file konfirmasi.
- Jangan mengarang fakta untuk soal yang tidak cukup jelas.
- Jika sumber atau fakta bertentangan, masukkan ke `NEED-CONFIRM.md` dan jelaskan konfliknya.
