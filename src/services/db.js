import { useEffect, useState } from 'react'

/* Penyimpanan data portal (pelatih & owner) - MODE DEMO.
   Semua data disimpan di localStorage browser ini, sehingga pelatih, owner, dan pemain
   yang membuka situs di browser yang sama saling melihat data yang sama.
   Untuk dipakai sungguhan, ganti isi file ini dengan pemanggilan ke backend (REST API)
   dengan nama fungsi yang sama. */

const P = 'af_db_'
const listeners = new Set()
const notify = () => listeners.forEach((f) => f())
export const subscribe = (f) => { listeners.add(f); return () => listeners.delete(f) }
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith(P)) notify() }) // sinkron antar tab
}

const baca = (k, fb) => {
  try { const r = localStorage.getItem(P + k); if (r !== null) return JSON.parse(r) } catch { /* abaikan */ }
  return fb
}
const tulisRaw = (k, v) => {
  try { localStorage.setItem(P + k, JSON.stringify(v)) } catch { throw new Error('Penyimpanan browser penuh.') }
}
const tulis = (k, v) => { tulisRaw(k, v); notify() }
const uid = (p) => p + Math.random().toString(36).slice(2, 8)

export const iso = (d = new Date()) => d.toLocaleDateString('sv-SE') // YYYY-MM-DD (waktu lokal)
export const bulanIni = () => iso().slice(0, 7)
export const geser = (hari) => { const d = new Date(); d.setDate(d.getDate() + hari); return iso(d) }
export const bulanLalu = (n = 1) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - n); return iso(d).slice(0, 7) }
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')

