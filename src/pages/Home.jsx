import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import HeroWall from '../components/HeroWall.jsx'
import { STATS, FEATURES, PROGRAMS } from '../data/config.js'

const dirs = ['left', 'up', 'right']

export default function Home() {
  return (
    <>
      <div className="hero">
        <HeroWall />
        <div className="hero-in">
          <Reveal anim="left" className="hero-text">
            <span className="tag"><i className="dot" /> Pendaftaran Dibuka</span>
            <h1>Wujudkan Bakat <span>Futsal</span> Anak Anda</h1>
            <p className="lead">Akademi futsal dengan pelatih berlisensi, kurikulum terstruktur, dan suasana latihan yang seru untuk semua usia.</p>
            <div className="cta">
              <Link className="btn lg" to="/pendaftaran">Daftar Sekarang →</Link>
              <Link className="btn lg o" to="/contact">Hubungi Kami</Link>
            </div>
            <div className="stats">
              {STATS.map((s) => (
                <div key={s.label}><b>{s.value}</b><small>{s.label}</small></div>
              ))}
            </div>
          </Reveal>

          <Reveal anim="right" delay={150} className="hero-visual">
            <div className="ball-card"><span>⚽</span></div>
            <div className="float f1"><em>🏆</em><div><b>Juara Turnamen</b><small>50+ trofi diraih</small></div></div>
            <div className="float f2"><em>⭐</em><div><b>Pelatih Berlisensi</b><small>12 pelatih</small></div></div>
          </Reveal>
        </div>
      </div>

      <div className="w">
        <Reveal as="h2" anim="down">Mengapa Memilih Kami?</Reveal>
        <Reveal as="p" anim="down" delay={100} className="sub">Tiga alasan orang tua mempercayakan putranya kepada kami.</Reveal>
        <div className="grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} anim={dirs[i % 3]} delay={i * 120} className="card">
              <div className="ic">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="alt">
        <div className="w">
          <Reveal as="h2" anim="down">Program Latihan</Reveal>
          <Reveal as="p" anim="down" delay={100} className="sub">Pilih program sesuai usia dan tujuan.</Reveal>
          <div className="grid">
            {PROGRAMS.map((p, i) => (
              <Reveal key={p.title} anim="zoom" delay={i * 120} className="card">
                <div className="ic">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <span className="price">{p.freq}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
