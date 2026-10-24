import { useRef, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import PayLogo from '../components/PayLogo.jsx'
import { PAYMENT_METHODS, PROGRAMS } from '../data/config.js'
import { confirmPayment } from '../services/api.js'

const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export default function Payment() {
    const { state } = useLocation()
    const [tab, setTab] = useState('bank')
    const [selected, setSelected] = useState(null)
    const [file, setFile] = useState(null)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')
    const fileRef = useRef(null)

    // Kalau dibuka langsung tanpa mendaftar, kembalikan ke form pendaftaran
    if (!state?.nama) return <Navigate to="/pendaftaran" replace />

    const total = PROGRAMS.find((p) => p.title === state.program)?.fee ?? 0
    const list = PAYMENT_METHODS[tab]
    const method = list.find((m) => m.id === selected)

    const switchTab = (t) => { setTab(t); setSelected(null) }

    const copy = async () => {
        await navigator.clipboard.writeText(method.number)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const konfirmasi = async () => {
        if (!method) return setError('Pilih metode pembayaran dulu.')
        if (!file) return setError('Upload bukti pembayaran dulu.')
        setError('')
        setLoading(true)
        try {
            // TODO: untuk upload file sungguhan, kirim memakai FormData ke backend
            await confirmPayment({ nama: state.nama, program: state.program, metode: method.name, total, bukti: file.name })
            setDone(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (done) {
        return (
            <div className="w"><div className="form">
                <Reveal anim="zoom" className="card done">
                    <div className="ic" style={{ margin: '0 auto 16px' }}>✅</div>
                    <h2>Pembayaran Dikirim!</h2>
                    <p className="sub">Terima kasih, {state.nama}. Admin akan memverifikasi pembayaran Anda dan menghubungi via WhatsApp.</p>
                    <Link className="btn lg" to="/">Kembali ke Beranda</Link>
                </Reveal>
            </div></div>
        )
    }

    return (
        <div className="w"><div className="form">
            <Reveal as="h2" anim="down">Pembayaran</Reveal>
            <Reveal as="p" anim="down" delay={100} className="sub">Selesaikan pembayaran untuk mengaktifkan pendaftaran.</Reveal>
            <Reveal anim="up" className="steps"><div>1 Data Pemain</div><div className="on">2 Pembayaran</div><div>3 Selesai</div></Reveal>

            <Reveal anim="left" className="sec summary">
                <div><small>Nama Pemain</small><b>{state.nama}</b></div>
                <div><small>Program</small><b>{state.program}</b></div>
                <div className="total"><small>Total Pembayaran</small><b>{rupiah(total)}</b></div>
            </Reveal>

            <Reveal anim="right" className="sec">
                <h3>Pilih Metode Pembayaran</h3>
                <div className="tabs">
                    <button type="button" className={tab === 'bank' ? 'on' : ''} onClick={() => switchTab('bank')}>🏦 Transfer Bank</button>
                    <button type="button" className={tab === 'ewallet' ? 'on' : ''} onClick={() => switchTab('ewallet')}>📱 E-Wallet</button>
                </div>

                <div className="mgrid">
                    {list.map((m) => (
                        <button type="button" key={m.id} className={`mcard${selected === m.id ? ' sel' : ''}`} onClick={() => setSelected(m.id)}>
                            <PayLogo m={m} />
                            <span>{m.name}</span>
                        </button>
                    ))}
                </div>

                {method && (
                    <div className="pinfo">
                        <div className="pinfo-head"><PayLogo m={method} size="sm" /> <b>{method.name}</b></div>
                        <small>{tab === 'bank' ? 'Nomor Rekening' : 'Nomor E-Wallet'}</small>
                        <div className="num">
                            <span>{method.number}</span>
                            <button type="button" className="btn o" onClick={copy}>{copied ? 'Tersalin ✓' : 'Salin'}</button>
                        </div>
                        <small>Atas Nama</small>
                        <p><b>{method.owner}</b></p>
                        <ol>
                            <li>Transfer sesuai nominal <b>{rupiah(total)}</b>.</li>
                            <li>Simpan bukti pembayaran (screenshot / foto struk).</li>
                            <li>Upload bukti di bawah, lalu klik tombol konfirmasi.</li>
                        </ol>
                    </div>
                )}
            </Reveal>

            <Reveal anim="left" className="sec">
                <h3>Upload Bukti Pembayaran</h3>
                <label>File bukti (gambar atau PDF)
                    <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0] || null)} />
                </label>
                {error && <div className="alert err">{error}</div>}
                <button type="button" className="btn big" onClick={konfirmasi} disabled={loading}>
                    {loading ? 'Mengirim...' : 'Saya Sudah Bayar'}
                </button>
            </Reveal>
        </div></div>
    )
}