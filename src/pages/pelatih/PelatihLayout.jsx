import { useNavigate } from 'react-router-dom'
import PortalLayout from '../../components/PortalLayout.jsx'
import { ambilAkun, useDb } from '../../services/db.js'
import { clearSession, getUser } from '../../utils/auth.js'

const menu = [
  { to: 'beranda', icon: '🏠', label: 'Beranda', title: 'Beranda', sub: 'Ringkasan kelas dan jadwal terdekat' },
  { to: 'jadwal', icon: '📅', label: 'Jadwal', title: 'Jadwal', sub: 'Atur jadwal latihan dan pertandingan' },
  { to: 'absensi', icon: '✅', label: 'Absensi', title: 'Absensi', sub: 'Catat kehadiran pemain tiap sesi' },
  { to: 'penilaian', icon: '📈', label: 'Penilaian', title: 'Penilaian', sub: 'Nilai dan perkembangan pemain' },
  { to: 'pengumuman', icon: '📢', label: 'Pengumuman', title: 'Pengumuman', sub: 'Kirim kabar ke pemain dan orang tua' },
  { to: 'profil', icon: '👤', label: 'Profil', title: 'Profil Pelatih', sub: 'Data diri, foto, dan lisensi' },
]

const PESAN = {
  menunggu: ['⏳', 'Menunggu persetujuan owner', 'Pendaftaranmu sudah kami terima. Portal pelatih akan terbuka otomatis setelah owner menyetujui akunmu. Halaman ini diperbarui sendiri.'],
  ditolak: ['⚠️', 'Pendaftaran ditolak', 'Owner belum dapat menyetujui pendaftaranmu.'],
  nonaktif: ['🚫', 'Akun dinonaktifkan', 'Akunmu sedang dinonaktifkan oleh owner. Hubungi owner untuk mengaktifkannya kembali.'],
}

export default function PelatihLayout() {
  useDb() // status berubah otomatis saat owner menyetujui
  const nav = useNavigate()
  const akun = ambilAkun(getUser()?.email || '')

  if (akun?.status === 'aktif') return <PortalLayout roleLabel="Pelatih" menu={menu} />

  const [ikon, judul, isi] = akun ? PESAN[akun.status] || PESAN.menunggu : ['❓', 'Akun tidak ditemukan', 'Silakan login ulang atau daftar sebagai pelatih.']
  const keluar = () => { clearSession(); nav('/') }
  return (
    <div className="wait-page">
      <div className="card">
        <div className="wait-ikon">{ikon}</div>
        <h2>{judul}</h2>
        <p className="mut">{isi}</p>
        {akun?.status === 'ditolak' && akun.alasan && <div className="alert err">Alasan: {akun.alasan}</div>}
        {akun && <p className="mut small">Terdaftar sebagai <b>{akun.nama}</b> ({akun.email})</p>}
        <button type="button" className="abtn ghost" onClick={keluar}>Keluar</button>
      </div>
    </div>
  )
}
