import { useEffect, useState } from 'react'
import { ambilKelas, getAbsensi, iso, listSesi, pemainDiKelas, simpanAbsensi, statPemain } from '../../services/db.js'
import { fmtTanggal } from '../../utils/format.js'
import { useToast } from '../../utils/useToast.jsx'
import { useSaya } from './useSaya.js'

const STATUS = [['H', 'Hadir'], ['I', 'Izin'], ['S', 'Sakit'], ['A', 'Alpa']]

export default function Absensi() {
  const { kelas, kelasIds } = useSaya()
  const hari = iso()
  const sesi = listSesi(kelasIds).reverse() // terbaru dulu
  const awal = (sesi.find((s) => s.tanggal <= hari) || sesi[sesi.length - 1] || {}).id || ''
  const [pilihan, setSesiId] = useState('')
  const sesiId = sesi.some((s) => s.id === pilihan) ? pilihan : awal // jaga-jaga bila sesi dihapus/ditambah
  const [peta, setPeta] = useState({})
  const [error, setError] = useState('')
  const [toast, info] = useToast()

  const dipilih = sesi.find((s) => s.id === sesiId)
  const pemain = dipilih ? pemainDiKelas(dipilih.kelasId) : []

  useEffect(() => { setPeta(dipilih ? { ...getAbsensi(dipilih.id) } : {}); setError('') }, [sesiId])

  if (!kelas.length) return <div className="view active"><div className="card"><p className="mut">Kamu belum memegang kelas.</p></div></div>
  if (!sesi.length) return <div className="view active"><div className="card"><p className="mut">Belum ada sesi. Buat jadwal dulu di menu Jadwal.</p></div></div>

  const tandai = (email, st) => setPeta((p) => ({ ...p, [email]: st }))
  const hitung = (st) => pemain.filter((p) => peta[p.email] === st).length
  const belum = pemain.filter((p) => !peta[p.email]).length

  const simpan = () => {
    if (!pemain.length) return setError('Belum ada pemain di kelas ini.')
    if (belum) return setError(`Masih ${belum} pemain yang belum ditandai.`)
    simpanAbsensi(dipilih.id, Object.fromEntries(pemain.map((p) => [p.email, peta[p.email]])))
    setError('')
    info('Absensi disimpan ✓')
  }

  return (
    <div className="view active adm">
      <div className="card">
        <label>Pilih sesi
          <select value={sesiId} onChange={(e) => setSesiId(e.target.value)}>
            {sesi.map((s) => <option key={s.id} value={s.id}>{fmtTanggal(s.tanggal)} · {s.judul} (Kelas {ambilKelas(s.kelasId)?.nama})</option>)}
          </select>
        </label>

        {dipilih && dipilih.tanggal > hari && <div className="alert info">Sesi ini belum berlangsung. Kamu tetap bisa mengisi absensinya lebih awal.</div>}
        {error && <div className="alert err">{error}</div>}

        <div className="abs-sum">
          {STATUS.map(([k, n]) => <span key={k} className={`pill st-${k}`}>{n}: {hitung(k)}</span>)}
          {belum > 0 && <span className="pill">Belum: {belum}</span>}
        </div>

        {pemain.length === 0 && <p className="mut">Belum ada pemain di kelas ini. Owner menempatkan pemain di menu Pemain.</p>}
        {pemain.map((p) => (
          <div key={p.email} className="rowline">
            <b>{p.nama}</b>
            <div className="seg" role="group" aria-label={`Kehadiran ${p.nama}`}>
              {STATUS.map(([k, n]) => (
                <button key={k} type="button" className={`${peta[p.email] === k ? `on st-${k}` : ''}`} onClick={() => tandai(p.email, k)} aria-pressed={peta[p.email] === k}>{n}</button>
              ))}
            </div>
          </div>
        ))}

        <div className="adm-actions">
          <button type="button" className="abtn" onClick={simpan} disabled={!pemain.length}>Simpan Absensi</button>
          <button type="button" className="abtn ghost" onClick={() => setPeta(Object.fromEntries(pemain.map((p) => [p.email, 'H'])))} disabled={!pemain.length}>Hadir semua</button>
          <button type="button" className="abtn ghost" onClick={() => setPeta({})}>Kosongkan</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Rekap kehadiran{dipilih ? ` · Kelas ${ambilKelas(dipilih.kelasId)?.nama}` : ''}</h3>
        {pemain.map((p) => {
          const s = statPemain(p.email)
          return (
            <div key={p.email} className="rowline">
              <span>{p.nama}</span>
              <div className="bar-wrap"><div className="bar" style={{ width: `${s.persen ?? 0}%` }} /></div>
              <b className="bar-val">{s.persen === null ? '–' : `${s.persen}%`}</b>
            </div>
          )
        })}
      </div>
      {toast}
    </div>
  )
}
