import { getToken, getUser, updateUser } from '../utils/auth.js'
import { sinkronAkun } from './db.js'

/* Profil pemain per akun.
   - VITE_API_URL kosong -> disimpan di localStorage (mode DEMO, hanya di browser ini).
   - VITE_API_URL terisi -> backend:
       GET /profil   -> profil akun yang login
       PUT /profil   -> simpan profil
     (butuh header Authorization: Bearer <token>). localStorage tetap dipakai sebagai cache. */

const API_URL = import.meta.env.VITE_API_URL
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const kunci = () => `af_profil:${(getUser()?.email || 'tamu').toLowerCase()}`
const idBaru = () => `AF-${new Date().getFullYear()}-${String(100 + Math.floor(Math.random() * 900))}`

const dasar = () => {
  const u = getUser() || {}
  return {
    id: idBaru(), nama: u.nama || 'Pemain', email: u.email || '',
    jk: '', tglLahir: '', tempatLahir: '', sekolah: '', jersey: '',
    wa: '', ortu: '', alamat: '', foto: '', lisensi: '',
    pertemuan: 0, hadir: null,
  }
}

function tulis(p) {
  try {
    localStorage.setItem(kunci(), JSON.stringify(p))
  } catch {
    throw new Error('Penyimpanan browser penuh. Coba foto yang lebih kecil.')
  }
}

// Baca profil dari cache; kalau belum ada, buat profil awal dari data akun.
export function profilCepat() {
  try {
    const raw = localStorage.getItem(kunci())
    if (raw) return { ...dasar(), ...JSON.parse(raw) }
  } catch { /* cache rusak -> buat baru */ }
  const p = dasar()
  try { tulis(p) } catch { /* abaikan */ }
  return p
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan, coba lagi.')
  return data
}

export async function muatProfil() {
  if (!API_URL) {
    await wait(120)
    return profilCepat()
  }
  try {
    const p = { ...profilCepat(), ...(await request('/profil')) }
    try { tulis(p) } catch { /* abaikan */ }
    return p
  } catch {
    return profilCepat() // server tidak terjangkau -> pakai cache
  }
}

const FIELD = ['nama', 'jk', 'tglLahir', 'tempatLahir', 'sekolah', 'jersey', 'wa', 'ortu', 'alamat', 'foto', 'lisensi']

export async function simpanProfil(data) {
  const kirim = Object.fromEntries(FIELD.map((k) => [k, data[k] ?? '']))
  let baru
  if (API_URL) {
    baru = { ...profilCepat(), ...(await request('/profil', { method: 'PUT', body: JSON.stringify(kirim) })) }
  } else {
    await wait(300)
    baru = { ...profilCepat(), ...kirim }
  }
  tulis(baru)
  updateUser({ nama: baru.nama }) // nama di header ikut berubah
  sinkronAkun(getUser()?.email, { nama: baru.nama, wa: baru.wa, lisensi: baru.lisensi || '' })
  return baru
}

// Baca profil pemain lain dari cache (dipakai owner untuk melihat detail). Bisa null.
export function profilDari(email) {
  try {
    const raw = localStorage.getItem(`af_profil:${String(email).toLowerCase()}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
