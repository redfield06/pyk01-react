import PortalLayout from '../../components/PortalLayout.jsx'
import { daftarPelatih, daftarPemain, useDb } from '../../services/db.js'

const menu = [
  { to: 'ringkasan', icon: '📊', label: 'Ringkasan', title: 'Ringkasan Akademi', sub: 'Gambaran singkat kondisi akademi' },
  { to: 'pelatih', icon: '🧑‍🏫', label: 'Pelatih', title: 'Pelatih', sub: 'Persetujuan dan pengelolaan pelatih' },
  { to: 'pemain', icon: '⚽', label: 'Pemain', title: 'Pemain & Pendaftar', sub: 'Data pemain, kelas, dan status' },
  { to: 'keuangan', icon: '💰', label: 'Keuangan', title: 'Keuangan', sub: 'Pembayaran, tunggakan, dan laporan' },
  { to: 'berita', icon: '📰', label: 'Berita', title: 'Kelola Berita', sub: 'Terbitkan kabar terbaru akademi' },
  { to: 'pengaturan', icon: '⚙️', label: 'Pengaturan', title: 'Pengaturan', sub: 'Kelas, harga, dan rekening' },
]

export default function OwnerLayout() {
  useDb()
  const menunggu = daftarPelatih().filter((p) => p.status === 'menunggu').length
  const baru = daftarPemain().filter((p) => p.status === 'baru').length
  return (
    <PortalLayout
      roleLabel="Owner"
      menu={menu.map((m) => (m.to === 'pelatih' ? { ...m, badge: menunggu } : m.to === 'pemain' ? { ...m, badge: baru } : m))}
    />
  )
}
