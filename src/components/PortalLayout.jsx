import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearSession } from '../utils/auth.js'
import { SITE } from '../data/config.js'
import Avatar from './Avatar.jsx'
import { muatProfil, profilCepat, simpanProfil } from '../services/profile.js'

// Kerangka dashboard (sidebar + topbar) yang dipakai portal pemain, pelatih, dan owner.
// menu: [{ to, icon, label, title, sub, badge? }]
export default function PortalLayout({ menu, roleLabel }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const nav = useNavigate()

  // profil akun yang sedang login (nama, foto, kontak). Dibagikan ke halaman anak lewat Outlet.
  const [profil, setProfil] = useState(profilCepat)
  useEffect(() => { muatProfil().then(setProfil) }, [])
  const simpan = async (data) => {
    const baru = await simpanProfil(data)
    setProfil(baru)
    return baru
  }

  const current = menu.find((m) => pathname.endsWith(m.to)) || menu[0]

  const logout = () => {
    if (window.confirm('Yakin ingin keluar?')) {
      clearSession()
      nav('/')
    }
  }

  return (
    <div className="dash">
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="logo">⚽ {SITE.name.slice(0, 5).toUpperCase()}<b>{SITE.name.slice(5).toUpperCase()}</b></div>
        <nav className="side-menu">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} onClick={() => setOpen(false)} className={({ isActive }) => `item${isActive ? ' active' : ''}`}>
              <span>{m.icon}</span> {m.label}
              {m.badge > 0 && <em className="badge">{m.badge}</em>}
            </NavLink>
          ))}
        </nav>
        <button className="item logout" onClick={logout}><span>🚪</span> Keluar</button>
      </aside>
      <div className={`overlay${open ? ' show' : ''}`} onClick={() => setOpen(false)} />

      <main className="main">
        <header className="topbar">
          <button className="burger" aria-label="Menu" onClick={() => setOpen(true)}>☰</button>
          <div>
            <h1>{current.title}</h1>
            <p className="mut">{current.sub}</p>
          </div>
          <div className="user">
            <Avatar foto={profil.foto} nama={profil.nama} />
            <div><b>{profil.nama}</b><small className="mut">{roleLabel}</small></div>
          </div>
        </header>

        {/* key = pathname supaya animasi masuk ulang tiap pindah menu */}
        <Outlet key={pathname} context={{ profil, simpan }} />
      </main>
    </div>
  )
}