/* ---------- Data awal (contoh) ---------- */
function seed() {
  const now = new Date().toISOString()
  const kelas = [
    { id: 'k1', nama: 'U-10', usia: '8-10 tahun', pelatih: 'sari.pelatih@demo.id' },
    { id: 'k2', nama: 'U-13', usia: '11-13 tahun', pelatih: 'budi.pelatih@demo.id' },
    { id: 'k3', nama: 'U-16', usia: '14-16 tahun', pelatih: '' },
  ]
  const pelatih = [
    { nama: 'Sari Wulandari', email: 'sari.pelatih@demo.id', status: 'aktif', lisensi: 'Lisensi D AFC', wa: '081234560001' },
    { nama: 'Budi Santoso', email: 'budi.pelatih@demo.id', status: 'aktif', lisensi: 'Lisensi C AFC', wa: '081234560002' },
    { nama: 'Dedi Kurniawan', email: 'dedi.pelatih@demo.id', status: 'menunggu', lisensi: 'Lisensi D Nasional', wa: '081234560003' },
  ].map((p) => ({ ...p, role: 'pelatih', alasan: '', kelasId: '', dibuat: now }))
  const nama = ['Aditya Nugraha', 'Bima Saputra', 'Farel Ramadhan', 'Gilang Mahendra', 'Kevin Alamsyah', 'Naufal Hakim', 'Raka Wijaya', 'Rizky Pratama', 'Satria Putra', 'Zidane Akbar']
  const pemain = nama.map((n, i) => ({
    nama: n, email: `${slug(n)}@demo.id`, role: 'player', status: i === 9 ? 'baru' : 'aktif', alasan: '', lisensi: '',
    wa: `08129990${String(i).padStart(4, '0')}`, kelasId: i < 4 ? 'k1' : i < 8 ? 'k2' : 'k3', dibuat: now,
  }))
  const users = [...pelatih, ...pemain]

  const judul = ['Teknik Dasar', 'Taktik & Posisi', 'Game Internal']
  const sesi = []
  const absen = {}
  ;['k1', 'k2'].forEach((k, ki) => {
    ;[-9, -6, -3, 2, 5, 9].forEach((off, i) => {
      const pertandingan = k === 'k2' && off === 5
      const s = {
        id: `s${ki}${i}`, kelasId: k, tipe: pertandingan ? 'pertandingan' : 'latihan',
        judul: pertandingan ? 'Pertandingan vs Garuda FC' : judul[i % 3], tanggal: geser(off),
        mulai: pertandingan ? '09:00' : '16:00', selesai: pertandingan ? '10:30' : '17:30',
        lokasi: ki ? 'Lapangan B' : 'Lapangan A', oleh: k === 'k1' ? 'sari.pelatih@demo.id' : 'budi.pelatih@demo.id',
      }
      sesi.push(s)
      if (off < 0) {
        absen[s.id] = {}
        pemain.filter((p) => p.kelasId === k).forEach((p, j) => {
          absen[s.id][p.email] = (i + j) % 7 === 0 ? 'A' : (i + j) % 5 === 0 ? 'I' : (i * 2 + j) % 9 === 0 ? 'S' : 'H'
        })
      }
    })
  })

  const nilai = pemain.filter((p) => p.kelasId === 'k2').map((p, j) => ({
    id: uid('n'), pemainEmail: p.email, periode: bulanLalu(), teknik: 6 + (j % 3), fisik: 7 + (j % 2), taktik: 5 + (j % 4), disiplin: 8 - (j % 2),
    catatan: 'Perkembangan baik, tingkatkan konsistensi umpan pendek.', oleh: 'budi.pelatih@demo.id', tgl: iso(),
  }))

  const info = [
    { id: uid('i'), tag: 'Penting', judul: 'Latihan dipindah ke Lapangan B', isi: 'Mulai pekan depan, sesi Rabu berpindah ke Lapangan B karena renovasi.', target: 'semua', untuk: 'semua', oleh: 'owner', namaOleh: 'Owner', tgl: geser(-6) },
    { id: uid('i'), tag: 'Info', judul: 'Pembagian jersey baru', isi: 'Jersey akan dibagikan Sabtu ini sebelum latihan dimulai.', target: 'semua', untuk: 'semua', oleh: 'owner', namaOleh: 'Owner', tgl: geser(-9) },
    { id: uid('i'), tag: 'Event', judul: 'Turnamen antar akademi', isi: 'Pendaftaran tim dibuka sampai akhir bulan. Hubungi pelatih.', target: 'k2', untuk: 'semua', oleh: 'budi.pelatih@demo.id', namaOleh: 'Budi Santoso', tgl: geser(-11) },
  ]

  const tagihan = []
  ;[bulanLalu(), bulanIni()].forEach((b, bi) => {
    pemain.filter((p) => p.status === 'aktif').forEach((p, j) => {
      const lunas = bi === 0 ? j !== 3 : j % 2 === 0
      tagihan.push({ id: uid('t'), pemainEmail: p.email, bulan: b, jumlah: 250000, status: lunas ? 'lunas' : 'belum', metode: lunas ? (j % 2 ? 'Tunai' : 'Transfer') : '', tglBayar: lunas ? iso() : '' })
    })
  })

  tulisRaw('kelas', kelas); tulisRaw('users', users); tulisRaw('sesi', sesi); tulisRaw('absensi', absen)
  tulisRaw('nilai', nilai); tulisRaw('pengumuman', info); tulisRaw('tagihan', tagihan)
  tulisRaw('setelan', { harga: 250000, bank: 'BCA', nomor: '1234567890', atasNama: 'ArenaFutsal Academy' })
  tulisRaw('seeded', 1)
}

function pastikan() {
  try { if (localStorage.getItem(P + 'seeded') === null) seed() } catch { /* localStorage tidak tersedia */ }
}
pastikan()

export function resetDemo() {
  Object.keys(localStorage).filter((k) => k.startsWith(P) || k.startsWith('af_info_seen:')).forEach((k) => localStorage.removeItem(k))
  seed()
  notify()
}

/* ---------- Akun ---------- */
export const listAkun = () => baca('users', [])
export const ambilAkun = (email) => listAkun().find((u) => u.email === String(email || '').toLowerCase()) || null
const ubahAkun = (email, patch) => {
  const l = listAkun()
  const i = l.findIndex((u) => u.email === email)
  if (i < 0) throw new Error('Akun tidak ditemukan.')
  l[i] = { ...l[i], ...patch }
  tulis('users', l)
  return l[i]
}

export function daftarAkun({ email, nama, role = 'player', lisensi = '', wa = '' }) {
  email = email.trim().toLowerCase()
  if (ambilAkun(email)) throw new Error('Email ini sudah terdaftar. Silakan login.')
  const u = {
    email, nama, role, wa, lisensi, kelasId: '', alasan: '', dibuat: new Date().toISOString(),
    status: role === 'pelatih' ? 'menunggu' : role === 'owner' ? 'aktif' : 'baru',
  }
  tulis('users', [...listAkun(), u])
  return u
}

