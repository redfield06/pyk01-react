import { useState } from 'react'
import { hapusSesi, iso, listSesi, simpanSesi, ambilKelas } from '../../services/db.js'
import { fmtTanggal } from '../../utils/format.js'
import { useToast } from '../../utils/useToast.jsx'
import { useSaya } from './useSaya.js'

export default function Jadwal() {
  const { email, kelas, kelasIds } = useSaya()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [toast, info] = useToast()
  const hari = iso()
  const semua = listSesi(kelasIds)
  const mendatang = semua.filter((s) => s.tanggal >= hari)
  const lalu = semua.filter((s) => s.tanggal < hari).reverse().slice(0, 8)

  if (!kelas.length) return <div className="view active"><div className="card"><p className="mut">Kamu belum memegang kelas, jadi belum bisa membuat jadwal.</p></div></div>

  const baru = () => ({ kelasId: kelas[0].id, tipe: 'latihan', judul: '', tanggal: hari, mulai: '16:00', selesai: '17:30', lokasi: 'Lapangan A', oleh: email })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const simpan = (e) => {
    e.preventDefault()
    setError('')
    if (form.selesai <= form.mulai) return setError('Jam selesai harus setelah jam mulai.')
    try {
      simpanSesi(form)
      info(form.id ? 'Jadwal diperbarui ✓' : 'Jadwal ditambahkan ✓')
      setForm(null)
    } catch (err) { setError(err.message) }
  }

  const hapus = (s) => {
    if (window.confirm(`Hapus sesi "${s.judul}"? Data absensinya ikut terhapus.`)) { hapusSesi(s.id); info('Sesi dihapus') }
  }

  const Baris = ({ s, lampau }) => (
    <div className={`card adm-row${lampau ? ' redup' : ''}`}>
      <div className="adm-info">
        <b>{s.judul} <span className={`pill ${s.tipe === 'pertandingan' ? 'warn' : 'info'}`}>{s.tipe}</span></b>
        <small className="mut">{fmtTanggal(s.tanggal)} · {s.mulai}–{s.selesai} · {s.lokasi} · Kelas {ambilKelas(s.kelasId)?.nama}</small>
      </div>
      <div className="adm-btns">
        <button type="button" className="abtn ghost" onClick={() => { setError(''); setForm({ ...s }) }}>Ubah</button>
        <button type="button" className="abtn danger" onClick={() => hapus(s)}>Hapus</button>
      </div>
    </div>
  )

  if (form) {
    return (
      <div className="view active adm">
        <form className="card" onSubmit={simpan} noValidate>
          <h3>{form.id ? 'Ubah Jadwal' : 'Tambah Jadwal'}</h3>
          {error && <div className="alert err">{error}</div>}
          <div className="f2">
            <label>Jenis
              <select value={form.tipe} onChange={set('tipe')}>
                <option value="latihan">Latihan</option>
                <option value="pertandingan">Pertandingan</option>
              </select>
            </label>
            <label>Kelas
              <select value={form.kelasId} onChange={set('kelasId')}>
                {kelas.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
            </label>
          </div>
          <label>Judul / lawan
            <input value={form.judul} onChange={set('judul')} maxLength={80} placeholder={form.tipe === 'latihan' ? 'Contoh: Teknik Dasar' : 'Contoh: Pertandingan vs Garuda FC'} />
          </label>
          <div className="f2">
            <label>Tanggal<input type="date" value={form.tanggal} onChange={set('tanggal')} /></label>
            <label>Lokasi<input value={form.lokasi} onChange={set('lokasi')} maxLength={60} /></label>
          </div>
          <div className="f2">
            <label>Jam mulai<input type="time" value={form.mulai} onChange={set('mulai')} /></label>
            <label>Jam selesai<input type="time" value={form.selesai} onChange={set('selesai')} /></label>
          </div>
          <div className="adm-actions">
            <button type="submit" className="abtn">Simpan</button>
            <button type="button" className="abtn ghost" onClick={() => setForm(null)}>Batal</button>
          </div>
        </form>
        {toast}
      </div>
    )
  }

  return (
    <div className="view active adm">
      <div className="adm-head">
        <p className="mut">{mendatang.length} sesi mendatang</p>
        <button type="button" className="abtn" onClick={() => { setError(''); setForm(baru()) }}>+ Tambah Jadwal</button>
      </div>
      {mendatang.length === 0 && <div className="card"><p className="mut">Belum ada jadwal mendatang.</p></div>}
      {mendatang.map((s) => <Baris key={s.id} s={s} />)}
      {lalu.length > 0 && <h3 className="sec-gap">Sudah lewat</h3>}
      {lalu.map((s) => <Baris key={s.id} s={s} lampau />)}
      {toast}
    </div>
  )
}
