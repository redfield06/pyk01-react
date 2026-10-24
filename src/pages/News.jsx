import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { KATEGORI_BERITA } from '../data/config.js'
import { listNews } from '../services/news.js'
import { coverStyle, fmtTanggal } from '../utils/format.js'

const PER_HALAMAN = 7 // 1 berita utama + 6 kartu

export default function News() {
  const [params, setParams] = useSearchParams()
  const kategoriUrl = params.get('kategori') || ''
  const q = params.get('q') || ''

  const [semua, setSemua] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cari, setCari] = useState(q)
  const [tampil, setTampil] = useState(PER_HALAMAN)

  useEffect(() => {
    document.title = 'Berita & Artikel — ArenaFutsal Academy'
    listNews()
      .then(setSemua)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // kolom pencarian -> ?q= (ditunda 300 ms supaya tidak update tiap ketukan)
  useEffect(() => {
    const t = setTimeout(() => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        if (cari.trim()) next.set('q', cari.trim())
        else next.delete('q')
        return next
      }, { replace: true })
    }, 300)
    return () => clearTimeout(t)
  }, [cari, setParams])

  // filter berubah -> mulai lagi dari halaman pertama
  useEffect(() => { setTampil(PER_HALAMAN) }, [kategoriUrl, q])

  const kategoriAktif = KATEGORI_BERITA.find((k) => k.toLowerCase() === kategoriUrl.toLowerCase()) || ''

  const pilihKategori = (k) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (k) next.set('kategori', k.toLowerCase())
      else next.delete('kategori')
      return next
    })

  const kata = q.trim().toLowerCase()
  const hasil = semua.filter((b) =>
    (!kategoriAktif || b.kategori === kategoriAktif) &&
    (!kata || `${b.judul} ${b.ringkas} ${b.isi}`.toLowerCase().includes(kata))
  )
  const terlihat = hasil.slice(0, tampil)
  const [utama, ...lainnya] = terlihat
  const sisa = hasil.length - terlihat.length

  const reset = () => { setCari(''); pilihKategori('') }

  return (
    <div className="w">
      <Reveal as="h2" anim="down">Berita &amp; Artikel</Reveal>
      <Reveal as="p" anim="down" delay={100} className="sub">Kabar terbaru seputar kegiatan latihan, prestasi tim, dan informasi penting dari akademi kami.</Reveal>

      <div className="news-tools">
        <div className="filters">
          {['Semua', ...KATEGORI_BERITA].map((k) => {
            const on = k === 'Semua' ? !kategoriAktif : k === kategoriAktif
            return (
              <button key={k} type="button" className={on ? 'on' : ''} onClick={() => pilihKategori(k === 'Semua' ? '' : k)}>{k}</button>
            )
          })}
        </div>
        <input
          className="news-search" type="search" value={cari} placeholder="Cari berita..."
          aria-label="Cari berita" onChange={(e) => setCari(e.target.value)}
        />
      </div>

      {loading && <p className="sub">Memuat berita...</p>}
      {error && <div className="alert err">{error}</div>}

      {!loading && !error && !utama && (
        <div className="news-empty">
          <p className="sub">Belum ada artikel untuk filter ini.</p>
          <button type="button" className="btn o" onClick={reset}>Lihat semua berita</button>
        </div>
      )}

      {utama && (
        <Reveal key={`${kategoriAktif}-${kata}-${utama.id}`} as={Link} to={`/berita/${utama.slug}`} anim="up" className="card news-featured">
          <div className="ncover big" style={coverStyle(utama)}>{!utama.gambar && utama.emoji}</div>
          <div className="nbody">
            <span className="ntag">{utama.kategori}</span>
            <h3>{utama.judul}</h3>
            <p>{utama.ringkas}</p>
            <small>{fmtTanggal(utama.tanggal)}</small>
            <span className="more">Baca selengkapnya →</span>
          </div>
        </Reveal>
      )}

      <div className="news-grid">
        {lainnya.map((b, i) => (
          <Reveal key={b.id} as={Link} to={`/berita/${b.slug}`} anim={['left', 'up', 'right'][i % 3]} delay={(i % 3) * 100} className="card ncard">
            <div className="ncover" style={coverStyle(b)}>{!b.gambar && b.emoji}</div>
            <div className="nbody">
              <span className="ntag">{b.kategori}</span>
              <h3>{b.judul}</h3>
              <p>{b.ringkas}</p>
              <small>{fmtTanggal(b.tanggal)}</small>
            </div>
          </Reveal>
        ))}
      </div>

      {sisa > 0 && (
        <div className="news-more">
          <button type="button" className="btn o lg" onClick={() => setTampil(tampil + PER_HALAMAN - 1)}>
            Muat lebih banyak ({sisa} lagi)
          </button>
        </div>
      )}
    </div>
  )
}
