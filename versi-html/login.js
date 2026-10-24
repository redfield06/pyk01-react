/* ===== Halaman Login (sementara demo) =====
   Nanti ganti dengan autentikasi backend, lalu arahkan ke dashboard. */
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  location.href = 'dashboard.html';
});
