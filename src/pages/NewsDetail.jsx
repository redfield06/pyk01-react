import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { getNews, listNews, paragraf } from '../services/news.js'
import { coverStyle, fmtTanggal } from '../utils/format.js'

export default function NewsDetail() {
  const { slug } = useParams()
  const [berita, setBerita] = useState(undefined) // undefined = memuat, null = tidak ada
  const [lain, setLain] = useState([])

  useEffect(() => {
    let batal = false
    setBerita(undefined)
    getNews(slug).then((b) => { if (!batal) setBerita(b) })
    listNews().then((l) => { if (!batal) setLain(l) }).catch(() => {})
    return () => { batal = true }
  }, [slug])

  useEffect(() => {
    if (berita) document.title = `${berita.judul} — ArenaFutsal Academy`
    return () => { document.title = 'ArenaFutsal Academy' }
  }, [berita])

  if (berita === undefined) return <div className="w"><p className="sub">Memuat berita...</p></div>

  if (berita === null) {
    return (
      <div className="w article">
        <h2>Berita tidak ditemukan</h2>
        <p className="sub">Artikel yang kamu cari mungkin sudah dihapus atau alamatnya salah.</p>
        <Link className="btn lg" to="/berita">← Kembali ke Berita</Link>
      </div>
    )
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(`${berita.judul}\n${window.location.href}`)}`
  const terkait = lain
    .filter((b) => b.id !== berita.id)
    .sort((a, b) => Number(b.kategori === berita.kategori) - Number(a.kategori === berita.kategori))
    .slice(0, 3)

  return (
    <div className="w">
      <article className="article">
        <Link className="back" to="/berita">← Semua berita</Link>
        <Reveal anim="up">
          <span className="ntag">{berita.kategori}</span>
          <h1>{berita.judul}</h1>
          <small className="mut">{fmtTanggal(berita.tanggal)}</small>
          <div className="ncover big article-cover" style={coverStyle(berita)}>{!berita.gambar && berita.emoji}</div>
        </Reveal>

        <div className="article-body">
          {paragraf(berita.isi).map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="share">
          <span>Bagikan:</span>
          <a className="btn wa" href={wa} target="_blank" rel="noopener noreferrer">Bagikan ke WhatsApp</a>
        </div>
      </article>

      {terkait.length > 0 && (
        <section className="related">
          <h2>Berita Lainnya</h2>
          <div className="news-grid">
            {terkait.map((b) => (
              <Link key={b.id} to={`/berita/${b.slug}`} className="card ncard in">
                <div className="ncover" style={coverStyle(b)}>{!b.gambar && b.emoji}</div>
                <div className="nbody">
                  <span className="ntag">{b.kategori}</span>
                  <h3>{b.judul}</h3>
                  <small>{fmtTanggal(b.tanggal)}</small>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
