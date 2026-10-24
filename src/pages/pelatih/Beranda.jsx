import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal.jsx'
import { iso, listInfo, listSesi, pemainDiKelas } from '../../services/db.js'
import { fmtTanggal } from '../../utils/format.js'
import { useSaya } from './useSaya.js'

export default function Beranda() {
  const { email, akun, kelas, kelasIds } = useSaya()
  const hari = iso()
  const mendatang = listSesi(kelasIds).filter((s) => s.tanggal >= hari).slice(0, 5)
  const hariIni = mendatang.filter((s) => s.tanggal === hari)
  const infoSaya = listInfo().filter((i) => i.oleh === email).slice(0, 3)
  const totalPemain = kelas.reduce((n, k) => n + pemainDiKelas(k.id).length, 0)

  return (
    <div className="view active">
      <Reveal anim="down" className="card sapa">
        <h3>Halo, {akun?.nama?.split(' ')[0]} 👋</h3>
        <p className="mut">
          {kelas.length
            ? `Kamu mengampu ${kelas.length} kelas dengan ${totalPemain} pemain. ${hariIni.length ? `Hari ini ada ${hariIni.length} sesi.` : 'Tidak ada sesi hari ini.'}`
            : 'Kamu belum memegang kelas. Owner akan menempatkanmu di sebuah kelas, lalu menu di samping siap dipakai.'}
        </p>
        {hariIni.length > 0 && <Link className="abtn" to="../absensi">Ambil absensi</Link>}
      </Reveal>

      <div className="kpis">
        {kelas.map((k, i) => (
          <Reveal key={k.id} anim="up" delay={i * 80} className="card kpi">
            <small className="mut">Kelas</small>
            <b>{k.nama}</b>
            <span className="mut">{pemainDiKelas(k.id).length} pemain · {k.usia}</span>
          </Reveal>
        ))}
      </div>

      <div className="cols2">
        <Reveal anim="left" className="card">
          <h3>Sesi mendatang</h3>
          {mendatang.length === 0 && <p className="mut">Belum ada jadwal. Buat di menu Jadwal.</p>}
          {mendatang.map((s) => (
            <div key={s.id} className="rowline">
              <div>
                <b>{s.judul}</b>
                <small className="mut">{fmtTanggal(s.tanggal)} · {s.mulai} · {s.lokasi}</small>
              </div>
              <span className={`pill ${s.tipe === 'pertandingan' ? 'warn' : 'info'}`}>{s.tipe}</span>
            </div>
          ))}
        </Reveal>
        <Reveal anim="right" className="card">
          <h3>Pengumuman terakhirmu</h3>
          {infoSaya.length === 0 && <p className="mut">Belum ada. Kirim lewat menu Pengumuman.</p>}
          {infoSaya.map((i) => (
            <div key={i.id} className="rowline">
              <div><b>{i.judul}</b><small className="mut">{fmtTanggal(i.tgl)}</small></div>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  )
}
