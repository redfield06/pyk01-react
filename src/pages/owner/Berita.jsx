import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { KATEGORI_BERITA, WARNA_BERITA } from '../../data/config.js'
import { deleteNews, listNews, saveNews } from '../../services/news.js'
import { coverStyle, fmtTanggal } from '../../utils/format.js'

const kosong = () => ({
  judul: '', kategori: KATEGORI_BERITA[0], tanggal: new Date().toISOString().slice(0, 10),
  ringkas: '', isi: '', emoji: '📰', warna: WARNA_BERITA[0].value, gambar: '',
})

// Perkecil foto (lebar maks 900px) supaya muat di penyimpanan browser
function kompres(file, lebarMaks = 900) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('File harus berupa gambar.'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const skala = Math.min(1, lebarMaks / img.width)
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * skala)
      c.height = Math.round(img.height * skala)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.72))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Gambar tidak bisa dibaca.')) }
    img.src = url
  })
}

export default function KelolaBerita() {
  const [daftar, setDaftar] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null) // null = tampil daftar
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  const muat = () =>
    listNews().then(setDaftar).catch((e) => setError(e.message)).finally(() => setLoading(false))

  useEffect(() => { muat(); return () => clearTimeout(timer.current) }, [])

  const info = (t) => {
    setToast(t)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2500)
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const bukaForm = (b) => { setError(''); setForm(b ? { ...b } : kosong()) }

  const pilihFoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const gambar = await kompres(file)
      setForm((f) => ({ ...f, gambar }))
    } catch (err) {
      setError(err.message)
    }
    e.target.value = ''
  }

  const simpan = async (e) => {
    e.preventDefault()
    if (!form.judul.trim() || !form.ringkas.trim() || !form.isi.trim()) {
      setError('Judul, ringkasan, dan isi berita wajib diisi.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await saveNews({ ...form, judul: form.judul.trim(), ringkas: form.ringkas.trim(), isi: form.isi.trim() })
      await muat()
      info(form.id ? 'Berita diperbarui ✓' : 'Berita diterbitkan ✓')
      setForm(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const hapus = async (b) => {
    if (!window.confirm(`Hapus berita "${b.judul}"?`)) return
    try {
      await deleteNews(b.id)
      setDaftar((d) => d.filter((x) => x.id !== b.id))
      info('Berita dihapus')
    } catch (err) {
      setError(err.message)
    }
  }

  /* ---------- Form tambah / ubah ---------- */
  if (form) {
    return (
      <div className="view active adm">
        <form className="card" onSubmit={simpan} noValidate>
          <h3>{form.id ? 'Ubah Berita' : 'Tulis Berita Baru'}</h3>
          {error && <div className="alert err">{error}</div>}

          <label>Judul
            <input value={form.judul} onChange={set('judul')} maxLength={140} placeholder="Judul berita" />
          </label>

          <div className="adm-2">
            <label>Kategori
              <select value={form.kategori} onChange={set('kategori')}>
                {KATEGORI_BERITA.map((k) => <option key={k}>{k}</option>)}
              </select>
            </label>
            <label>Tanggal
              <input type="date" value={form.tanggal} onChange={set('tanggal')} />
            </label>
          </div>

          <label>Ringkasan (tampil di daftar berita)
            <textarea rows={2} value={form.ringkas} onChange={set('ringkas')} maxLength={220} />
          </label>

          <label>Isi berita (satu baris = satu paragraf)
            <textarea rows={9} value={form.isi} onChange={set('isi')} />
          </label>

          <label>Gambar sampul (opsional)
            <input type="file" accept="image/*" onChange={pilihFoto} />
          </label>
          <label>atau tempel tautan gambar
            <input value={form.gambar.startsWith('data:') ? '' : form.gambar} onChange={set('gambar')} placeholder="https://..." />
          </label>

          <div className="adm-2">
            <label>Emoji sampul (jika tanpa gambar)
              <input value={form.emoji} onChange={set('emoji')} maxLength={4} />
            </label>
            <label>Warna sampul
              <select value={form.warna} onChange={set('warna')}>
                {WARNA_BERITA.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
              </select>
            </label>
          </div>

          <p className="mut adm-prev-label">Pratinjau sampul</p>
          <div className="ncover adm-prev" style={coverStyle(form)}>{!form.gambar && form.emoji}</div>
          {form.gambar && <button type="button" className="abtn ghost" onClick={() => setForm((f) => ({ ...f, gambar: '' }))}>Hapus gambar</button>}

          <div className="adm-actions">
            <button type="submit" className="abtn" disabled={saving}>{saving ? 'Menyimpan...' : form.id ? 'Simpan Perubahan' : 'Terbitkan'}</button>
            <button type="button" className="abtn ghost" onClick={() => setForm(null)} disabled={saving}>Batal</button>
          </div>
        </form>
      </div>
    )
  }

  /* ---------- Daftar berita ---------- */
  return (
    <div className="view active adm">
      <div className="adm-head">
        <p className="mut">{daftar.length} berita</p>
        <button type="button" className="abtn" onClick={() => bukaForm()}>+ Tulis Berita</button>
      </div>

      {error && <div className="alert err">{error}</div>}
      {loading && <p className="mut">Memuat...</p>}
      {!loading && daftar.length === 0 && <div className="card"><p className="mut">Belum ada berita. Klik "Tulis Berita" untuk membuat yang pertama.</p></div>}

      {daftar.map((b) => (
        <div key={b.id} className="card adm-row">
          <div className="ncover adm-thumb" style={coverStyle(b)}>{!b.gambar && b.emoji}</div>
          <div className="adm-info">
            <b>{b.judul}</b>
            <small className="mut">{b.kategori} · {fmtTanggal(b.tanggal)}</small>
          </div>
          <div className="adm-btns">
            <Link className="abtn ghost" to={`/berita/${b.slug}`} target="_blank">Lihat</Link>
            <button type="button" className="abtn ghost" onClick={() => bukaForm(b)}>Ubah</button>
            <button type="button" className="abtn danger" onClick={() => hapus(b)}>Hapus</button>
          </div>
        </div>
      ))}

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </div>
  )
}
