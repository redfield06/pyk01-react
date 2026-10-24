import { useState } from 'react'
import { daftarPemain, listKelas, namaDari, setKelasPemain, setStatusAkun, statPemain, ambilKelas, useDb } from '../../services/db.js'
import { profilDari } from '../../services/profile.js'
import { unduhCsv } from '../../utils/csv.js'
import { fmtTanggal } from '../../utils/format.js'
import { useToast } from '../../utils/useToast.jsx'

const PILL = { aktif: 'ok', baru: 'warn', nonaktif: 'mut' }

export default function Pemain() {
  useDb()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [kelas, setKelas] = useState('')
  const [buka, setBuka] = useState('')
  const [toast, info] = useToast()
  const kelasList = listKelas()

  const semua = daftarPemain()
  const hasil = semua.filter((p) =>
    (!status || p.status === status) &&
    (!kelas || (kelas === '-' ? !p.kelasId : p.kelasId === kelas)) &&
    (!q.trim() || `${p.nama} ${p.email}`.toLowerCase().includes(q.trim().toLowerCase())))

  const ubah = (p, st, pesan) => { setStatusAkun(p.email, st); info(pesan) }

  const ekspor = () => {
    unduhCsv('data-pemain.csv', [
      ['Nama', 'Email', 'WhatsApp', 'Kelas', 'Status', 'Kehadiran (%)', 'Orang tua/wali', 'Alamat', 'Tanggal lahir', 'Sekolah', 'Jersey'],
      ...hasil.map((p) => {
        const pr = profilDari(p.email) || {}
        const st = statPemain(p.email)
        return [p.nama, p.email, pr.wa || p.wa, ambilKelas(p.kelasId)?.nama || '', p.status, st.persen ?? '', pr.ortu || '', pr.alamat || '', pr.tglLahir || '', pr.sekolah || '', pr.jersey || '']
      }),
    ])
  }

  return (
    <div className="view active adm">
      <div className="card">
        <div className="filter-bar">
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau email..." aria-label="Cari pemain" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status">
            <option value="">Semua status</option><option value="baru">Pendaftar baru</option><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option>
          </select>
          <select value={kelas} onChange={(e) => setKelas(e.target.value)} aria-label="Filter kelas">
            <option value="">Semua kelas</option>
            {kelasList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            <option value="-">Belum ada kelas</option>
          </select>
          <button type="button" className="abtn ghost" onClick={ekspor} disabled={!hasil.length}>⬇ Ekspor CSV</button>
        </div>
        <p className="mut small">{hasil.length} dari {semua.length} pemain</p>
      </div>

      {hasil.length === 0 && <div className="card"><p className="mut">Tidak ada pemain yang cocok.</p></div>}
      {hasil.map((p) => {
        const pr = profilDari(p.email) || {}
        const st = statPemain(p.email)
        return (
          <div key={p.email} className="card pemain-row">
            <div className="adm-row nobox">
              <div className="adm-info">
                <b>{p.nama} <span className={`pill ${PILL[p.status]}`}>{p.status === 'baru' ? 'pendaftar baru' : p.status}</span></b>
                <small className="mut">{p.email} · Dibuat {fmtTanggal(p.dibuat.slice(0, 10))}</small>
              </div>
              <select className="mini-select" value={p.kelasId} onChange={(e) => { setKelasPemain(p.email, e.target.value); info('Kelas diperbarui') }} aria-label={`Kelas ${p.nama}`}>
                <option value="">Belum ada kelas</option>
                {kelasList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
              <div className="adm-btns">
                {p.status === 'baru' && <button type="button" className="abtn" onClick={() => ubah(p, 'aktif', `${p.nama} diterima ✓`)}>Terima</button>}
                {p.status === 'aktif' && <button type="button" className="abtn ghost" onClick={() => ubah(p, 'nonaktif', `${p.nama} dinonaktifkan`)}>Nonaktifkan</button>}
                {p.status === 'nonaktif' && <button type="button" className="abtn ghost" onClick={() => ubah(p, 'aktif', `${p.nama} diaktifkan`)}>Aktifkan</button>}
                <button type="button" className="abtn ghost" onClick={() => setBuka(buka === p.email ? '' : p.email)}>{buka === p.email ? 'Tutup' : 'Detail'}</button>
              </div>
            </div>
            {buka === p.email && (
              <dl className="dl detail-box">
                <div><dt>No WhatsApp</dt><dd>{pr.wa || p.wa || <span className="belum">Belum diisi</span>}</dd></div>
                <div><dt>Orang tua/wali</dt><dd>{pr.ortu || <span className="belum">Belum diisi</span>}</dd></div>
                <div><dt>Tanggal lahir</dt><dd>{pr.tglLahir ? fmtTanggal(pr.tglLahir) : <span className="belum">Belum diisi</span>}</dd></div>
                <div><dt>Asal sekolah</dt><dd>{pr.sekolah || <span className="belum">Belum diisi</span>}</dd></div>
                <div><dt>Ukuran jersey</dt><dd>{pr.jersey || <span className="belum">Belum diisi</span>}</dd></div>
                <div><dt>Kehadiran</dt><dd>{st.persen === null ? '–' : `${st.persen}% (${st.hadir}/${st.pertemuan} sesi)`}</dd></div>
                <div className="full"><dt>Alamat</dt><dd>{pr.alamat || <span className="belum">Belum diisi</span>}</dd></div>
                <div className="full"><dt>Pelatih kelas</dt><dd>{ambilKelas(p.kelasId)?.pelatih ? namaDari(ambilKelas(p.kelasId).pelatih) : '–'}</dd></div>
              </dl>
            )}
          </div>
        )
      })}
      {toast}
    </div>
  )
}
