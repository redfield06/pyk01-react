import { useEffect, useRef, useState } from 'react'

/* Animasi masuk saat scroll.
   anim: left | right | up | down | zoom   |   delay: ms
   Contoh: <Reveal anim="left" delay={120} className="card">...</Reveal> */
export default function Reveal({ as: Tag = 'div', anim = 'up', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-anim={anim}
      className={`${className}${shown ? ' in' : ''}`.trim()}
      style={{ '--d': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
