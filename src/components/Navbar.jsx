import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getRole, homeFor, isLoggedIn } from '../utils/auth.js'
import { SITE } from '../data/config.js'

const links = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/pendaftaran', label: 'Pendaftaran' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/berita', label: 'Berita' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <nav className="nav">
      <Link className="logo" to="/" onClick={close}>⚽ {SITE.name.slice(0, 5).toUpperCase()}<b>{SITE.name.slice(5).toUpperCase()}</b></Link>

      <div className={`menu${open ? ' open' : ''}`}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={close} className={({ isActive }) => (isActive ? 'on' : '')}>
            {l.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-right">
        {isLoggedIn()
          ? <Link className="btn" to={homeFor(getRole())} onClick={close}>{getRole() === 'owner' ? 'Portal Owner' : getRole() === 'pelatih' ? 'Portal Pelatih' : 'Dashboard'}</Link>
          : <Link className="btn" to="/login" onClick={close}>Login</Link>}
        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
      </div>
    </nav>
  )
}
