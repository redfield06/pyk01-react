// Potong foto menjadi persegi (dari tengah), perkecil, lalu ubah ke JPEG kecil
// supaya muat disimpan dan cepat dimuat.
export function kompresFoto(file, sisi = 360) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('File harus berupa gambar (JPG/PNG).'))
    if (file.size > 8 * 1024 * 1024) return reject(new Error('Ukuran foto maksimal 8 MB.'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const s = Math.min(img.width, img.height)
      const c = document.createElement('canvas')
      c.width = c.height = Math.min(sisi, s)
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Foto tidak bisa dibaca.')) }
    img.src = url
  })
}
