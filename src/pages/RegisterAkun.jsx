import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import CodeSlots from '../components/CodeSlots.jsx'
import { GMAIL_RE, OTP_LENGTH, normalizeEmail, requestOtp, verifyOtp } from '../services/otp.js'
import { homeFor, setSession } from '../utils/auth.js'

const COOLDOWN = 60 // detik sebelum boleh kirim ulang

// ukuran kotak OTP menyesuaikan lebar layar supaya tidak meluber di HP
const ukuranSlot = () => {
  const w = typeof window === 'undefined' ? 1200 : window.innerWidth
  if (w < 400) return { slotSize: 34, gap: 6 }
  if (w < 460) return { slotSize: 40, gap: 6 }
  return { slotSize: 44, gap: 8 }
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function RegisterAkun() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const pelatih = params.get('peran') === 'pelatih'
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ nama: '', email: '', password: '', ulang: '', wa: '', lisensi: '' })
  const [kode, setKode] = useState('')
  const [otpKey, setOtpKey] = useState(0)
  const [status, setStatus] = useState('idle') // status kotak OTP: idle | error | success
  const [ukuran, setUkuran] = useState(ukuranSlot)
  const busy = useRef(false)
  const navTimer = useRef(null)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [demoCode, setDemoCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [kirimLagi, setKirimLagi] = useState(0) // sisa detik cooldown
  const [sisa, setSisa] = useState(0) // sisa detik masa berlaku kode

  // hitung mundur cooldown & masa berlaku kode
  useEffect(() => {
    if (step !== 2) return
    const t = setInterval(() => {
      setKirimLagi((s) => Math.max(0, s - 1))
      setSisa((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [step])

  useEffect(() => {
    const onResize = () => setUkuran(ukuranSlot())
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(navTimer.current)
    }
  }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const kirimKode = async () => {
    const res = await requestOtp({ email: form.email, nama: form.nama })
    setDemoCode(res.demoCode || '')
    setKirimLagi(COOLDOWN)
    setSisa(res.expiresIn || 300)
    setKode('')
    setStatus('idle')
    setOtpKey((k) => k + 1)
  }

  const submitData = async (e) => {
    e.preventDefault()
    setError('')
    const email = normalizeEmail(form.email)
    if (form.nama.trim().length < 3) return setError('Nama lengkap minimal 3 huruf.')
    if (!GMAIL_RE.test(email)) return setError('Gunakan alamat Gmail pribadi (contoh: nama@gmail.com).')
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      return setError('Password minimal 8 karakter dan mengandung huruf serta angka.')
    if (form.password !== form.ulang) return setError('Konfirmasi password tidak sama.')
    if (pelatih && !/^(\+62|62|0)8[0-9]{7,12}$/.test(form.wa.replace(/[\s-]/g, ''))) return setError('Nomor WhatsApp tidak valid (contoh: 081234567890).')

    setLoading(true)
    try {
      await kirimKode()
      setForm((f) => ({ ...f, email }))
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifikasi = async (code) => {
    if (busy.current || status === 'success') return
    setError('')
    if (code.length !== OTP_LENGTH) return setError('Masukkan 6 angka kode OTP.')
    if (sisa === 0) {
      setError('Kode sudah kedaluwarsa. Kirim ulang kode.')
      setStatus('error')
      return
    }
    busy.current = true
    setLoading(true)
    try {
      const res = await verifyOtp({ email: form.email, code, nama: form.nama.trim(), password: form.password, peran: pelatih ? 'pelatih' : 'player', lisensi: form.lisensi.trim(), wa: form.wa.replace(/[\s-]/g, '') })
      setSession(res.token, res.role, res.user || { email: form.email, nama: form.nama.trim() })
      setStatus('success')
      // beri waktu animasi centang sebelum pindah halaman
      navTimer.current = setTimeout(() => nav(homeFor(res.role)), 1100)
    } catch (err) {
      setError(err.message)
      setStatus('error') // kotak terkuras otomatis dan kode dikosongkan
    } finally {
      busy.current = false
      setLoading(false)
    }
  }

  const submitKode = (e) => {
    e.preventDefault()
    verifikasi(kode)
  }

  const ulangi = async () => {
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await kirimKode()
      setInfo('Kode baru sudah dikirim. Kode sebelumnya tidak berlaku lagi.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const gantiEmail = () => {
    setStep(1)
    setError('')
    setInfo('')
    setDemoCode('')
  }

  if (step === 1) {
    return (
      <div className="login akun">
        <Reveal as="form" anim="zoom" className="card" onSubmit={submitData} noValidate>
          <h2>{pelatih ? 'Daftar Pelatih' : 'Buat Akun'}</h2>
          <p className="sub">
            Daftar dengan Gmail pribadimu. Kami akan mengirim kode OTP 6 angka untuk memastikan email itu milikmu.
            {pelatih && ' Setelah itu akunmu menunggu persetujuan owner sebelum portal pelatih terbuka.'}
          </p>
          <label>Nama lengkap
            <input value={form.nama} onChange={set('nama')} autoComplete="name" placeholder="Nama orang tua / pemain" />
          </label>
          <label>Gmail
            <input type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="nama@gmail.com" />
          </label>
          <label>Password
            <input type="password" value={form.password} onChange={set('password')} autoComplete="new-password" placeholder="Minimal 8 karakter, huruf + angka" />
          </label>
          <label>Ulangi password
            <input type="password" value={form.ulang} onChange={set('ulang')} autoComplete="new-password" placeholder="••••••••" />
          </label>
          {pelatih && (
            <>
              <label>No WhatsApp
                <input type="tel" inputMode="tel" value={form.wa} onChange={set('wa')} autoComplete="tel" placeholder="08xxxxxxxxxx" />
              </label>
              <label>Lisensi kepelatihan (opsional)
                <input value={form.lisensi} onChange={set('lisensi')} maxLength={60} placeholder="Contoh: Lisensi D AFC" />
              </label>
            </>
          )}
          {error && <div className="alert err">{error}</div>}
          <button className="btn big" type="submit" disabled={loading}>{loading ? 'Mengirim kode...' : 'Kirim Kode OTP'}</button>
          <p className="foot">Sudah punya akun? <Link to={pelatih ? '/login/pelatih' : '/login/pemain'}>Login</Link></p>
          <p className="foot">
            {pelatih
              ? <Link to="/daftar-akun">Daftar sebagai pemain/orang tua</Link>
              : <Link to="/daftar-akun?peran=pelatih">Daftar sebagai pelatih</Link>}
          </p>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="login akun">
      <Reveal as="form" anim="zoom" className="card" onSubmit={submitKode}>
        <h2>Verifikasi Email</h2>
        <p className="sub">Masukkan 6 angka kode yang dikirim ke <b>{form.email}</b>. Cek juga folder Spam bila belum masuk.</p>

        {demoCode && (
          <div className="alert ok">
            <b>Mode demo:</b> email tidak benar-benar dikirim. Kode kamu: <b className="otp-demo">{demoCode}</b>
          </div>
        )}

        <div className={`otp-box${status === 'error' ? ' err' : ''}${status === 'success' ? ' ok' : ''}`}>
          <CodeSlots
            key={otpKey}
            length={OTP_LENGTH}
            status={status}
            autoFocus
            ariaLabel="Kode OTP 6 angka"
            onChange={(c) => {
              setKode(c)
              if (c) setError('')
              setStatus('idle')
            }}
            onComplete={verifikasi}
            accentColor="var(--ac)"
            inkColor="var(--tx)"
            slotColor="var(--bg2)"
            digitColor="#0b1020"
            dangerColor="#ef4444"
            slotSize={ukuran.slotSize}
            gap={ukuran.gap}
            radius={12}
          />
        </div>

        <p className="otp-timer">
          {sisa > 0 ? <>Kode berlaku <b>{mmss(sisa)}</b></> : <b>Kode kedaluwarsa</b>}
        </p>

        {error && <div className="alert err">{error}</div>}
        {info && <div className="alert ok">{info}</div>}

        <button className="btn big" type="submit" disabled={loading || status === 'success' || kode.length !== OTP_LENGTH}>
          {status === 'success' ? 'Berhasil ✓' : loading ? 'Memproses...' : 'Verifikasi & Buat Akun'}
        </button>

        <p className="foot">
          <button type="button" className="linkbtn" onClick={ulangi} disabled={loading || status === 'success' || kirimLagi > 0}>
            {kirimLagi > 0 ? `Kirim ulang kode (${kirimLagi} dtk)` : 'Kirim ulang kode'}
          </button>
          {' · '}
          <button type="button" className="linkbtn" onClick={gantiEmail} disabled={loading || status === 'success'}>Ganti email</button>
        </p>
      </Reveal>
    </div>
  )
}
