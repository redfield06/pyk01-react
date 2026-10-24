import Reveal from '../components/Reveal.jsx'
import { GALLERY } from '../data/config.js'

const dirs = ['left', 'up', 'right']

export default function Gallery() {
  return (
    <div className="w">
      <Reveal as="h2" anim="down">Gallery</Reveal>
      <Reveal as="p" anim="down" delay={100} className="sub">Dokumentasi kegiatan di akademi kami.</Reveal>
      <div className="gal">
        {GALLERY.map((g, i) => (
          <Reveal
            key={g.title}
            anim={dirs[i % 3]}
            delay={(i % 3) * 100}
            style={{ background: g.image ? `url(${g.image}) center/cover` : g.gradient }}
          >
            {g.title}
          </Reveal>
        ))}
      </div>
    </div>
  )
}
