export const SITE = {
  name: 'ArenaFutsal',
  // Awali 62, tanpa 0 / tanda +
  waNumber: '6281234567890',
  waMessage: 'Halo Min, Saya Ingin menanyakan Info Pendaftaran nya!',
  instagramUrl: 'https://instagram.com/username_anda',
  instagramHandle: '@arenafutsal.academy',
}

export const STATS = [
  { value: '200+', label: 'Pemain Aktif' },
  { value: '12', label: 'Pelatih' },
  { value: '50+', label: 'Trofi' },
]

export const FEATURES = [
  { icon: '🏆', title: 'Pelatih Berlisensi', text: 'Dibimbing pelatih bersertifikat yang berpengalaman membina pemain muda.' },
  { icon: '📈', title: 'Kurikulum Terukur', text: 'Materi teknik, taktik, dan fisik disusun bertahap sesuai usia dan level.' },
  { icon: '🏟️', title: 'Fasilitas Nyaman', text: 'Lapangan standar, perlengkapan lengkap, dan lingkungan yang aman.' },
]

export const PROGRAMS = [
  { icon: '🌱', title: 'Junior (KU 6–9)', text: 'Pengenalan dasar bola, koordinasi, dan keseruan bermain.', freq: '2x / minggu', fee: 250000 },
  { icon: '⚡', title: 'Intermediate (KU 10–13)', text: 'Teknik lanjutan, passing, dan pemahaman taktik tim.', freq: '3x / minggu', fee: 350000 },
  { icon: '🔥', title: 'Elite (KU 14–17)', text: 'Persiapan turnamen dan seleksi tingkat kompetitif.', freq: '4x / minggu', fee: 450000 },
]

// number = nomor rekening / nomor e-wallet, owner = atas nama
// logo   = isi path gambar (contoh '/logos/bca.png') untuk memakai logo asli. Kosongkan untuk badge warna.
export const PAYMENT_METHODS = {
  bank: [
    { id: 'bca', name: 'BCA', short: 'BCA', color: '#0066AE', logo: '', number: '1234567890', owner: 'ArenaFutsal Academy' },
    { id: 'bri', name: 'BRI', short: 'BRI', color: '#00529C', logo: '', number: '0987654321', owner: 'ArenaFutsal Academy' },
    { id: 'seabank', name: 'SeaBank', short: 'SeaBank', color: '#F26B21', logo: '', number: '901234567890', owner: 'ArenaFutsal Academy' },
    { id: 'mandiri', name: 'Mandiri', short: 'mandiri', color: '#003D79', text: '#FFB700', logo: '', number: '1230009876543', owner: 'ArenaFutsal Academy' },
  ],
  ewallet: [
    { id: 'dana', name: 'DANA', short: 'DANA', color: '#118EEA', logo: '', number: '081234567890', owner: 'ArenaFutsal Academy' },
    { id: 'shopeepay', name: 'ShopeePay', short: 'ShopeePay', color: '#EE4D2D', logo: '', number: '081234567890', owner: 'ArenaFutsal Academy' },
    { id: 'gopay', name: 'GoPay', short: 'GoPay', color: '#00AED6', logo: '', number: '081234567890', owner: 'ArenaFutsal Academy' },
    { id: 'ovo', name: 'OVO', short: 'OVO', color: '#4C2A86', logo: '', number: '081234567890', owner: 'ArenaFutsal Academy' },
  ],
}

// Isi "image" dengan path foto, contoh: '/foto/1.jpg' (taruh file di folder public/foto)
export const GALLERY = [
  { title: 'Latihan Rutin', image: '', gradient: 'linear-gradient(135deg,#2563eb,#7c3aed)' },
  { title: 'Turnamen Antar Akademi', image: '', gradient: 'linear-gradient(135deg,#16a34a,#65a30d)' },
  { title: 'Pembagian Jersey', image: '', gradient: 'linear-gradient(135deg,#ea580c,#db2777)' },
  { title: 'Sesi Teknik', image: '', gradient: 'linear-gradient(135deg,#0891b2,#2563eb)' },
  { title: 'Penyerahan Piala', image: '', gradient: 'linear-gradient(135deg,#7c3aed,#db2777)' },
  { title: 'Kebersamaan Tim', image: '', gradient: 'linear-gradient(135deg,#65a30d,#0891b2)' },
  { title: 'Pertandingan Persahabatan', image: '', gradient: 'linear-gradient(135deg,#db2777,#ea580c)' },
  { title: 'Event Akademi', image: '', gradient: 'linear-gradient(135deg,#1d4ed8,#16a34a)' },
]

