import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Reveal from '../../components/Reveal.jsx'
import { ambilKelas, infoUntuk, tandaiInfoDibaca, useDb } from '../../services/db.js'
import { fmtTanggal } from '../../utils/format.js'

const CLS = { Penting: 'warn', Info: 'info', Event: 'ok' }

export default function Pengumuman() {
  useDb()
  const { profil } = useOutletContext()
  const list = infoUntuk(profil.email)

  // buka halaman = semua pengumuman dianggap sudah dibaca (badge hilang)
  useEffect(() => { tandaiInfoDibaca(profil.email) }, [profil.email])

  return (
    <div className="view active">
      {list.length === 0 && <div className="card"><p className="mut">Belum ada pengumuman.</p></div>}
      {list.map((a, i) => (
        <Reveal as="article" key={a.id} anim={i % 2 ? 'right' : 'left'} delay={(i % 5) * 80} className="card ann">
          <span className={`pill ${CLS[a.tag] || 'info'}`}>{a.tag}</span>
          <h3>{a.judul}</h3>
          <p className="mut">{a.isi}</p>
          <small className="mut">
            {fmtTanggal(a.tgl)} · {a.namaOleh}
            {a.target !== 'semua' && ` · Kelas ${ambilKelas(a.target)?.nama || ''}`}
            {a.untuk && a.untuk !== 'semua' && ` · Untuk ${a.untuk}`}
          </small>
        </Reveal>
      ))}
    </div>
  )
}
