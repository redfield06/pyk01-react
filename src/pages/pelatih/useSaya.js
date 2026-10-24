import { ambilAkun, kelasPelatih, useDb } from '../../services/db.js'
import { getUser } from '../../utils/auth.js'

// Data pelatih yang sedang login: akun dan kelas yang diampu
export function useSaya() {
  useDb()
  const email = getUser()?.email || ''
  const kelas = kelasPelatih(email)
  return { email, akun: ambilAkun(email), kelas, kelasIds: kelas.map((k) => k.id) }
}