// Login mode demo. peran = pintu login yang dipilih ('player' | 'pelatih' | 'owner').
// - pemain: akun yang belum ada dibuat otomatis (demo)
// - pelatih: harus sudah mendaftar
// - owner: hanya email berawalan "owner"/"admin" (demo)
const NAMA_ROLE = { player: 'pemain', pelatih: 'pelatih', owner: 'owner' }
export function loginDemo(email, peran) {
  email = email.trim().toLowerCase()
  const ada = ambilAkun(email)
  if (ada) {
    if (peran && ada.role !== peran) throw new Error(`Akun ini terdaftar sebagai ${NAMA_ROLE[ada.role]}. Pilih portal ${NAMA_ROLE[ada.role]} untuk masuk.`)
    return ada
  }
  if (peran === 'pelatih') throw new Error('Akun pelatih belum terdaftar. Silakan daftar sebagai pelatih terlebih dahulu.')
  const prefixOwner = /^(owner|admin)/.test(email)
  if (peran === 'owner' && !prefixOwner) throw new Error('Email ini bukan akun owner.')
  const depan = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  const nama = depan.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Pemain'
  const role = peran || (prefixOwner ? 'owner' : 'player')
  return daftarAkun({ email, nama, role })
}

// dipakai saat profil diubah, supaya nama/kontak di daftar owner ikut sama
export function sinkronAkun(email, patch) {
  if (ambilAkun(email)) ubahAkun(String(email).toLowerCase(), patch)
}
export const setStatusAkun = (email, status, alasan = '') => ubahAkun(email, { status, alasan })
export const setKelasPemain = (email, kelasId) => ubahAkun(email, { kelasId })
export const daftarPelatih = () => listAkun().filter((u) => u.role === 'pelatih')
export const daftarPemain = () => listAkun().filter((u) => u.role === 'player')
export const namaDari = (email) => ambilAkun(email)?.nama || email

/* ---------- Kelas ---------- */
export const listKelas = () => baca('kelas', [])
export const ambilKelas = (id) => listKelas().find((k) => k.id === id) || null
export const kelasPelatih = (email) => listKelas().filter((k) => k.pelatih === email)
export const pemainDiKelas = (kelasId) => daftarPemain().filter((p) => p.kelasId === kelasId && p.status !== 'nonaktif')

export function simpanKelas(k) {
  const l = listKelas()
  if (!k.nama.trim()) throw new Error('Nama kelas wajib diisi.')
  if (k.id) {
    const i = l.findIndex((x) => x.id === k.id)
    if (i >= 0) l[i] = { ...l[i], ...k }
  } else l.push({ ...k, id: uid('k') })
  tulis('kelas', l)
}
export function hapusKelas(id) {
  tulis('kelas', listKelas().filter((k) => k.id !== id))
  tulis('users', listAkun().map((u) => (u.kelasId === id ? { ...u, kelasId: '' } : u)))
}

/* ---------- Jadwal ---------- */
const urutSesi = (a, b) => (a.tanggal + a.mulai).localeCompare(b.tanggal + b.mulai)
export const listSesi = (kelasIds) => baca('sesi', []).filter((s) => !kelasIds || kelasIds.includes(s.kelasId)).sort(urutSesi)
export function simpanSesi(s) {
  if (!s.judul.trim() || !s.kelasId || !s.tanggal) throw new Error('Judul, kelas, dan tanggal wajib diisi.')
  const l = baca('sesi', [])
  if (s.id) {
    const i = l.findIndex((x) => x.id === s.id)
    if (i >= 0) l[i] = { ...l[i], ...s }
  } else l.push({ ...s, id: uid('s') })
  tulis('sesi', l)
}
export function hapusSesi(id) {
  tulis('sesi', baca('sesi', []).filter((s) => s.id !== id))
  const a = baca('absensi', {})
  delete a[id]
  tulis('absensi', a)
}

