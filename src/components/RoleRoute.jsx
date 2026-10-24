import { Navigate } from 'react-router-dom'
import { getRole, homeFor, isLoggedIn } from '../utils/auth.js'

// Hanya peran tertentu yang boleh masuk. Peran lain dialihkan ke halamannya sendiri.
// Catatan: ini hanya pembatas tampilan; keamanan sebenarnya harus dicek lagi di backend.
export default function RoleRoute({ role, children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  const mine = getRole() || 'player'
  return mine === role ? children : <Navigate to={homeFor(mine)} replace />
}
