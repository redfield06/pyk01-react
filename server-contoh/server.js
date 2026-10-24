// Contoh backend autentikasi + OTP Gmail untuk futsal-react.
// PENTING: penyimpanan di sini hanya memori (hilang saat server restart).
// Untuk produksi, ganti `users` dan `otps` dengan database (MySQL, PostgreSQL, MongoDB, Redis, dll).
import 'dotenv/config'
import crypto from 'node:crypto'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const {
  PORT = 3001, FRONTEND_URL = 'http://localhost:5173',
  GMAIL_USER, GMAIL_APP_PASSWORD, JWT_SECRET, ADMIN_EMAILS = '',
} = process.env

if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !JWT_SECRET) {
  console.error('Isi GMAIL_USER, GMAIL_APP_PASSWORD, dan JWT_SECRET di file .env')
  process.exit(1)
}

const OTP_TTL = 5 * 60 * 1000 // kode berlaku 5 menit
const RESEND_WAIT = 60 * 1000 // jeda minimal kirim ulang
const MAX_TRIES = 5 // maksimal salah input per kode
const GMAIL_RE = /^[a-z0-9._%+-]+@gmail\.com$/i
const admins = ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)

const users = new Map() // email -> { nama, hash, role }
const otps = new Map() // email -> { hash, exp, tries, last }

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
})

const sha = (v) => crypto.createHash('sha256').update(v).digest()
const sama = (a, b) => crypto.timingSafeEqual(a, b)
const buatKode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const gagal = (res, code, message) => res.status(code).json({ message })

const app = express()
app.use(cors({ origin: FRONTEND_URL }))
const jsonKecil = express.json({ limit: '10kb' })
const jsonBesar = express.json({ limit: '400kb' }) // untuk /profil (memuat foto)

// batasi per IP: 10 permintaan / 10 menit untuk endpoint OTP, 20 untuk login
const limitOtp = rateLimit({ windowMs: 10 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' } })
const limitLogin = rateLimit({ windowMs: 10 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { message: 'Terlalu banyak percobaan login. Coba lagi nanti.' } })

app.post('/auth/otp/request', limitOtp, jsonKecil, async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const nama = String(req.body.nama || '').trim().slice(0, 80)

  if (!GMAIL_RE.test(email)) return gagal(res, 400, 'Gunakan alamat Gmail pribadi (contoh: nama@gmail.com).')
  if (users.has(email)) return gagal(res, 409, 'Email ini sudah terdaftar. Silakan login.')

  const lama = otps.get(email)
  if (lama && Date.now() - lama.last < RESEND_WAIT) {
    const tunggu = Math.ceil((RESEND_WAIT - (Date.now() - lama.last)) / 1000)
    return gagal(res, 429, `Tunggu ${tunggu} detik sebelum meminta kode lagi.`)
  }

  const kode = buatKode()
  otps.set(email, { hash: sha(kode), exp: Date.now() + OTP_TTL, tries: 0, last: Date.now() })

  try {
    await transporter.sendMail({
      from: `"ArenaFutsal Academy" <${GMAIL_USER}>`,
      to: email,
      subject: `Kode verifikasi ArenaFutsal: ${kode}`,
      text: `Halo ${nama || ''},\n\nKode verifikasi kamu: ${kode}\nBerlaku 5 menit. Jangan bagikan kode ini ke siapa pun.\n\nJika kamu tidak merasa mendaftar, abaikan email ini.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:420px">
        <h2>Verifikasi Email</h2>
        <p>Halo ${esc(nama)}, masukkan kode berikut untuk menyelesaikan pendaftaran:</p>
        <p style="font-size:34px;font-weight:700;letter-spacing:8px;margin:18px 0">${kode}</p>
        <p>Kode berlaku <b>5 menit</b>. Jangan bagikan kode ini ke siapa pun.</p>
        <p style="color:#888;font-size:13px">Jika kamu tidak merasa mendaftar, abaikan email ini.</p></div>`,
    })
  } catch (err) {
    otps.delete(email)
    console.error('Gagal kirim email:', err.message)
    return gagal(res, 502, 'Email gagal dikirim. Coba lagi sebentar lagi.')
  }
  res.json({ ok: true, expiresIn: OTP_TTL / 1000 })
})

app.post('/auth/otp/verify', limitOtp, jsonKecil, async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const code = String(req.body.code || '')
  const nama = String(req.body.nama || '').trim().slice(0, 80)
  const password = String(req.body.password || '')

  if (!GMAIL_RE.test(email) || !/^\d{6}$/.test(code)) return gagal(res, 400, 'Data tidak valid.')
  if (nama.length < 3) return gagal(res, 400, 'Nama lengkap minimal 3 huruf.')
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))
    return gagal(res, 400, 'Password minimal 8 karakter dan mengandung huruf serta angka.')
  if (users.has(email)) return gagal(res, 409, 'Email ini sudah terdaftar. Silakan login.')

  const o = otps.get(email)
  if (!o) return gagal(res, 400, 'Kode belum diminta. Kirim kode terlebih dahulu.')
  if (Date.now() > o.exp) { otps.delete(email); return gagal(res, 400, 'Kode sudah kedaluwarsa. Kirim ulang kode.') }
  if (o.tries >= MAX_TRIES) { otps.delete(email); return gagal(res, 429, 'Terlalu banyak percobaan salah. Kirim ulang kode baru.') }

  if (!sama(o.hash, sha(code))) {
    o.tries += 1
    return gagal(res, 400, `Kode salah. Sisa percobaan: ${MAX_TRIES - o.tries}.`)
  }

  otps.delete(email) // kode hanya bisa dipakai sekali
  const role = admins.includes(email) ? 'admin' : 'player'
  users.set(email, { nama, hash: await bcrypt.hash(password, 10), role })
  const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ ok: true, token, role, user: { email, nama } })
})