// Kategori yang tersedia di filter berita dan form admin
export const KATEGORI_BERITA = ['Berita', 'Kegiatan', 'Prestasi', 'Pengumuman']

// Pilihan warna sampul berita (dipakai di form admin saat tidak ada gambar)
export const WARNA_BERITA = [
  { label: 'Hijau', value: '#16a34a,#65a30d' },
  { label: 'Biru', value: '#2563eb,#7c3aed' },
  { label: 'Oranye', value: '#ea580c,#db2777' },
  { label: 'Tosca', value: '#0891b2,#2563eb' },
  { label: 'Ungu', value: '#7c3aed,#db2777' },
]

// Data awal berita (dipakai saat pertama kali dibuka dalam mode DEMO).
// Setelah itu berita dikelola lewat Dashboard > Kelola Berita.
// gambar : isi path foto, contoh '/foto/berita1.jpg' (taruh file di public/foto). Kosongkan untuk warna + emoji.
export const BERITA = [
  {
    id: 1, judul: 'Tim Junior Juara 1 Turnamen Antar Akademi', kategori: 'Prestasi', tanggal: '2026-10-12',
    emoji: '🏆', warna: '#16a34a,#65a30d', gambar: '',
    ringkas: 'Tim Junior ArenaFutsal berhasil membawa pulang piala juara setelah menang tipis di final.',
    isi: [
      'Tim Junior ArenaFutsal berhasil menjadi juara pertama pada turnamen antar akademi yang digelar akhir pekan lalu.',
      'Di partai final, tim kami menang dengan skor 3-2 setelah pertandingan yang berlangsung ketat hingga menit terakhir.',
      'Terima kasih kepada seluruh pemain, pelatih, dan orang tua yang selalu mendukung.',
    ],
  },
  {
    id: 2, judul: 'Pendaftaran Periode November Resmi Dibuka', kategori: 'Pengumuman', tanggal: '2026-10-10',
    emoji: '📢', warna: '#2563eb,#7c3aed', gambar: '',
    ringkas: 'Kuota terbatas untuk semua program. Daftar sekarang sebelum kuota penuh.',
    isi: [
      'Pendaftaran pemain baru untuk periode November 2026 sudah dibuka untuk program Junior, Intermediate, dan Elite.',
      'Kuota terbatas pada setiap program. Silakan daftar melalui halaman Pendaftaran atau hubungi admin lewat WhatsApp.',
    ],
  },
  {
    id: 3, judul: 'Pelatih Kami Ikuti Kursus Kepelatihan Terbaru', kategori: 'Berita', tanggal: '2026-10-05',
    emoji: '🎓', warna: '#ea580c,#db2777', gambar: '',
    ringkas: 'Peningkatan kualitas pelatih demi metode latihan yang lebih baik untuk anak-anak.',
    isi: [
      'Seluruh pelatih ArenaFutsal mengikuti kursus kepelatihan untuk memperbarui metode latihan.',
      'Materi mencakup teknik dasar anak usia dini, psikologi pemain muda, dan pencegahan cedera.',
    ],
  },
  {
    id: 4, judul: 'Pembagian Jersey Baru untuk Seluruh Pemain', kategori: 'Kegiatan', tanggal: '2026-09-28',
    emoji: '👕', warna: '#0891b2,#2563eb', gambar: '',
    ringkas: 'Jersey musim baru dibagikan langsung kepada pemain saat sesi latihan.',
    isi: [
      'Jersey musim baru telah dibagikan kepada seluruh pemain aktif pada sesi latihan Sabtu lalu.',
      'Bagi pemain yang belum menerima, silakan hubungi admin untuk pengambilan.',
    ],
  },
]