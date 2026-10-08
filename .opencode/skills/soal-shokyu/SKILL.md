---
name: soal-shokyu
description: Membuat dan menormalisasi soal Jepang level Shokyu untuk question bank project ini, termasuk hiragana, katakana, pemisahan partikel, dan romaji yang mudah dibaca.
---

# Skill Soal Shokyu

Gunakan skill ini saat menambahkan atau memperbarui soal level `shokyu` pada project ini.

## Aturan teks soal Jepang

- Ubah kanji menjadi kana.
- Gunakan **hiragana** untuk kosakata Jepang asli.
- Gunakan **katakana** untuk kata asing, kata serapan, nama alat, dan istilah teknis asing.
- Beri spasi setelah partikel agar struktur kalimat mudah dibaca.
- Partikel yang perlu dipisahkan antara lain:
  `は`, `が`, `を`, `に`, `へ`, `と`, `で`, `の`, `も`, `や`, `から`, `まで`, dan `より`.
- Jangan mengubah makna, urutan, tanda baca, atau isi dalam tanda kurung.

Contoh:

```text
わたしはヨゴ
```

menjadi:

```text
わたしは ヨゴ
```

Contoh kata asing:

```text
えんじん、ばけっと、ぶるどーざー
```

ditulis sebagai:

```text
エンジン、バケット、ブルドーザー
```

## Aturan reading romaji

- Gunakan romaji dengan pemisahan antarkata yang jelas.
- Partikel harus menjadi token terpisah:
  `watashi wa`, `kikai wo`, `genba de`.
- Jangan menulis kalimat sebagai satu rangkaian tanpa spasi seperti `kikaiwotsukaimasu`.
- Beri spasi setelah koma: `hiyashi, tamete oku`.
- Angka ditulis sebagai cara baca, bukan digit:
  `3点` menjadi `san ten`, `4サイクル` menjadi `yon saikuru`.
- Sertakan teks dalam tanda kurung pada reading.
- Gunakan bentuk romaji yang konsisten dan mudah dibaca, misalnya:

```text
kikai wo tsukaimasu.
watashi wa Yogo wo tsukaimasu.
```

## Prosedur pemrosesan

1. Baca `MEMORY.md` dan `AGENTS.md` sebelum memproses sumber.
2. Ambil sumber dari `soal-asli/` dan ekstrak PDF dengan tool/library yang paling aman.
3. Pertahankan sumber asli di luar file aplikasi sampai data selesai diproses.
4. Buat draf di `butuh-konfirmasi.md` dengan kolom:
   `id`, `tahun`, `soal`, `terjemahan`, `reading`, `answer`, dan `catatan`.
5. Tandai kunci jawaban sebagai `source` jika tertulis di sumber dan `inferred` jika ditentukan dari makna soal.
6. Setelah disetujui atau user secara eksplisit meminta pemrosesan langsung, masukkan soal ke:
   `public/data/question-bank/questions-<category-id>.json`.
7. Untuk soal Shokyu, terapkan normalisasi kana dan format reading di atas sebelum menyimpan JSON.
8. Pindahkan sumber yang selesai ke `sudah-proses/`; jangan menghapusnya permanen.
9. Jalankan validasi:

   ```bash
   bash scripts/validate-question-bank.sh
   bash scripts/cloudflare-build.sh
   ```

10. Perbarui `MEMORY.md` dan `riwayat-pengembangan.md` dengan jumlah soal, sumber, dan hasil validasi.
11. Jangan deploy atau push kecuali user memintanya.

## Struktur soal

```json
{
  "id": 1,
  "level": "shokyu",
  "year": 2025,
  "question": "きかいを つかいます。",
  "reading": "kikai wo tsukaimasu.",
  "image": "",
  "answer": "○",
  "explanation": "Menggunakan mesin."
}
```
