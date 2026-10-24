import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { PROGRAMS } from '../data/config.js'
import { registerPlayer } from '../services/api.js'

const initial = {
  nama: '', jk: 'Laki-laki', tglLahir: '', tempatLahir: '', sekolah: '',
  email: '', wa: '', ortu: '', alamat: '',
  program: PROGRAMS[0].title, jersey: 'M', catatan: '',
}

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const umur = useMemo(() => {
    const d = new Date(form.tglLahir)
    if (!form.tglLahir || isNaN(d)) return ''
    const n = new Date()
    let a = n.getFullYear() - d.getFullYear()
    if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--
    return a >= 0 ? `${a} tahun` : ''
  }, [form.tglLahir])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', msg: '' })
    try {
      await registerPlayer({ ...form, umur })
      // langsung pindah ke halaman pembayaran membawa data pendaftar
      nav('/pembayaran', { state: { nama: form.nama, program: form.program, email: form.email } })
    } catch (err) {
      setStatus({ type: 'err', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w">
      <div className="form">
        <Reveal as="h2" anim="down">Pendaftaran Pemain</Reveal>
        <Reveal as="p" anim="down" delay={100} className="sub">Lengkapi 3 langkah berikut untuk bergabung.</Reveal>
        <Reveal anim="up" className="steps"><div className="on">1 Data Pemain</div><div>2 Pembayaran</div><div>3 Selesai</div></Reveal>

        <form onSubmit={submit}>
          <Reveal anim="left" className="sec">
            <h3><i>1</i>Data Pemain</h3>
            <label>Nama<input name="nama" value={form.nama} onChange={set} required placeholder="Nama lengkap pemain" /></label>
            <div className="row">
              <label>Jenis Kelamin
                <select name="jk" value={form.jk} onChange={set}><option>Laki-laki</option><option>Perempuan</option></select>
              </label>
              <label>Tanggal Lahir<input type="date" name="tglLahir" value={form.tglLahir} onChange={set} required /></label>
              <label>Umur<input value={umur} readOnly placeholder="Terisi otomatis" /></label>
              <label>Tempat Lahir<input name="tempatLahir" value={form.tempatLahir} onChange={set} required placeholder="Kota kelahiran" /></label>
            </div>
            <label>Asal Sekolah<input name="sekolah" value={form.sekolah} onChange={set} required placeholder="Nama sekolah" /></label>
          </Reveal>

          <Reveal anim="right" className="sec">
            <h3><i>2</i>Kontak dan Alamat</h3>
            <div className="row">
              <label>Alamat Email<input type="email" name="email" value={form.email} onChange={set} required placeholder="nama@email.com" /></label>
              <label>No WhatsApp<input type="tel" name="wa" value={form.wa} onChange={set} required placeholder="08xxxxxxxxxx" /></label>
            </div>
            <label>Nama Orang Tua/Wali<input name="ortu" value={form.ortu} onChange={set} required placeholder="Nama orang tua/wali" /></label>
            <label>Alamat Lengkap<textarea name="alamat" rows="3" value={form.alamat} onChange={set} required placeholder="Jalan, kelurahan, kecamatan, kota" /></label>
          </Reveal>

          <Reveal anim="left" className="sec">
            <h3><i>3</i>Program &amp; Perlengkapan</h3>
            <div className="row">
              <label>Program
                <select name="program" value={form.program} onChange={set}>
                  {PROGRAMS.map((p) => <option key={p.title}>{p.title}</option>)}
                </select>
              </label>
              <label>Ukuran Jersey
                <select name="jersey" value={form.jersey} onChange={set}>
                  {['XS', 'S', 'M', 'L', 'XL'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
            <label>Catatan (Opsional)<textarea name="catatan" rows="2" value={form.catatan} onChange={set} placeholder="Alergi, cedera, atau info lain" /></label>
          </Reveal>

          {status.msg && <div className={`alert ${status.type}`}>{status.msg}</div>}
          <Reveal as="button" anim="zoom" className="btn big" type="submit" disabled={loading}>
            {loading ? 'Mengirim...' : 'Lanjut ke Pembayaran'}
          </Reveal>
        </form>
      </div>
    </div>
  )
}