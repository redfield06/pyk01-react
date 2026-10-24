/* ===== Dashboard Logic ===== */
const titles = {
  biodata:    ['Biodata', 'Data pemain yang terdaftar'],
  jadwal:     ['Jadwal', 'Jadwal latihan dan pertandingan'],
  pengumuman: ['Pengumuman', 'Informasi terbaru dari akademi'],
  bayar:      ['Bayar Latihan', 'Tagihan dan riwayat pembayaran']
};
const rekening = {
  'Transfer Bank BCA':     'BCA 1234567890 a.n. ArenaFutsal Academy',
  'Transfer Bank Mandiri': 'Mandiri 0987654321 a.n. ArenaFutsal Academy',
  'QRIS':                  'Scan QRIS yang dikirim admin via WhatsApp'
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sidebar = $('#sidebar'), overlay = $('#overlay');

/* --- Pindah menu --- */
function showView(id) {
  $$('.item[data-target]').forEach(b => b.classList.toggle('active', b.dataset.target === id));
  $$('.view').forEach(v => v.classList.toggle('active', v.id === id));
  $('#pageTitle').textContent = titles[id][0];
  $('#pageSub').textContent   = titles[id][1];
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  Reveal.refresh($('#' + id), true);          // ulangi animasi masuk
}
$$('.item[data-target]').forEach(b => b.addEventListener('click', () => showView(b.dataset.target)));

/* --- Menu mobile --- */
function openMenu()  { sidebar.classList.add('open');    overlay.classList.add('show'); }
function closeMenu() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
$('#burger').addEventListener('click', openMenu);
overlay.addEventListener('click', closeMenu);

/* --- Metode pembayaran --- */
$('#method').addEventListener('change', e => { $('#rek').textContent = rekening[e.target.value]; });

/* --- Kirim bukti bayar --- */
$('#payBtn').addEventListener('click', () => {
  if (!$('#proof').files.length) return toast('Pilih file bukti transfer dulu');
  toast('Bukti terkirim, menunggu verifikasi admin ✔');
  $('#proof').value = '';
});

/* --- Logout --- */
$('#logout').addEventListener('click', () => {
  if (confirm('Yakin ingin keluar?')) location.href = 'index.html';   // arahkan ke halaman login/beranda
});

/* --- Toast --- */
let t;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(t); t = setTimeout(() => el.classList.remove('show'), 2800);
}
