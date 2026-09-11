# Menambah Bidang dan Soal

Panduan ini berlaku untuk struktur proyek per 3 September 2026.

## Ringkasnya

Untuk menambah bidang baru, sekarang cukup ada 2 hal:

1. Tambah metadata bidang di `public/data/question-bank/categories.json`
2. Buat file soal `public/data/question-bank/questions-<id>.json`

Supaya lebih cepat, pakai script:

```bash
./scripts/add-category.sh <category-id> "<judul-jepang>" "<subtitle>" "<deskripsi>" "<icon>"
```

Contoh:

```bash
./scripts/add-category.sh nougyou "農業" "Nougyou (Pertanian)" "Latihan dasar bidang pertanian." "🚜"
```

Script itu akan:

- menambah entry baru ke `categories.json`
- membuat file `public/data/question-bank/questions-nougyou.json`

## Menambah Satu Soal dari Terminal

Kalau mau menambah satu soal tanpa edit JSON manual, pakai:

```bash
./scripts/add-question.sh <category-id> "<question>" "<reading>" "<answer>" <year> [level] [explanation] [image]
```

Contoh:

```bash
./scripts/add-question.sh nougyou "のうぎょう では あんぜん かくにん が たいせつ です。" "Nougyou dewa anzen kakunin ga taisetsu desu." "○" 2026 shokyu "Benar. Keselamatan kerja tetap penting." ""
```

Script ini akan otomatis:

- mencari file `questions-<category-id>.json`
- menentukan `id` berikutnya
- menambahkan soal baru ke akhir array

## Validasi Semua File Soal

Sebelum deploy, cek semua file JSON dengan:

```bash
./scripts/validate-question-bank.sh
```

Atau validasi satu file saja:

```bash
./scripts/validate-question-bank.sh public/data/question-bank/questions-sozai-kako.json
```

Validator akan mengecek:

- root harus array
- `id` harus unik
- `level` harus `shokyu` atau `senmonkyu`
- `answer` harus `○` atau `×`
- field penting tidak boleh hilang

## Format Metadata Bidang

Contoh isi `categories.json`:

```json
{
  "id": "nougyou",
  "title": "農業",
  "name": "🚜 農業 (Nougyou)",
  "shortName": "🚜 農業",
  "subtitle": "Nougyou (Pertanian)",
  "description": "Latihan dasar bidang pertanian.",
  "icon": "🚜",
  "filename": "questions-nougyou.json"
}
```

Keterangan field:

- `id`: id unik, pakai huruf kecil dan tanda hubung
- `title`: judul utama yang tampil di kartu bidang
- `name`: nama lengkap untuk label admin dan hasil
- `shortName`: versi singkat untuk badge/hasil kuis
- `subtitle`: nama Indonesia/romaji
- `description`: deskripsi singkat bidang
- `icon`: emoji atau simbol
- `filename`: nama file soal JSON

## Format Soal

Setiap file soal harus berupa array JSON.

Contoh:

```json
[
  {
    "id": 1,
    "level": "shokyu",
    "year": 2026,
    "question": "のうぎょう では、あんぜん かくにん が たいせつ です。",
    "reading": "Nougyou dewa, anzen kakunin ga taisetsu desu.",
    "image": "",
    "answer": "○",
    "explanation": "Benar. Keselamatan kerja tetap penting dalam bidang pertanian."
  }
]
```

Field yang dipakai:

- `id`: nomor soal unik di bidang itu
- `level`: `shokyu` atau `senmonkyu`
- `year`: tahun ujian
- `question`: teks soal Jepang
- `reading`: romaji
- `image`: kosongkan atau isi URL/path gambar
- `answer`: `○` atau `×`
- `explanation`: penjelasan Indonesia

## Catatan Penting

- Kartu bidang di halaman depan dibuat otomatis dari `categories.json`
- Dropdown bidang di admin juga dibuat otomatis dari file yang sama
- Hitungan jumlah soal di kartu akan mengikuti isi file JSON bidang
- Edit soal di admin saat ini tetap tersimpan di `localStorage` browser, bukan menulis balik ke repo

## Jika Ingin Menambah Banyak Soal Sekaligus

Cara paling aman:

1. Edit file `questions-<id>.json` langsung
2. Pastikan format JSON valid
3. Reload halaman kuis atau admin

Kalau ingin dibantu lagi, langkah berikut yang paling masuk akal adalah membuat validator soal JSON atau generator template soal per bidang.
