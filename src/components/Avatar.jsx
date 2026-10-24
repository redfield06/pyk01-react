// Foto profil; kalau belum ada foto, tampilkan huruf pertama nama.
export default function Avatar({ foto, nama = '', big = false }) {
  const huruf = nama.trim()[0]?.toUpperCase() || '?'
  return (
    <div className={`avatar${big ? ' big' : ''}`}>
      {foto ? <img src={foto} alt={`Foto ${nama}`} /> : huruf}
    </div>
  )
}
