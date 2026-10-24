# ArenaFutsal Academy (React + Vite)

## Menjalankan
1. Install Node.js (versi 18+): https://nodejs.org
2. Buka terminal di folder ini, lalu:
   npm install
   npm run dev
3. Buka alamat yang muncul (biasanya http://localhost:5173)

## Build produksi
   npm run build   (hasil ada di folder dist/)

## Yang perlu diganti
- src/data/config.js      -> nomor WhatsApp, Instagram, program, foto gallery
- src/services/api.js     -> hubungkan ke backend (set VITE_API_URL di file .env)
- src/pages/dashboard/*   -> ganti data contoh dengan data dari API

## Halaman
/ (Beranda)  /pendaftaran  /gallery  /contact  /login
/dashboard/biodata  /dashboard/jadwal  /dashboard/pengumuman  /dashboard/bayar

## Fitur Berita

- **/berita** — daftar berita, filter kategori (`?kategori=prestasi`), pencarian (`?q=juara`), dan tombol *Muat lebih banyak*.
- **/berita/judul-artikel** — halaman artikel + tombol bagikan WhatsApp + berita lainnya.
- **Dashboard › Kelola Berita** — tambah, ubah, hapus berita (khusus admin).

**Mode demo** (tanpa `VITE_API_URL`): berita disimpan di `localStorage` browser, jadi hanya terlihat di browser yang sama.
Login sebagai admin: gunakan email berawalan `admin` (contoh `admin@arena.com`), password bebas.

**Mode API** (`VITE_API_URL` terisi): `src/services/news.js` memakai endpoint
`GET/POST /berita`, `GET /berita/:slug`, `PUT/DELETE /berita/:id`. Login harus mengembalikan `{ token, role: 'admin' }`,
dan backend wajib memeriksa role admin untuk POST/PUT/DELETE.

## Daftar Akun dengan OTP Gmail

Alur: **Login › Buat akun** (`/daftar-akun`) › isi nama, Gmail, password › kode OTP 6 angka dikirim ke Gmail › verifikasi › akun jadi dan langsung login.

- Hanya alamat `@gmail.com` yang diterima. Kode berlaku 5 menit, kirim ulang setelah 60 detik, maksimal 5 kali salah input per kode.
- **Mode demo** (tanpa `VITE_API_URL`): email tidak dikirim, kode OTP ditampilkan di layar dengan label "Mode demo".
- **Mode asli**: jalankan `server-contoh/` (lihat `.env.example` di dalamnya, butuh App Password Gmail), lalu isi `VITE_API_URL=http://localhost:3001` di `.env`.
  1. `cd server-contoh && npm install`
  2. salin `.env.example` menjadi `.env`, isi `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `JWT_SECRET`
  3. `npm start`
- Server contoh hanya mencakup `/auth/otp/request`, `/auth/otp/verify`, dan `/login`, dengan penyimpanan di memori. Untuk produksi, ganti dengan database.

## Profil Pemain & Foto

Dashboard › **Biodata**: nama di dashboard otomatis mengikuti nama akun saat mendaftar. Pengguna bisa menekan **Ubah Data Pribadi**
untuk mengisi/ubah nama, jenis kelamin, tanggal & tempat lahir, sekolah, jersey, **No WhatsApp, orang tua/wali, alamat**, dan
mengganti **foto profil** (tombol 📷; foto otomatis dipotong persegi dan diperkecil).

- Mode demo: profil disimpan di `localStorage` per email.
- Mode API: `GET /profil` dan `PUT /profil` (header `Authorization: Bearer <token>`). Respons login dan `/auth/otp/verify` harus menyertakan `user: { email, nama }`. `server-contoh/` sudah mencakup semuanya.

## Portal Pelatih & Owner

Setelah login, pengguna diarahkan sesuai peran: pemain/orang tua ke `/dashboard`, pelatih ke `/pelatih`, owner ke `/owner`.

**Alur akun**
- Pelatih daftar di `/daftar-akun?peran=pelatih` (Gmail + OTP). Status awal **menunggu**; portal terbuka setelah owner menyetujui di **Owner › Pelatih** (tolak wajib beri alasan).
- Owner tidak daftar sendiri. Mode demo: login dengan email berawalan `owner` atau `admin` (contoh `owner@demo.id`), password bebas.

**Portal pelatih** (`/pelatih`): Beranda, Jadwal (latihan & pertandingan), Absensi (hadir/izin/sakit/alpa + rekap), Penilaian (skor bulanan + catatan), Pengumuman (per kelas, untuk pemain/orang tua), Profil.
**Portal owner** (`/owner`): Ringkasan (KPI + grafik), Pelatih (persetujuan), Pemain & pendaftar (kelas, status, detail, ekspor CSV), Keuangan (tagihan, tandai lunas, ekspor CSV), Berita (teks/foto), Pengaturan (kelas, pelatih tiap kelas, harga, rekening).

**Terhubung ke dashboard pemain**: Jadwal, Pengumuman (dengan badge angka baru), dan angka Kehadiran di Biodata kini berasal dari data pelatih.

**Data**: semua data portal disimpan di `localStorage` lewat `src/services/db.js` (mode demo, berisi data contoh; ada tombol *Reset data demo* di Owner › Pengaturan). Pelatih, owner, dan pemain saling melihat data yang sama hanya jika membuka situs di browser yang sama. Untuk dipakai sungguhan, ganti isi `db.js` dengan pemanggilan REST API ke backend dengan nama fungsi yang sama. Backend `server-contoh/` saat ini baru mencakup autentikasi/OTP/profil, belum endpoint portal.

## Halaman Login (pilih portal)

`/login` menampilkan tiga kartu: **Pemain** (kiri), **Owner** (tengah), **Pelatih** (kanan). Tiap kartu menuju form sendiri:
`/login/pemain`, `/login/owner`, `/login/pelatih`. Akun tidak bisa masuk lewat pintu peran lain (pesan error menunjukkan portal yang benar).
Pemain masuk ke `/dashboard`, owner ke `/owner`, pelatih ke `/pelatih`.
Backend: kirim `peran` (`player`/`pelatih`/`owner`) di body `POST /login`, dan cocokkan dengan peran akun di server.
