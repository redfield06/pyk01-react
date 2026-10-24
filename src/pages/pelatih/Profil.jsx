import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Avatar from '../../components/Avatar.jsx'
import { kompresFoto } from '../../utils/image.js'
import { useToast } from '../../utils/useToast.jsx'
import { useSaya } from './useSaya.js'

export default function Profil() {
  const { profil, simpan } = useOutletContext()
  const { kelas } = useSaya()
  const [form, setForm] = useState(profil)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, info] = useToast()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const foto = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try { setForm((f) => ({ ...f, foto: '' })); const d = await kompresFoto(file); setForm((f) => ({ ...f, foto: d })) } catch (err) { setError(err.message) }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const wa = form.wa.replace(/[\s-]/g, '')
    if (form.nama.trim().length < 3) return setError('Nama minimal 3 huruf.')
    if (wa && !/^(\+62|62|0)8[0-9]{7,12}$/.test(wa)) return setError('Nomor WhatsApp tidak valid.')
    setSaving(true)
    try { await simpan({ ...form, nama: form.nama.trim(), wa, lisensi: form.lisensi.trim() }); info('Profil disimpan ✓') } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <div className="view active bio">
      <div className="profile card">
        <div className="avatar-wrap">
          <Avatar big foto={form.foto} nama={form.nama} />
          <label className="avatar-edit" title="Ganti foto" aria-label="Ganti foto profil">📷<input type="file" accept="image/*" hidden onChange={foto} /></label>
        </div>
        <h2>{form.nama}</h2>
        <p className="mut">{form.email}</p>
        <span className="pill ok">● Pelatih aktif</span>
        <p className="mut" style={{ marginTop: 14 }}>Kelas diampu: {kelas.length ? kelas.map((k) => k.nama).join(', ') : 'belum ada'}</p>
        {form.foto && <p><button type="button" className="linkbtn small" onClick={() => setForm((f) => ({ ...f, foto: '' }))}>Hapus foto</button></p>}
      </div>
      <form className="card" onSubmit={submit} noValidate>
        <h3>Data pelatih</h3>
        {error && <div className="alert err">{error}</div>}
        <label>Nama lengkap<input value={form.nama} onChange={set('nama')} maxLength={80} /></label>
        <label>Email (dari akun)<input value={form.email} disabled readOnly /></label>
        <div className="f2">
          <label>No WhatsApp<input type="tel" value={form.wa} onChange={set('wa')} placeholder="08xxxxxxxxxx" /></label>
          <label>Lisensi kepelatihan<input value={form.lisensi || ''} onChange={set('lisensi')} maxLength={60} /></label>
        </div>
        <div className="adm-actions"><button type="submit" className="abtn" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button></div>
      </form>
      {toast}
    </div>
  )
}
