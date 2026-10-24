import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { loginUser } from '../services/api.js'
import { homeFor, setSession } from '../utils/auth.js'

// Form login per peran. Alamat: /login/pemain, /login/owner, /login/pelatih
const PERAN = {
  pemain: {
    role: 'player', judul: 'Login Pemain', sub: 'Masuk sebagai pemain atau orang tua.',
    daftar: { to: '/daftar-akun', teks: 'Belum punya akun?', aksi: 'Buat akun' },
  },
  pelatih: {
    role: 'pelatih', judul: 'Login Pelatih', sub: 'Masuk ke portal pelatih.',
    daftar: { to: '/daftar-akun?peran=pelatih', teks: 'Pelatih baru?', aksi: 'Daftar sebagai pelatih' },
  },
  owner: {
    role: 'owner', judul: 'Login Owner', sub: 'Khusus pemilik akademi. Akun owner tidak bisa didaftarkan sendiri.',
    daftar: null,
  },
}
const NAMA_ROLE = { player: 'pemain', pelatih: 'pelatih', owner: 'owner' }

export default function Login() {
  const { peran } = useParams()
  const cfg = PERAN[peran]
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { setError('') }, [peran])
  if (!cfg) return <Navigate to="/login" replace />

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser({ ...form, peran: cfg.role })
      const role = res.role === 'admin' ? 'owner' : res.role || 'player'
      // jangan biarkan akun peran lain masuk lewat pintu yang salah
      if (role !== cfg.role) throw new Error(`Akun ini terdaftar sebagai ${NAMA_ROLE[role]}. Pilih portal ${NAMA_ROLE[role]} untuk masuk.`)
      setSession(res.token, role, res.user || { email: form.email.trim().toLowerCase(), nama: '' })
      nav(homeFor(role))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <Reveal as="form" key={peran} anim="zoom" className="card" onSubmit={submit}>
        <h2>{cfg.judul}</h2>
        <p className="sub">{cfg.sub}</p>
        {peran === 'owner' && !import.meta.env.VITE_API_URL && (
          <div className="alert ok">Mode demo: masuk dengan email berawalan <b>owner</b> (contoh <b>owner@demo.id</b>), password bebas.</div>
        )}
        <label>Email
          <input type="email" required value={form.email} placeholder="nama@email.com" autoComplete="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>Password
          <input type="password" required value={form.password} placeholder="••••••••" autoComplete="current-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <div className="alert err">{error}</div>}
        <button className="btn big" type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</button>
        {cfg.daftar && <p className="foot">{cfg.daftar.teks} <Link to={cfg.daftar.to}>{cfg.daftar.aksi}</Link></p>}
        <p className="foot"><Link to="/login">← Pilih portal lain</Link></p>
      </Reveal>
    </div>
  )
}
