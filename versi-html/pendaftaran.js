/* ===== Halaman Pendaftaran ===== */

// Umur otomatis dari tanggal lahir
document.getElementById('tl').addEventListener('change', (e) => {
  const d = new Date(e.target.value), n = new Date();
  const out = document.getElementById('um');
  if (isNaN(d)) { out.value = ''; return; }
  let age = n.getFullYear() - d.getFullYear();
  if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) age--;
  out.value = age + ' tahun';
});

// Kirim pendaftaran (sementara demo) -> nanti ganti dengan fetch() ke backend
document.getElementById('regForm').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Data pendaftaran:', Object.fromEntries(new FormData(e.target)));
  alert('Pendaftaran terkirim! Kami akan menghubungi Anda via WhatsApp.');
  e.target.reset();
  document.getElementById('um').value = '';
});
