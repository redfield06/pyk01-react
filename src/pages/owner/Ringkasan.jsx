import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal.jsx'
import { bulanIni, bulanLalu, daftarPelatih, daftarPemain, listKelas, listTagihan, pemainDiKelas, rataKehadiran, useDb } from '../../services/db.js'
import { bulanTeks, rupiah } from '../../utils/format.js'

export default function Ringkasan() {
  useDb()
  const pemain = daftarPemain()
  const aktif = pemain.filter((p) => p.status === 'aktif').length
  const baru = pemain.filter((p) => p.status === 'baru').length
  const pelatih = daftarPelatih()
  const menunggu = pelatih.filter((p) => p.status === 'menunggu')
  const tagihan = listTagihan()
  const bulan = bulanIni()
  const masuk = tagihan.filter((t) => t.bulan === bulan && t.status === 'lunas').reduce((n, t) => n + t.jumlah, 0)
  const tunggak = tagihan.filter((t) => t.status === 'belum')
  const nTunggak = tunggak.reduce((n, t) => n + t.jumlah, 0)
  const rata = rataKehadiran()

  const enamBulan = [5, 4, 3, 2, 1, 0].map((n) => bulanLalu(n))
  const perBulan = enamBulan.map((b) => ({ b, v: tagihan.filter((t) => t.bulan === b && t.status === 'lunas').reduce((n, t) => n + t.jumlah, 0) }))
  const maks = Math.max(1, ...perBulan.map((x) => x.v))

  const kpi = [
    { label: 'Pemain aktif', nilai: aktif, ket: `${baru} pendaftar baru` },
    { label: 'Pelatih aktif', nilai: pelatih.filter((p) => p.status === 'aktif').length, ket: `${menunggu.length} menunggu persetujuan` },
    { label: `Pemasukan ${bulanTeks(bulan)}`, nilai: rupiah(masuk), ket: 'Pembayaran lunas' },
    { label: 'Tunggakan', nilai: rupiah(nTunggak), ket: `${tunggak.length} tagihan belum lunas` },
    { label: 'Rata-rata kehadiran', nilai: rata === null ? '–' : `${rata}%`, ket: 'Semua kelas' },
  ]

  return (
    <div className="view active">
      {menunggu.length > 0 && (
        <Reveal anim="down" className="card lengkapi">
          <div><b>{menunggu.length} pelatih menunggu persetujuan</b><p className="mut">{menunggu.map((p) => p.nama).join(', ')}</p></div>
          <Link className="abtn" to="../pelatih">Tinjau sekarang</Link>
        </Reveal>
      )}

      <div className="kpis">
        {kpi.map((k, i) => (
          <Reveal key={k.label} anim="up" delay={i * 70} className="card kpi">
            <small className="mut">{k.label}</small>
            <b>{k.nilai}</b>
            <span className="mut">{k.ket}</span>
          </Reveal>
        ))}
      </div>

      <div className="cols2">
        <Reveal anim="left" className="card">
          <h3>Kehadiran per kelas</h3>
          {listKelas().map((k) => {
            const r = rataKehadiran(k.id)
            return (
              <div key={k.id} className="rowline">
                <span>{k.nama} <small className="mut">({pemainDiKelas(k.id).length})</small></span>
                <div className="bar-wrap"><div className="bar" style={{ width: `${r ?? 0}%` }} /></div>
                <b className="bar-val">{r === null ? '–' : `${r}%`}</b>
              </div>
            )
          })}
        </Reveal>
        <Reveal anim="right" className="card">
          <h3>Pemasukan 6 bulan terakhir</h3>
          <div className="vbars">
            {perBulan.map((x) => (
              <div key={x.b} className="vbar" title={rupiah(x.v)}>
                <div className="vbar-col"><div style={{ height: `${(x.v / maks) * 100}%` }} /></div>
                <small className="mut">{new Date(`${x.b}-01`).toLocaleDateString('id-ID', { month: 'short' })}</small>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
