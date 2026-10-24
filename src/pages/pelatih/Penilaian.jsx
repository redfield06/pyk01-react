import { useState } from 'react'
import { ambilAkun, bulanIni, listNilai, pemainDiKelas, simpanNilai } from '../../services/db.js'
import { useToast } from '../../utils/useToast.jsx'
import { useSaya } from './useSaya.js'

const ASPEK = [['teknik', 'Teknik'], ['fisik', 'Fisik'], ['taktik', 'Taktik'], ['disiplin', 'Disiplin']]
const rata = (n) => ((n.teknik + n.fisik + n.taktik + n.disiplin) / 4).toFixed(1)
const bulanTeks = (p) => new Date(`${p}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

export default function Penilaian() {
  const { email, kelas } = useSaya()
  const [kelasId, setKelasId] = useState('')
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [toast, info] = useToast()

  if (!kelas.length) return <div className="view active"><div className="card"><p className="mut">Kamu belum memegang kelas.</p></div></div>
  const kid = kelas.some((k) => k.id === kelasId) ? kelasId : kelas[0].id
  const pemain = pemainDiKelas(kid)

  const buka = (p) => {
    const ada = listNilai(p.email).find((n) => n.periode === bulanIni())
    setError('')
    setForm(ada ? { ...ada } : { pemainEmail: p.email, periode: bulanIni(), teknik: 7, fisik: 7, taktik: 7, disiplin: 7, catatan: '', oleh: email })
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: Number(e.target.value) }))

  const simpan = (e) => {
    e.preventDefault()
    if (!form.periode) return setError('Pilih periode penilaian.')
    simpanNilai({ ...form, oleh: email })
    info('Penilaian disimpan ✓')
    setForm(null)
  }

  if (form) {
    const p = ambilAkun(form.pemainEmail)
    const riwayat = listNilai(form.pemainEmail)
    return (
      <div className="view active adm">
        <form className="card" onSubmit={simpan} noValidate>
          <h3>Penilaian · {p?.nama}</h3>
          {error && <div className="alert err">{error}</div>}
          <label>Periode (bulan)<input type="month" value={form.periode} onChange={set('periode')} max={bulanIni()} /></label>
          {ASPEK.map(([k, n]) => (
            <label key={k} className="slider">
              <span>{n}: <b>{form[k]}</b> / 10</span>
              <input type="range" min="1" max="10" value={form[k]} onChange={setNum(k)} />
            </label>
          ))}
          <label>Catatan & saran untuk pemain
            <textarea rows={4} value={form.catatan} onChange={set('catatan')} maxLength={500} placeholder="Kelebihan, hal yang perlu ditingkatkan, saran latihan di rumah..." />
          </label>
          <div className="adm-actions">
            <button type="submit" className="abtn">Simpan</button>
            <button type="button" className="abtn ghost" onClick={() => setForm(null)}>Batal</button>
          </div>
        </form>

        {riwayat.length > 0 && (
          <div className="card" style={{ marginTop: 18 }}>
            <h3>Riwayat penilaian</h3>
            {riwayat.map((n) => (
              <div key={n.id} className="rowline top">
                <div>
                  <b>{bulanTeks(n.periode)}</b>
                  <small className="mut">{n.catatan || 'Tanpa catatan'}</small>
                </div>
                <span className="pill ok">Rata-rata {rata(n)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="view active adm">
      <div className="card">
        <label>Kelas
          <select value={kid} onChange={(e) => setKelasId(e.target.value)}>
            {kelas.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </label>
        {pemain.length === 0 && <p className="mut">Belum ada pemain di kelas ini.</p>}
        {pemain.map((p) => {
          const terakhir = listNilai(p.email)[0]
          const sudahBulanIni = terakhir?.periode === bulanIni()
          return (
            <div key={p.email} className="rowline">
              <div>
                <b>{p.nama}</b>
                <small className="mut">{terakhir ? `Terakhir: ${bulanTeks(terakhir.periode)} · rata-rata ${rata(terakhir)}` : 'Belum pernah dinilai'}</small>
              </div>
              <button type="button" className={`abtn ${sudahBulanIni ? 'ghost' : ''}`} onClick={() => buka(p)}>{sudahBulanIni ? 'Ubah nilai bulan ini' : 'Beri nilai'}</button>
            </div>
          )
        })}
      </div>
      {toast}
    </div>
  )
}
