export const fmtTanggal = (t) =>
  t ? new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

export const coverStyle = (b) => ({
  background: b.gambar
    ? `url("${b.gambar}") center/cover`
    : `linear-gradient(135deg,${b.warna || '#2563eb,#7c3aed'})`,
})

export const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

export const bulanTeks = (p) =>
  new Date(`${p}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
