/* ===== Scroll Reveal: tambahkan data-anim="left|right|up|down|zoom" =====
   Opsional: data-delay="150" (ms) untuk efek berurutan.
   Contoh: <div class="card" data-anim="left" data-delay="100">...</div>  */
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);        // animasi hanya sekali
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  function refresh(root = document, replay = false) {
    root.querySelectorAll('[data-anim]').forEach((el) => {
      el.style.setProperty('--d', (el.dataset.delay || 0) + 'ms');
      if (replay) el.classList.remove('in');   // ulangi animasi saat pindah menu
      if (!el.classList.contains('in')) io.observe(el);
    });
  }

  window.Reveal = { refresh };
  document.addEventListener('DOMContentLoaded', () => refresh());
})();
