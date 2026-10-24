import { loginDemo } from './db.js'
// Jika VITE_API_URL kosong -> mode DEMO (berhasil tanpa server).
const API_URL = import.meta.env.VITE_API_URL

async function post(path, body) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 600))
    // Mode demo: akun dibuat otomatis saat login; email berawalan "owner"/"admin" menjadi owner (hanya uji coba)
    if (path === '/login') {
      const u = loginDemo(String(body?.email || ''), body?.peran)
      return { ok: true, demo: true, token: 'demo', role: u.role, user: { email: u.email, nama: u.nama, status: u.status } }
    }
    return { ok: true, demo: true }
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Terjadi kesalahan, coba lagi.')
  }
  return res.json()
}

// Sesuaikan endpoint dengan backend Anda
export const registerPlayer = (data) => post('/pendaftaran', data)
export const loginUser = (data) => post('/login', data)
export const confirmPayment = (data) => post('/pembayaran', data)
