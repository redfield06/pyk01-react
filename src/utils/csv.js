// Unduh data tabel sebagai file CSV (bisa dibuka di Excel). baris = array of array.
export function unduhCsv(namaFile, baris) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const isi = '\ufeff' + baris.map((b) => b.map(esc).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([isi], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = namaFile
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
