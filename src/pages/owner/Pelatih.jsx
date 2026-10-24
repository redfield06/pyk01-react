import Reveal from '../../components/Reveal.jsx'
import { daftarPelatih, kelasPelatih, setStatusAkun, useDb } from '../../services/db.js'
import { fmtTanggal } from '../../utils/format.js'
import { useToast } from '../../utils/useToast.jsx'

const PILL = { aktif: 'ok', menunggu: 'warn', ditolak: 'err', nonaktif: 'mut' }

export default function Pelatih() {
  useDb()
  const [toast, info] = useToast()
  const semua = daftarPelatih()
  const menunggu = semua.filter((p) => p.status === 'menunggu')
  const lain = semua.filter((p) => p.status !== 'menunggu')

  const setuju = (p) => { setStatusAkun(p.email, 'aktif'); info(`${p.nama} disetujui ✓`) }
  const tolak = (p) => {
    const alasan = window.prompt(`Alasan menolak ${p.nama}? (akan terlihat oleh pelatih)`)
    if (alasan === null) return
    if (!alasan.trim()) return info('Alasan penolakan wajib diisi')
    setStatusAkun(p.email, 'ditolak', alasan.trim())
    info('Pendaftaran ditolak')
  }
  const ubah = (p, status) => {
    if (status === 'nonaktif' && !window.confirm(`Nonaktifkan ${p.nama}? Ia tidak bisa membuka portal pelatih.`)) return
    setStatusAkun(p.email, status)
    info(status === 'aktif' ? `${p.nama} diaktifkan` : `${p.nama} dinonaktifkan`)
  }

  return (
    <div className="view active adm">
      <h3>Menunggu persetujuan ({menunggu.length})</h3>
      {menunggu.length === 0 && <div className="card"><p className="mut">Tidak ada pendaftar baru.</p></div>}
      {menunggu.map((p) => (
        <Reveal key={p.email} anim="left" className="card adm-row">
          <div className="adm-info">
            <b>{p.nama}</b>
            <small className="mut">{p.email} · {p.wa || 'WA belum diisi'}</small>
            <small className="mut">Lisensi: {p.lisensi || '–'} · Mendaftar {fmtTanggal(p.dibuat.slice(0, 10))}</small>
          </div>
          <div className="adm-btns">
            <button type="button" className="abtn" onClick={() => setuju(p)}>Setujui</button>
            <button type="button" className="abtn danger" onClick={() => tolak(p)}>Tolak</button>
          </div>
        </Reveal>
      ))}

      <h3 className="sec-gap">Semua pelatih ({lain.length})</h3>
      {lain.length === 0 && <div className="card"><p className="mut">Belum ada pelatih.</p></div>}
      {lain.map((p) => {
        const kls = kelasPelatih(p.email)
        return (
          <div key={p.email} className="card adm-row">
            <div className="adm-info">
              <b>{p.nama} <span className={`pill ${PILL[p.status]}`}>{p.status}</span></b>
              <small className="mut">{p.email} · {p.wa || '–'} · Lisensi: {p.lisensi || '–'}</small>
              <small className="mut">Kelas: {kls.length ? kls.map((k) => k.nama).join(', ') : 'belum ada (atur di Pengaturan)'}</small>
              {p.status === 'ditolak' && p.alasan && <small className="mut">Alasan: {p.alasan}</small>}
            </div>
            <div className="adm-btns">
              {p.status === 'aktif'
                ? <button type="button" className="abtn danger" onClick={() => ubah(p, 'nonaktif')}>Nonaktifkan</button>
                : <button type="button" className="abtn ghost" onClick={() => ubah(p, 'aktif')}>{p.status === 'ditolak' ? 'Setujui' : 'Aktifkan'}</button>}
            </div>
          </div>
        )
      })}
      {toast}
    </div>
  )
}
