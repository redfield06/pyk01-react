/* ===== DATA BERITA =====
   Tambah berita baru: salin satu blok { ... } lalu ubah isinya.
   Taruh berita terbaru di PALING ATAS (otomatis jadi berita utama).
   gambar : isi path foto, contoh 'foto/berita1.jpg'. Kosongkan untuk memakai warna + emoji. */
const BERITA = [
    {
        id: 1,
        judul: 'Tim Junior Juara 1 Turnamen Antar Akademi',
        kategori: 'Prestasi',
        tanggal: '2026-10-12',
        emoji: '🏆',
        warna: '#16a34a,#65a30d',
        gambar: '',
        ringkas: 'Tim Junior ArenaFutsal berhasil membawa pulang piala juara setelah menang tipis di final.',
        isi: [
            'Tim Junior ArenaFutsal berhasil menjadi juara pertama pada turnamen antar akademi yang digelar akhir pekan lalu.',
            'Di partai final, tim kami menang dengan skor 3-2 setelah pertandingan yang berlangsung ketat hingga menit terakhir.',
            'Terima kasih kepada seluruh pemain, pelatih, dan orang tua yang selalu mendukung.',
        ],
    },
    {
        id: 2,
        judul: 'Pendaftaran Periode November Resmi Dibuka',
        kategori: 'Pengumuman',
        tanggal: '2026-10-10',
        emoji: '📢',
        warna: '#2563eb,#7c3aed',
        gambar: '',
        ringkas: 'Kuota terbatas untuk semua program. Daftar sekarang sebelum kuota penuh.',
        isi: [
            'Pendaftaran pemain baru untuk periode November 2026 sudah dibuka untuk program Junior, Intermediate, dan Elite.',
            'Kuota terbatas pada setiap program. Silakan daftar melalui halaman Pendaftaran atau hubungi admin lewat WhatsApp.',
        ],
    },
    {
        id: 3,
        judul: 'Pelatih Kami Ikuti Kursus Kepelatihan Terbaru',
        kategori: 'Kegiatan',
        tanggal: '2026-10-05',
        emoji: '🎓',
        warna: '#ea580c,#db2777',
        gambar: '',
        ringkas: 'Peningkatan kualitas pelatih demi metode latihan yang lebih baik untuk anak-anak.',
        isi: [
            'Seluruh pelatih ArenaFutsal mengikuti kursus kepelatihan untuk memperbarui metode latihan.',
            'Materi mencakup teknik dasar anak usia dini, psikologi pemain muda, dan pencegahan cedera.',
        ],
    },
    {
        id: 4,
        judul: 'Pembagian Jersey Baru untuk Seluruh Pemain',
        kategori: 'Kegiatan',
        tanggal: '2026-09-28',
        emoji: '👕',
        warna: '#0891b2,#2563eb',
        gambar: '',
        ringkas: 'Jersey musim baru dibagikan langsung kepada pemain saat sesi latihan.',
        isi: [
            'Jersey musim baru telah dibagikan kepada seluruh pemain aktif pada sesi latihan Sabtu lalu.',
            'Bagi pemain yang belum menerima, silakan hubungi admin untuk pengambilan.',
        ],
    },
];

/* ===== LOGIKA TAMPILAN (biasanya tidak perlu diubah) ===== */
const $ = (s) => document.querySelector(s);
const fmt = (t) => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const cover = (b) =>
    `style="background:${b.gambar ? `url('${b.gambar}') center/cover` : `linear-gradient(135deg,${b.warna})`}"`;

let aktif = 'Semua';

function renderFilter() {
    const kategori = ['Semua', ...new Set(BERITA.map((b) => b.kategori))];
    $('#filters').innerHTML = kategori
        .map((k) => `<button class="${k === aktif ? 'on' : ''}" data-k="${k}">${k}</button>`)
        .join('');
}

function renderBerita() {
    const list = BERITA.filter((b) => aktif === 'Semua' || b.kategori === aktif);
    const [utama, ...lainnya] = list;

    $('#featured').innerHTML = utama
        ? `<article class="card news-featured" data-anim="up" data-id="${utama.id}">
         <div class="ncover big" ${cover(utama)}>${utama.gambar ? '' : utama.emoji}</div>
         <div class="nbody">
           <span class="ntag">${utama.kategori}</span>
           <h3>${utama.judul}</h3>
           <p>${utama.ringkas}</p>
           <small>${fmt(utama.tanggal)}</small>
           <span class="more">Baca selengkapnya →</span>
         </div>
       </article>`
        : '<p class="sub">Belum ada berita pada kategori ini.</p>';

    $('#newsGrid').innerHTML = lainnya
        .map(
            (b, i) => `<article class="card ncard" data-anim="${['left', 'up', 'right'][i % 3]}" data-delay="${(i % 3) * 100}" data-id="${b.id}">
         <div class="ncover" ${cover(b)}>${b.gambar ? '' : b.emoji}</div>
         <div class="nbody">
           <span class="ntag">${b.kategori}</span>
           <h3>${b.judul}</h3>
           <p>${b.ringkas}</p>
           <small>${fmt(b.tanggal)}</small>
         </div>
       </article>`
        )
        .join('');

    Reveal.refresh(document.querySelector('.w'), true); // jalankan animasi masuk
}

/* --- Filter kategori --- */
$('#filters').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    aktif = btn.dataset.k;
    renderFilter();
    renderBerita();
});

/* --- Buka berita --- */
function bukaBerita(id) {
    const b = BERITA.find((x) => x.id === Number(id));
    if (!b) return;
    $('#modalBody').innerHTML = `
    <div class="ncover big" ${cover(b)}>${b.gambar ? '' : b.emoji}</div>
    <div class="modal-text">
      <span class="ntag">${b.kategori}</span>
      <h2>${b.judul}</h2>
      <small>${fmt(b.tanggal)}</small>
      ${b.isi.map((p) => `<p>${p}</p>`).join('')}
    </div>`;
    $('#modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function tutupBerita() {
    $('#modal').classList.remove('open');
    document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
    const kartu = e.target.closest('[data-id]');
    if (kartu) bukaBerita(kartu.dataset.id);
    if (e.target.id === 'modal' || e.target.id === 'modalClose') tutupBerita();
});
document.addEventListener('keydown', (e) => e.key === 'Escape' && tutupBerita());

renderFilter();
renderBerita();