app.post('/login', limitLogin, jsonKecil, async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const u = users.get(email)
  // bandingkan hash walau user tidak ada, supaya waktu respons tidak membocorkan email terdaftar
  const ok = await bcrypt.compare(String(req.body.password || ''), u?.hash || '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi')
  if (!u || !ok) return gagal(res, 401, 'Email atau password salah.')
  const token = jwt.sign({ email, role: u.role }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ ok: true, token, role: u.role, user: { email, nama: u.nama } })
})


/* ---------- Profil pemain ---------- */
const profiles = new Map() // email -> profil (ganti dengan database)
let urut = 0

function wajibLogin(req, res, next) {
  const h = req.headers.authorization || ''
  try {
    req.user = jwt.verify(h.replace(/^Bearer /, ''), JWT_SECRET)
    next()
  } catch {
    gagal(res, 401, 'Sesi berakhir, silakan login lagi.')
  }
}

const profilAwal = (email) => ({
  id: `AF-${new Date().getFullYear()}-${String(++urut).padStart(3, '0')}`,
  nama: users.get(email)?.nama || '', email,
  jk: '', tglLahir: '', tempatLahir: '', sekolah: '', jersey: '',
  wa: '', ortu: '', alamat: '', foto: '', pertemuan: 0, hadir: null,
})

app.get('/profil', wajibLogin, (req, res) => {
  const { email } = req.user
  if (!profiles.has(email)) profiles.set(email, profilAwal(email))
  res.json(profiles.get(email))
})

app.put('/profil', wajibLogin, jsonBesar, (req, res) => {
  const { email } = req.user
  const b = req.body || {}
  const teks = (v, max) => String(v ?? '').trim().slice(0, max)
  const wa = String(b.wa ?? '').replace(/[\s-]/g, '')
  const foto = String(b.foto ?? '')

  if (teks(b.nama, 80).length < 3) return gagal(res, 400, 'Nama minimal 3 huruf.')
  if (wa && !/^(\+62|62|0)8[0-9]{7,12}$/.test(wa)) return gagal(res, 400, 'Nomor WhatsApp tidak valid.')
  if (b.tglLahir && (isNaN(new Date(b.tglLahir)) || new Date(b.tglLahir) > new Date())) return gagal(res, 400, 'Tanggal lahir tidak valid.')
  // hanya terima foto JPEG/PNG berbentuk data URL dan tidak terlalu besar
  if (foto && (!/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(foto) || foto.length > 300_000))
    return gagal(res, 400, 'Foto tidak valid atau terlalu besar.')

  const lama = profiles.get(email) || profilAwal(email)
  const baru = {
    ...lama,
    nama: teks(b.nama, 80), jk: ['Laki-laki', 'Perempuan'].includes(b.jk) ? b.jk : '',
    tglLahir: teks(b.tglLahir, 10), tempatLahir: teks(b.tempatLahir, 60), sekolah: teks(b.sekolah, 80),
    jersey: ['XS', 'S', 'M', 'L', 'XL'].includes(b.jersey) ? b.jersey : '',
    wa, ortu: teks(b.ortu, 80), alamat: teks(b.alamat, 250), foto,
  }
  profiles.set(email, baru)
  const u = users.get(email)
  if (u) u.nama = baru.nama
  res.json(baru)
})

// bersihkan kode kedaluwarsa tiap 10 menit
setInterval(() => { for (const [e, o] of otps) if (Date.now() > o.exp) otps.delete(e) }, 10 * 60 * 1000).unref()

app.listen(PORT, () => console.log(`Server auth berjalan di http://localhost:${PORT}`))
