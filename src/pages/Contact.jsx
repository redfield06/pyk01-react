import Reveal from '../components/Reveal.jsx'
import { SITE } from '../data/config.js'

export default function Contact() {
  const wa = `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(SITE.waMessage)}`

  return (
    <div className="w">
      <Reveal as="h2" anim="down">Contact</Reveal>
      <Reveal as="p" anim="down" delay={100} className="sub">Punya pertanyaan? Hubungi kami lewat kanal berikut.</Reveal>
      <div className="ct">
        <Reveal as="a" anim="left" className="card" href={wa} target="_blank" rel="noopener noreferrer">
          <div className="i" style={{ background: '#25d366' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3.5A11 11 0 0 0 3.2 17.3L2 22l4.8-1.2A11 11 0 1 0 20.5 3.5zM12 20a9 9 0 0 1-4.6-1.3l-.3-.2-2.8.7.8-2.7-.2-.3A9 9 0 1 1 12 20zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.5-.1-.7.1-.7.9-.9 1.1-.3.2-.6.1a7.4 7.4 0 0 1-3.7-3.2c-.3-.5.3-.5.8-1.5a.6.6 0 0 0 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.2 6.2 0 0 0 1.3 3.3 14 14 0 0 0 5.4 4.8c2 .8 2.8.9 3.8.7a3.2 3.2 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z" />
            </svg>
          </div>
          <div><h3>WhatsApp</h3><p>Klik untuk chat langsung dengan admin</p></div>
        </Reveal>

        <Reveal as="a" anim="right" delay={120} className="card" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
          <div className="i" style={{ background: 'linear-gradient(45deg,#f9a825,#e1306c,#833ab4)' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </div>
          <div><h3>Instagram</h3><p>{SITE.instagramHandle}</p></div>
        </Reveal>
      </div>
    </div>
  )
}
