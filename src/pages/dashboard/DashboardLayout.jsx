import PortalLayout from '../../components/PortalLayout.jsx'
import { jumlahInfoBaru, useDb } from '../../services/db.js'
import { getUser } from '../../utils/auth.js'

const menu = [
  { to: 'biodata', icon: '👤', label: 'Biodata', title: 'Biodata', sub: 'Data pemain yang terdaftar' },
  { to: 'jadwal', icon: '📅', label: 'Jadwal', title: 'Jadwal', sub: 'Jadwal latihan dan pertandingan' },
  { to: 'pengumuman', icon: '📢', label: 'Pengumuman', title: 'Pengumuman', sub: 'Informasi terbaru dari akademi' },
  { to: 'bayar', icon: '💳', label: 'Bayar Latihan', title: 'Bayar Latihan', sub: 'Tagihan dan riwayat pembayaran' },
]

export default function DashboardLayout() {
  useDb()
  const baru = jumlahInfoBaru(getUser()?.email || '')
  return <PortalLayout roleLabel="Pemain" menu={menu.map((m) => (m.to === 'pengumuman' ? { ...m, badge: baru } : m))} />
}
