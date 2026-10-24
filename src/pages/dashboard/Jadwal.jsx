import { useOutletContext } from 'react-router-dom'
import Reveal from '../../components/Reveal.jsx'
import { ambilAkun, ambilKelas, listSesi, namaDari, useDb, iso } from '../../services/db.js'

const HARI = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']
const fmt = (t) => new Date(t).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })

export default function Jadwal() {
  useDb()
  const { profil } = useOutletContext()
  const akun = ambilAkun(profil.email)
  const kelas = akun?.kelasId ? ambilKelas(akun.kelasId) : null
  const semua = akun?.kelasId ? listSesi([akun.kelasId]) : []
  const hariIni = iso()
  const mendatang = semua.filter((s) => s.tanggal >= hariIni)
  const latihan = mendatang.filter((s) => s.tipe === 'latihan').slice(0, 6)
  const laga = mendatang.filter((s) => s.tipe === 'pertandingan')

  if (!kelas) {
    return (
      <div className="view active">
        <div className="card">
          <h3>Belum masuk kelas</h3>
          <p className="mut">Jadwal akan muncul setelah akademi menempatkanmu di sebuah kelas. Hubungi pelatih atau owner.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view active">
      <p className="mut" style={{ marginBottom: 14 }}>Kelas {kelas.nama}{kelas.pelatih ? ` · Pelatih ${namaDari(kelas.pelatih)}` : ''}</p>
      {latihan.length === 0 && <div className="card"><p className="mut">Belum ada jadwal latihan mendatang.</p></div>}
      <div className="cards3">
        {latihan.map((s, i) => (
          <Reveal as="article" key={s.id} anim={['left', 'up', 'right'][i % 3]} delay={(i % 3) * 100} className="card sch">
            <div className="day">{HARI[new Date(s.tanggal).getDay()]}</div>
            <div>
              <h3>{s.judul}</h3>
              <p className="mut">{fmt(s.tanggal)}</p>
              <p className="mut">{s.mulai} – {s.selesai} · {s.lokasi}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal anim="zoom" className="card" style={{ marginTop: 18 }}>
        <h3>Pertandingan Mendatang</h3>
        {laga.length === 0 && <p className="mut">Belum ada pertandingan terjadwal.</p>}
        {laga.map((s) => (
          <p key={s.id} className="mut">{fmt(s.tanggal)} · {s.judul} · {s.mulai} · {s.lokasi}</p>
        ))}
      </Reveal>
    </div>
  )
}
