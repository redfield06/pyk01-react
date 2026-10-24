import { useState } from 'react'
import { daftarPelatih, getSetelan, hapusKelas, listKelas, resetDemo, simpanKelas, simpanSetelan } from '../../services/db.js'
import { useToast } from '../../utils/useToast.jsx'

export default function Pengaturan() {
  const [kls, setKls] = useState(() => listKelas())
  const [st, setSt] = useState(() => getSetelan())
  const [error, setError] = useState('')
  const [toast, info] = useToast()
  const pelatih = daftarPelatih().filter((p) => p.status === 'aktif')

  const ubahKelas = (i, k) => (e) => setKls((l) => l.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))
  const tambah = () => setKls((l) => [...l, { id: '', nama: '', usia: '', pelatih: '' }])

  const simpanSemuaKelas = () => {
    setError('')
    try {
      kls.forEach((k) => simpanKelas({ ...k, nama: k.nama.trim() }))
      setKls(listKelas())
      info('Kelas disimpan ✓')
    } catch (err) { setError(err.message) }
  }
  const hapus = (i) => {
    const k = kls[i]
    if (!k.id) return setKls((l) => l.filter((_, j) => j !== i))
    if (window.confirm(`Hapus kelas ${k.nama}? Pemain di kelas ini jadi belum punya kelas.`)) {
      hapusKelas(k.id)
      setKls(listKelas())
      info('Kelas dihapus')
    }
  }

  const simpanHarga = (e) => {
    e.preventDefault()
    const harga = Number(st.harga)
    if (!(harga >= 0)) return info('Harga tidak valid')
    simpanSetelan({ ...st, harga })
    info('Harga dan rekening disimpan ✓')
  }

  return (
    <div className="view active adm">
      <div className="card">
        <h3>Kelas / kelompok usia</h3>
        <p className="mut small">Tentukan pelatih tiap kelas. Pemain ditempatkan di kelas lewat menu Pemain.</p>
        {error && <div className="alert err">{error}</div>}
        {kls.map((k, i) => (
          <div key={k.id || `baru${i}`} className="kelas-row">
            <label>Nama<input value={k.nama} onChange={ubahKelas(i, 'nama')} maxLength={30} placeholder="U-10" /></label>
            <label>Rentang usia<input value={k.usia} onChange={ubahKelas(i, 'usia')} maxLength={30} placeholder="8-10 tahun" /></label>
            <label>Pelatih
              <select value={k.pelatih} onChange={ubahKelas(i, 'pelatih')}>
                <option value="">Belum ada</option>
                {pelatih.map((p) => <option key={p.email} value={p.email}>{p.nama}</option>)}
              </select>
            </label>
            <button type="button" className="abtn danger" onClick={() => hapus(i)}>Hapus</button>
          </div>
        ))}
        <div className="adm-actions">
          <button type="button" className="abtn" onClick={simpanSemuaKelas}>Simpan kelas</button>
          <button type="button" className="abtn ghost" onClick={tambah}>+ Tambah kelas</button>
        </div>
      </div>

      <form className="card" onSubmit={simpanHarga} style={{ marginTop: 18 }}>
        <h3>Harga &amp; rekening pembayaran</h3>
        <label>Iuran per bulan (Rp)<input type="number" min="0" step="1000" value={st.harga} onChange={(e) => setSt({ ...st, harga: e.target.value })} /></label>
        <div className="f2">
          <label>Bank<input value={st.bank} onChange={(e) => setSt({ ...st, bank: e.target.value })} maxLength={30} /></label>
          <label>Nomor rekening<input value={st.nomor} onChange={(e) => setSt({ ...st, nomor: e.target.value })} maxLength={30} inputMode="numeric" /></label>
        </div>
        <label>Atas nama<input value={st.atasNama} onChange={(e) => setSt({ ...st, atasNama: e.target.value })} maxLength={60} /></label>
        <div className="adm-actions"><button type="submit" className="abtn">Simpan</button></div>
      </form>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Data demo</h3>
        <p className="mut small">Data portal saat ini tersimpan di browser ini sebagai contoh. Tombol di bawah mengembalikan semuanya ke data contoh awal (akun yang kamu daftarkan ikut terhapus).</p>
        <button type="button" className="abtn danger" onClick={() => {
          if (window.confirm('Kembalikan semua data portal ke contoh awal? Tindakan ini tidak bisa dibatalkan.')) {
            resetDemo(); setKls(listKelas()); setSt(getSetelan()); info('Data demo direset')
          }
        }}>Reset data demo</button>
      </div>
      {toast}
    </div>
  )
}
