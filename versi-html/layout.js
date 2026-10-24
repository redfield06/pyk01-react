/* ===== NAVBAR & FOOTER (satu tempat untuk semua halaman) =====
   Ubah menu cukup di sini, semua halaman ikut berubah. */
(function () {
  // [file, teks menu]  -> tambah/hapus menu di sini
  const links = [
    ['index.html', 'Beranda'],
    ['pendaftaran.html', 'Pendaftaran'],
    ['gallery.html', 'Gallery'],
    ['contact.html', 'Contact'],
    ['berita.html', 'Berita'],
  ];
  const page = location.pathname.split('/').pop() || 'index.html';

  const nav = `
  <nav class="nav">
    <a class="logo" href="index.html">⚽ ARENA<b>FUTSAL</b></a>
    <div class="menu" id="menu">
      ${links.map(([h, t]) => `<a href="${h}" class="${h === page ? 'on' : ''}">${t}</a>`).join('')}
    </div>
    <div class="nav-right">
      <a class="btn" href="login.html">Login</a>
      <button class="burger" id="burger" aria-label="Menu">☰</button>
    </div>
  </nav>`;

  const footer = `<footer>© ${new Date().getFullYear()} ArenaFutsal Academy</footer>`;

  document.getElementById('site-nav').outerHTML = nav;
  document.getElementById('site-footer').outerHTML = footer;

  // menu mobile
  const menu = document.getElementById('menu');
  document.getElementById('burger').addEventListener('click', () => menu.classList.toggle('open'));
})();
