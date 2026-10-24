import { useState } from 'react'
import { buatInfo, hapusInfo, ambilKelas, listInfo } from '../../services/db.js'
import { fmtTanggal } from '../../utils/format.js'
import { useToast } from '../../utils/useToast.jsx'
import { useSaya } from './useSaya.js'

const CLS = { Penting: 'warn', Info: 'info', Event: 'ok' }

export default function Pengumuman() {
  const { email, akun, kelas } = useSaya()
  const kosong = { tag: 'Info', judul: '', isi: '', target: kelas[0]?.id || '', untuk: 'semua' }
  const [form, setForm] = useState(kosong)
  const [error, setError] = useState('')
  const [toast, info] = useToast()
  const saya = listInfo().filter((i) => i.oleh === email)

  if (!kelas.length) return <div className="view active"><div className="card"><p className="mut">Kamu belum memegang kelas, jadi belum bisa mengirim pengumuman.</p></div></div>

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const kirim = (e) => {
    e.preventDefault()
    try {
      buatInfo({ ...form, target: form.target || kelas[0].id, oleh: email, namaOleh: akun?.nama || 'Pelatih' })
      setForm({ ...kosong, tag: form.tag })
      setError('')
      info('Pengumuman terkirim ✓')
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="view active adm">
      <form className="card" onSubmit={kirim} noValidate>
        <h3>Kirim pengumuman</h3>
        {error && <div className="alert err">{error}</div>}
        <div className="f2">
          <label>Kelas tujuan
            <select value={form.target} onChange={set('target')}>
              {kelas.map((k) => <option key={k.id} value={k.id}>Kelas {k.nama}</option>)}
            </select>
          </label>
          <label>Ditujukan untuk
            <select value={form.untuk} onChange={set('untuk')}>
              <option value="semua">Pemain dan orang tua</option>
              <option value="pemain">Pemain</option>
              <option value="orang tua">Orang tua</option>
            </select>
          </label>
        </div>
        <label>Jenis
          <select value={form.tag} onChange={set('tag')}>
            <option>Info</option><option>Penting</option><option>Event</option>
          </select>
        </label>
        <label>Judul<input value={form.judul} onChange={set('judul')} maxLength={100} /></label>
        <label>Isi pengumuman<textarea rows={4} value={form.isi} onChange={set('isi')} maxLength={600} /></label>
        <div className="adm-actions"><button type="submit" className="abtn">Kirim</button></div>
      </form>

      <h3 className="sec-gap">Pengumuman yang kamu kirim</h3>
      {saya.length === 0 && <div className="card"><p className="mut">Belum ada.</p></div>}
      {saya.map((i) => (
        <div key={i.id} className="card adm-row">
          <div className="adm-info">
            <b>{i.judul} <span className={`pill ${CLS[i.tag] || 'info'}`}>{i.tag}</span></b>
            <small className="mut">{fmtTanggal(i.tgl)} · {i.target === 'semua' ? 'Semua kelas' : `Kelas ${ambilKelas(i.target)?.nama}`} · {i.untuk === 'semua' ? 'Pemain dan orang tua' : i.untuk}</small>
          </div>
          <button type="button" className="abtn danger" onClick={() => { if (window.confirm('Hapus pengumuman ini?')) { hapusInfo(i.id); info('Dihapus') } }}>Hapus</button>
        </div>
      ))}
      {toast}
    </div>
  )
}
