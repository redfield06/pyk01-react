import { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Payment from './pages/Payment.jsx'
import News from './pages/News.jsx'
import NewsDetail from './pages/NewsDetail.jsx'
import RoleRoute from './components/RoleRoute.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import LoginPortal from './pages/LoginPortal.jsx'
import RegisterAkun from './pages/RegisterAkun.jsx'
import DashboardLayout from './pages/dashboard/DashboardLayout.jsx'
import Biodata from './pages/dashboard/Biodata.jsx'
import Jadwal from './pages/dashboard/Jadwal.jsx'
import Pengumuman from './pages/dashboard/Pengumuman.jsx'
import Bayar from './pages/dashboard/Bayar.jsx'
import PelatihLayout from './pages/pelatih/PelatihLayout.jsx'
import PelatihBeranda from './pages/pelatih/Beranda.jsx'
import PelatihJadwal from './pages/pelatih/Jadwal.jsx'
import PelatihAbsensi from './pages/pelatih/Absensi.jsx'
import PelatihPenilaian from './pages/pelatih/Penilaian.jsx'
import PelatihPengumuman from './pages/pelatih/Pengumuman.jsx'
import PelatihProfil from './pages/pelatih/Profil.jsx'
import OwnerLayout from './pages/owner/OwnerLayout.jsx'
import OwnerRingkasan from './pages/owner/Ringkasan.jsx'
import OwnerPelatih from './pages/owner/Pelatih.jsx'
import OwnerPemain from './pages/owner/Pemain.jsx'
import OwnerKeuangan from './pages/owner/Keuangan.jsx'
import OwnerBerita from './pages/owner/Berita.jsx'
import OwnerPengaturan from './pages/owner/Pengaturan.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="page"><Outlet /></main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="pendaftaran" element={<Register />} />
          <Route path="pembayaran" element={<Payment />} />
          <Route path="berita" element={<News />} />
          <Route path="berita/:slug" element={<NewsDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login/:peran" element={<Login />} />
          <Route path="daftar-akun" element={<RegisterAkun />} />
        </Route>

        <Route path="login" element={<LoginPortal />} />

        <Route path="dashboard" element={<RoleRoute role="player"><DashboardLayout /></RoleRoute>}>
          <Route index element={<Navigate to="biodata" replace />} />
          <Route path="biodata" element={<Biodata />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="pengumuman" element={<Pengumuman />} />
          <Route path="bayar" element={<Bayar />} />
        </Route>

        <Route path="pelatih" element={<RoleRoute role="pelatih"><PelatihLayout /></RoleRoute>}>
          <Route index element={<Navigate to="beranda" replace />} />
          <Route path="beranda" element={<PelatihBeranda />} />
          <Route path="jadwal" element={<PelatihJadwal />} />
          <Route path="absensi" element={<PelatihAbsensi />} />
          <Route path="penilaian" element={<PelatihPenilaian />} />
          <Route path="pengumuman" element={<PelatihPengumuman />} />
          <Route path="profil" element={<PelatihProfil />} />
        </Route>

        <Route path="owner" element={<RoleRoute role="owner"><OwnerLayout /></RoleRoute>}>
          <Route index element={<Navigate to="ringkasan" replace />} />
          <Route path="ringkasan" element={<OwnerRingkasan />} />
          <Route path="pelatih" element={<OwnerPelatih />} />
          <Route path="pemain" element={<OwnerPemain />} />
          <Route path="keuangan" element={<OwnerKeuangan />} />
          <Route path="berita" element={<OwnerBerita />} />
          <Route path="pengaturan" element={<OwnerPengaturan />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}