import { useEffect, useRef, useState } from 'react'

// Notifikasi kecil di bawah layar. Pakai: const [toast, info] = useToast(); ... info('Tersimpan') ... {toast}
export function useToast() {
  const [teks, setTeks] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const info = (m) => {
    setTeks(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setTeks(''), 2600)
  }
  return [<div key="toast" className={`toast${teks ? ' show' : ''}`}>{teks}</div>, info]
}
