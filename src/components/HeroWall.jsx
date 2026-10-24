import { useEffect, useMemo, useState } from 'react'
import DriftWall from './DriftWall.jsx'
import { GALLERY } from '../data/config.js'

/* Latar bergerak untuk hero Beranda.
   Foto diambil dari GALLERY (config.js). Kalau "image" kosong, dibuat
   kartu gradien otomatis, jadi tetap tampil bagus tanpa foto. */

const svgTile = (title, gradient) => {
  const [a = '#2563eb', b = '#7c3aed'] = gradient.match(/#[0-9a-f]{6}/gi) || []
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
    `<rect width="600" height="400" fill="url(#g)"/>` +
    `<text x="300" y="190" font-size="84" text-anchor="middle">⚽</text>` +
    `<text x="300" y="285" font-size="30" font-weight="700" font-family="sans-serif" fill="#fff" text-anchor="middle">${title.replace(/&/g, '&amp;')}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const ukuran = () => {
  const w = typeof window === 'undefined' ? 1200 : window.innerWidth
  if (w < 560) return { columns: 3, tileWidth: 120, tileHeight: 82, gap: 12 }
  if (w < 900) return { columns: 4, tileWidth: 160, tileHeight: 106, gap: 14 }
  return { columns: 5, tileWidth: 200, tileHeight: 132, gap: 18 }
}

export default function HeroWall() {
  const [size, setSize] = useState(ukuran)

  useEffect(() => {
    const onResize = () => setSize((s) => {
      const n = ukuran()
      return n.columns === s.columns ? s : n
    })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const items = useMemo(() => {
    const dasar = GALLERY.map((g) => ({ title: g.title, image: g.image || svgTile(g.title, g.gradient || '') }))
    // gandakan dengan urutan berbeda supaya kolom tidak terlihat berulang
    return [...dasar, ...dasar.slice(3), ...dasar.slice(0, 3)]
  }, [])

  return (
    <div className="hero-bg" aria-hidden="true">
      <DriftWall
        decorative
        items={items}
        {...size}
        tilt={16}
        turn={-14}
        perspective={1200}
        depth={120}
        speed={34}
        parallax={0.5}
        lift={48}
        fade={0.45}
        dim={0.85}
        overlayColor="#060010"
      />
    </div>
  )
}