/* ---------- Absensi ---------- */
export const getAbsensi = (sesiId) => baca('absensi', {})[sesiId] || {}
export function simpanAbsensi(sesiId, peta) {
  const a = baca('absensi', {})
  a[sesiId] = peta
  tulis('absensi', a)
}
const sudahAbsen = (id, a) => Object.keys(a[id] || {}).length > 0

// kehadiran satu pemain: dihitung dari sesi kelasnya yang sudah diabsen
export function statPemain(email) {
  const u = ambilAkun(email)
  if (!u?.kelasId) return { pertemuan: 0, hadir: 0, persen: null }
  const a = baca('absensi', {})
  const sesi = listSesi([u.kelasId]).filter((s) => sudahAbsen(s.id, a))
  const hadir = sesi.filter((s) => a[s.id][email] === 'H').length
  return { pertemuan: sesi.length, hadir, persen: sesi.length ? Math.round((hadir / sesi.length) * 100) : null }
}
export function rataKehadiran(kelasId) {
  const ps = kelasId ? pemainDiKelas(kelasId) : daftarPemain().filter((p) => p.kelasId)
  const hasil = ps.map((p) => statPemain(p.email).persen).filter((x) => x !== null)
  return hasil.length ? Math.round(hasil.reduce((s, x) => s + x, 0) / hasil.length) : null
}

/* ---------- Penilaian ---------- */
export const listNilai = (pemainEmail) => baca('nilai', []).filter((n) => !pemainEmail || n.pemainEmail === pemainEmail).sort((a, b) => b.periode.localeCompare(a.periode))
export function simpanNilai(n) {
  const l = baca('nilai', [])
  const i = l.findIndex((x) => x.pemainEmail === n.pemainEmail && x.periode === n.periode)
  const item = { ...n, id: i >= 0 ? l[i].id : uid('n'), tgl: iso() }
  if (i >= 0) l[i] = item
  else l.push(item)
  tulis('nilai', l)
}

/* ---------- Pengumuman ---------- */
export const listInfo = () => baca('pengumuman', []).sort((a, b) => b.tgl.localeCompare(a.tgl))
export function buatInfo(i) {
  if (!i.judul.trim() || !i.isi.trim()) throw new Error('Judul dan isi pengumuman wajib diisi.')
  tulis('pengumuman', [{ ...i, id: uid('i'), tgl: iso() }, ...baca('pengumuman', [])])
}
export const hapusInfo = (id) => tulis('pengumuman', baca('pengumuman', []).filter((i) => i.id !== id))
export function infoUntuk(email) {
  const k = ambilAkun(email)?.kelasId
  return listInfo().filter((i) => i.target === 'semua' || (k && i.target === k))
}
const seenKey = (email) => `af_info_seen:${email}`
export const jumlahInfoBaru = (email) => {
  const seen = localStorage.getItem(seenKey(email)) || ''
  return infoUntuk(email).filter((i) => i.tgl > seen).length
}
export const tandaiInfoDibaca = (email) => {
  localStorage.setItem(seenKey(email), iso())
  notify()
}

/* ---------- Keuangan ---------- */
export const getSetelan = () => baca('setelan', { harga: 250000, bank: '', nomor: '', atasNama: '' })
export const simpanSetelan = (s) => tulis('setelan', s)
export const listTagihan = () => baca('tagihan', [])

export function buatTagihan(bulan) {
  const l = listTagihan()
  const harga = Number(getSetelan().harga) || 0
  const baru = daftarPemain()
    .filter((p) => p.status === 'aktif' && !l.some((t) => t.pemainEmail === p.email && t.bulan === bulan))
    .map((p) => ({ id: uid('t'), pemainEmail: p.email, bulan, jumlah: harga, status: 'belum', metode: '', tglBayar: '' }))
  if (baru.length) tulis('tagihan', [...l, ...baru])
  return baru.length
}
export function setLunas(id, lunas, metode = 'Transfer') {
  tulis('tagihan', listTagihan().map((t) => (t.id === id
    ? { ...t, status: lunas ? 'lunas' : 'belum', metode: lunas ? metode : '', tglBayar: lunas ? iso() : '' }
    : t)))
}

/* ---------- Hook React: render ulang saat data berubah ---------- */
export function useDb() {
  const [, set] = useState(0)
  useEffect(() => subscribe(() => set((n) => n + 1)), [])
}
