# Ringkasan UI/UX Project

## 1. Top Bar Global

**Nama:** User Top Bar

**Elemen:**
- Nama pengguna
- Konteks kuis aktif: bidang, level, tahun, dan nomor soal
- Tombol **Ganti Bidang / Level / Soal**
- Tombol **Keluar**

**Behavior:**
- Selalu berada di bagian atas layar.
- Konteks kuis ditampilkan saat kuis aktif.
- Tombol ganti membuka kembali alur pemilihan bidang dan konfigurasi soal.
- Tombol keluar mengakhiri sesi pengguna.

## 2. Halaman Login

**Nama:** Login Screen

**Elemen:** input email, input password, tombol masuk, link pendaftaran, dan pesan error.

**Behavior:** Pengguna harus login sebelum mengakses aplikasi. Error ditampilkan jika kredensial tidak valid.

## 3. Halaman Pendaftaran

**Nama:** Signup Screen

**Elemen:** nama asli, nama grup, email, password, tombol daftar, catatan persetujuan admin, dan link kembali ke login.

**Behavior:** Permintaan pendaftaran menunggu persetujuan admin. Data wajib serta format email/password divalidasi.

## 4. Halaman Pemilihan Bidang

**Nama:** Category Selection Screen

**Elemen:** judul, deskripsi, kartu bidang pekerjaan, dan jumlah soal per bidang.

**Behavior:** Pengguna memilih bidang pekerjaan lalu masuk ke konfigurasi level dan tahun. Kartu memberikan feedback visual saat diarahkan atau dipilih.

## 5. Konfigurasi Level

**Nama:** Level Configuration Step

**Elemen:** bidang aktif, pilihan 初級/Shokyu dan 専門級/Senmonkyu, tombol lanjut, dan tombol kembali/ganti bidang.

**Behavior:** Satu level dapat dipilih dan diberi status visual `selected`. Tombol lanjut membawa pengguna ke pemilihan tahun.

## 6. Konfigurasi Tahun

**Nama:** Year Configuration Step

**Elemen:** daftar tahun, jumlah soal tersedia, ringkasan pilihan, tombol mulai latihan, dan tombol kembali.

**Behavior:** Pengguna memilih satu tahun atau semua tahun. Jumlah soal diperbarui berdasarkan filter. Latihan hanya dimulai jika tersedia soal yang cocok.

## 7. Halaman Kuis

**Nama:** Quiz Screen

**Elemen:** Top Bar, teks soal Jepang, gambar jika tersedia, reading, terjemahan, pilihan Benar/Salah, tombol Mundur/Maju, serta area koreksi dan penjelasan.

**Behavior:**
- Soal ditampilkan satu per satu dan diacak saat sesi dimulai.
- Setelah jawaban dipilih, jawaban dikunci dan feedback ditampilkan.
- Tombol navigasi berpindah antarsoal.
- Progress bar dan statistik benar/salah di area soal dihilangkan agar tampilan clean.
- Nomor soal hanya ditampilkan melalui Top Bar.

## 8. Panel Soal

**Nama:** Question Content Panel

**Bagian:** Japanese Panel, Reading Panel, Meaning Panel, dan Image Panel.

**Behavior:** Panel hanya muncul jika memiliki konten. Gambar dapat diklik untuk diperbesar. Pemisahan panel memudahkan pemindaian informasi.

## 9. Area Jawaban

**Nama:** Answer Choice Area

**Behavior:** Tombol Benar dan Salah memberikan feedback visual. Setelah dipilih, tombol dinonaktifkan untuk mencegah perubahan jawaban.

## 10. Area Navigasi

**Nama:** Quiz Navigation Dock

**Elemen:** tombol Mundur dan Maju.

**Behavior:** Berada di bagian bawah layar dan tetap mudah diakses. Tombol Mundur nonaktif pada soal pertama.

## 11. Area Feedback

**Nama:** Correction & Explanation Panel

**Behavior:** Muncul setelah jawaban dipilih, menampilkan status jawaban dan alasan benar/salah sebagai bantuan belajar.

## 12. Halaman Hasil

**Nama:** Results Screen

**Elemen:** ikon/trophy, judul, persentase nilai, jumlah benar, jumlah salah, total soal, ringkasan, dan tombol sesi baru/kembali.

**Behavior:** Muncul setelah seluruh soal selesai dan menampilkan rangkuman performa pengguna.

## 13. Halaman Admin

**Nama:** Admin Dashboard

**Elemen:** data pengguna, status persetujuan akun, data kehadiran, ringkasan peserta, dan kontrol administrasi.

**Behavior:** Hanya dapat diakses admin. Admin dapat mengelola status pengguna dan data terkait sesuai hak akses.

## Prinsip UX Utama

- **Fokus:** area tengah hanya berisi materi kuis dan kontrol pengerjaan.
- **Konteks selalu terlihat:** bidang, level, tahun, dan nomor soal berada di Top Bar.
- **Minim distraksi:** progress bar dan statistik benar/salah tidak memenuhi area utama.
- **Belajar bertahap:** soal, reading, terjemahan, lalu koreksi disajikan berurutan.
- **Feedback langsung:** jawaban segera dikunci dan diberi penjelasan.
- **Responsif:** layout menyesuaikan desktop dan mobile.
- **Navigasi jelas:** pengguna dapat kembali mengganti bidang, level, atau tahun.
