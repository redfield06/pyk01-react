import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { SITE } from '../data/config.js'

// Urutan kartu: kiri pemain, tengah owner, kanan pelatih
const KARTU = [
  { to: '/login/pemain', ikon: '⚽', judul: 'Pemain', sub: 'Login Pemain' },
  { to: '/login/owner', ikon: '🏆', judul: 'Owner', sub: 'Login Owner' },
  { to: '/login/pelatih', ikon: '🧑‍🏫', judul: 'Pelatih', sub: 'Login Pelatih' },
]

export default function LoginPortal() {
  useEffect(() => { document.title = `Portal Login — ${SITE.name} Academy` }, [])

  return (
    <div className="portal">
      <Link className="portal-back" to="/">← Beranda</Link>
      <div className="portal-in">
        <Reveal anim="down" className="portal-logo">
          ⚽ {SITE.name.slice(0, 5).toUpperCase()}<b>{SITE.name.slice(5).toUpperCase()}</b>
        </Reveal>

        <div className="portal-cards">
          {KARTU.map((k, i) => (
            <Reveal key={k.to} as={Link} to={k.to} anim="up" delay={i * 100} className="portal-card">
              <span className="portal-ico" aria-hidden="true">{k.ikon}</span>
              <span className="portal-txt">
                <b>{k.judul}</b>
                <small>{k.sub}</small>
              </span>
              <span className="portal-arr" aria-hidden="true">→</span>
            </Reveal>
          ))}
        </div>

        <p className="portal-foot">{SITE.name} Academy · Portal Login</p>
      </div>
    </div>
  )
}
