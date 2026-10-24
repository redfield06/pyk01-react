/* Pendaftaran akun dengan verifikasi OTP lewat Gmail.
   - VITE_API_URL kosong -> mode DEMO: kode dibuat di browser dan DITAMPILKAN di layar
     (email tidak bisa dikirim tanpa server).
   - VITE_API_URL terisi -> memakai backend:
       POST /auth/otp/request  { email, nama }
            -> { expiresIn: 300 }   (kirim kode 6 angka ke email)
       POST /auth/otp/verify   { email, code, nama, password }
            -> { token, role }      (buat akun + login)
   Lihat folder server-contoh/ untuk contoh backend lengkap. */

import { daftarAkun } from './db.js'

const API_URL = import.meta.env.VITE_API_URL
const DEMO_KEY = 'af_demo_otp'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export const OTP_LENGTH = 6
export const GMAIL_RE = /^[a-z0-9._%+-]+@gmail\.com$/i
export const normalizeEmail = (e) => String(e).trim().toLowerCase()

async function post(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan, coba lagi.')
  return data
}

export async function requestOtp({ email, nama }) {
  email = normalizeEmail(email)
  if (!GMAIL_RE.test(email)) throw new Error('Gunakan alamat Gmail pribadi (contoh: nama@gmail.com).')
  if (API_URL) return post('/auth/otp/request', { email, nama })

  await wait(700)
  const code = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000))
  sessionStorage.setItem(DEMO_KEY, JSON.stringify({ email, code, exp: Date.now() + 300000, tries: 0 }))
  return { ok: true, demo: true, demoCode: code, expiresIn: 300 }
}

export async function verifyOtp({ email, code, nama, password, peran = 'player', lisensi = '', wa = '' }) {
  email = normalizeEmail(email)
  if (!/^\d{6}$/.test(code)) throw new Error('Masukkan 6 angka kode OTP.')
  if (API_URL) return post('/auth/otp/verify', { email, code, nama, password, peran, lisensi, wa })

  await wait(600)
  let d
  try { d = JSON.parse(sessionStorage.getItem(DEMO_KEY)) } catch { d = null }
  if (!d || d.email !== email) throw new Error('Kode belum diminta. Kirim kode terlebih dahulu.')
  if (Date.now() > d.exp) throw new Error('Kode sudah kedaluwarsa. Kirim ulang kode.')
  if (d.tries >= 5) throw new Error('Terlalu banyak percobaan salah. Kirim ulang kode baru.')
  if (d.code !== code) {
    d.tries += 1
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(d))
    throw new Error(`Kode salah. Sisa percobaan: ${5 - d.tries}.`)
  }
  sessionStorage.removeItem(DEMO_KEY)
  // mode demo: akun dicatat di penyimpanan portal (pelatih berstatus "menunggu" sampai disetujui owner)
  const role = peran === 'pelatih' ? 'pelatih' : 'player'
  const u = daftarAkun({ email, nama, role, lisensi, wa })
  return { ok: true, demo: true, token: 'demo', role, user: { email, nama, status: u.status } }
}
