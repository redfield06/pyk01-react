import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Reveal from '../../components/Reveal.jsx'
import Avatar from '../../components/Avatar.jsx'
import { kompresFoto } from '../../utils/image.js'
import { fmtTanggal } from '../../utils/format.js'
import { statPemain, useDb } from '../../services/db.js'

const JERSEY = ['XS', 'S', 'M', 'L', 'XL']
const WA_RE = /^(\+62|62|0)8[0-9]{7,12}$/

const hitungUmur = (tgl) => {
  const d = new Date(tgl)
  if (!tgl || isNaN(d)) return ''
  const n = new Date()
  let a = n.getFullYear() - d.getFullYear()
  if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--
  return a >= 0 ? `${a} tahun` : ''
}

const Item = ({ label, value, full }) => (
  <div className={full ? 'full' : ''}>
    <dt>{label}</dt>
    <dd>{value || <span className="belum">Belum diisi</span>}</dd>
  </div>
)

export default function Biodata() {
  useDb()
  const { profil, simpan } = useOutletContext()
  const stat = statPemain(profil.email) // kehadiran dari absensi pelatih
  const [edit, setEdit] = useState(false)
  const [draft, setDraft] = useState(profil)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const info = (t) => {
    setToast(t)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2500)
  }

  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }))

  const bukaEdit = () => { setDraft(profil); setError(''); setEdit(true) }

  const pilihFoto = (langsungSimpan) => async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const foto = await kompresFoto(file)
      if (langsungSimpan) {
        await simpan({ ...profil, foto })
        info('Foto profil diperbarui ✓')
      } else {
        setDraft((d) => ({ ...d, foto }))
      }
    } catch (err) {
      setError(err.message)
      if (langsungSimpan) info(err.message)
    }
  }

  const hapusFotoLangsung = async () => {
    try {
      await simpan({ ...profil, foto: '' })
      info('Foto dihapus')
    } catch (err) { info(err.message) }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const wa = draft.wa.replace(/[\s-]/g, '')
    if (draft.nama.trim().length < 3) return setError('Nama minimal 3 huruf.')
    if (wa && !WA_RE.test(wa)) return setError('Nomor WhatsApp tidak valid (contoh: 081234567890).')
    if (draft.tglLahir && new Date(draft.tglLahir) > new Date()) return setError('Tanggal lahir tidak boleh di masa depan.')
    if (draft.alamat.length > 250) return setError('Alamat maksimal 250 karakter.')

    setSaving(true)
    try {
      await simpan({ ...draft, nama: draft.nama.trim(), wa, ortu: draft.ortu.trim(), alamat: draft.alamat.trim(), sekolah: draft.sekolah.trim(), tempatLahir: draft.tempatLahir.trim() })
      setEdit(false)
      info('Data pribadi disimpan ✓')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const kontakKosong = !profil.wa || !profil.alamat || !profil.ortu
  const umur = hitungUmur(profil.tglLahir)

  return (
    <div className="view active bio">
      {/* ===== Kartu profil kiri ===== */}
      <Reveal anim="left" className="profile card">
        <div className="avatar-wrap">
          <Avatar big foto={edit ? draft.foto : profil.foto} nama={edit ? draft.nama : profil.nama} />
          <label className="avatar-edit" title="Ganti foto" aria-label="Ganti foto profil">
            📷
            <input type="file" accept="image/*" hidden onChange={pilihFoto(!edit)} />
          </label>
        </div>
        <h2>{edit ? draft.nama || 'Nama pemain' : profil.nama}</h2>
        <p className="mut">ID: {profil.id}</p>
        <span className="pill ok">● Aktif</span>
        {(edit ? draft.foto : profil.foto) && (
          <p>
            <button type="button" className="linkbtn small" onClick={edit ? () => setDraft((d) => ({ ...d, foto: '' })) : hapusFotoLangsung}>
              Hapus foto
            </button>
          </p>
        )}
        <div className="mini">
          <div><b>{stat.pertemuan}</b><small>Pertemuan</small></div>
          <div><b>{stat.persen === null ? '–' : `${stat.persen}%`}</b><small>Kehadiran</small></div>
        </div>
        {!edit && <button type="button" className="abtn full-btn" onClick={bukaEdit}>✏️ Ubah Data Pribadi</button>}
      </Reveal>

      {/* ===== Kolom kanan ===== */}
      <div className="detail">
        {edit ? (
          <form className="card" onSubmit={submit} noValidate>
            <h3>Ubah Data Pribadi</h3>
            {error && <div className="alert err">{error}</div>}

            <p className="sec-title">Data Pemain</p>
            <label>Nama lengkap
              <input value={draft.nama} onChange={set('nama')} maxLength={80} autoComplete="name" />
            </label>
            <div className="f2">
              <label>Jenis kelamin
                <select value={draft.jk} onChange={set('jk')}>
                  <option value="">Pilih...</option>
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </label>
              <label>Ukuran jersey
                <select value={draft.jersey} onChange={set('jersey')}>
                  <option value="">Pilih...</option>
                  {JERSEY.map((j) => <option key={j}>{j}</option>)}
                </select>
              </label>
            </div>
            <div className="f2">
              <label>Tanggal lahir
                <input type="date" value={draft.tglLahir} onChange={set('tglLahir')} max={new Date().toISOString().slice(0, 10)} />
              </label>
              <label>Tempat lahir
                <input value={draft.tempatLahir} onChange={set('tempatLahir')} maxLength={60} />
              </label>
            </div>
            <label>Asal sekolah
              <input value={draft.sekolah} onChange={set('sekolah')} maxLength={80} />
            </label>

            <p className="sec-title">Kontak &amp; Alamat</p>
            <label>Email (dari akun, tidak bisa diubah)
              <input value={draft.email} readOnly disabled />
            </label>
            <div className="f2">
              <label>No WhatsApp
                <input type="tel" inputMode="tel" value={draft.wa} onChange={set('wa')} placeholder="08xxxxxxxxxx" autoComplete="tel" />
              </label>
              <label>Orang tua / wali
                <input value={draft.ortu} onChange={set('ortu')} maxLength={80} />
              </label>
            </div>
            <label>Alamat
              <textarea rows={3} value={draft.alamat} onChange={set('alamat')} maxLength={250} />
            </label>

            <div className="adm-actions">
              <button type="submit" className="abtn" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              <button type="button" className="abtn ghost" onClick={() => setEdit(false)} disabled={saving}>Batal</button>
            </div>
          </form>
        ) : (
          <>
            {kontakKosong && (
              <Reveal anim="right" className="card lengkapi">
                <div>
                  <b>Lengkapi data dirimu</b>
                  <p className="mut">No WhatsApp, orang tua/wali, dan alamat belum diisi.</p>
                </div>
                <button type="button" className="abtn" onClick={bukaEdit}>Lengkapi Sekarang</button>
              </Reveal>
            )}
            <Reveal anim="right" className="card">
              <h3>Data Pemain</h3>
              <dl className="dl">
                <Item label="Jenis Kelamin" value={profil.jk} />
                <Item label="Tanggal Lahir" value={fmtTanggal(profil.tglLahir)} />
                <Item label="Umur" value={umur} />
                <Item label="Tempat Lahir" value={profil.tempatLahir} />
                <Item label="Asal Sekolah" value={profil.sekolah} />
                <Item label="Ukuran Jersey" value={profil.jersey} />
              </dl>
            </Reveal>
            <Reveal anim="right" delay={120} className="card">
              <h3>Kontak &amp; Alamat</h3>
              <dl className="dl">
                <Item label="Email" value={profil.email} />
                <Item label="No WhatsApp" value={profil.wa} />
                <Item label="Orang Tua/Wali" value={profil.ortu} />
                <Item label="Alamat" value={profil.alamat} full />
              </dl>
            </Reveal>
          </>
        )}
      </div>

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </div>
  )
}
