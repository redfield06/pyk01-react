const KEY = 'af_token'
const ROLE = 'af_role'
const USER = 'af_user'

export const isLoggedIn = () => !!localStorage.getItem(KEY)
export const getToken = () => localStorage.getItem(KEY)

// Peran: 'player' | 'pelatih' | 'owner'  ('admin' dari versi lama dianggap 'owner')
export const getRole = () => {
  const r = localStorage.getItem(ROLE)
  return r === 'admin' ? 'owner' : r
}
export const isOwner = () => isLoggedIn() && getRole() === 'owner'
export const isAdmin = isOwner

// Halaman utama tiap peran setelah login
export const homeFor = (role) => (role === 'owner' ? '/owner' : role === 'pelatih' ? '/pelatih' : '/dashboard')

// Data akun yang sedang login: { email, nama }
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER)) || null } catch { return null }
}

export const setSession = (token, role = 'player', user = null) => {
  localStorage.setItem(KEY, token || 'demo')
  localStorage.setItem(ROLE, role === 'admin' ? 'owner' : role)
  if (user) localStorage.setItem(USER, JSON.stringify({ email: user.email || '', nama: user.nama || '' }))
  else localStorage.removeItem(USER)
}

export const updateUser = (patch) => {
  const u = getUser()
  if (u) localStorage.setItem(USER, JSON.stringify({ ...u, ...patch }))
}

export const clearSession = () => {
  localStorage.removeItem(KEY)
  localStorage.removeItem(ROLE)
  localStorage.removeItem(USER)
}
