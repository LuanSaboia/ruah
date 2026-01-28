import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"

import { HomePage } from "@/pages/HomePage"
import { SongPage } from "@/pages/SongPage"
import { AdminPage } from "@/pages/AdminPage"
import { ArtistsPage } from "@/pages/ArtistsPage"
import { ArtistDetailsPage } from "@/pages/ArtistDetailsPage"
import { MusicasPage } from "@/pages/MusicasPage"
import { AdminListPage } from "@/pages/AdminListPage"
import { ProtectedLayout } from "@/components/ProtectedLayout"
import { LoginPage } from "@/pages/LoginPage"
import { CategoriesPage } from "@/pages/CategoriesPage"
import { ContributePage } from "@/pages/ContributePage"
import { AdminReviewPage } from "@/pages/AdminReviewPage"
import { AdminDashboard } from "@/pages/AdminDashboard"
import { SavedSongsPage } from "@/pages/SavedSongsPage"
import { TunerPage } from "./pages/TunerPage"
import { SetlistsPage } from "./pages/SetlistsPage"
import { SetlistDetailPage } from "./pages/SetlistDetailPage"
import { PresentationPage } from "./pages/PresentationPage"
import { LiturgyBuilderPage } from "./pages/LiturgyBuilderPage"
import { ImportPage } from "./pages/ImportPage"

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Estado para controlar offline
  const [_isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true)
      // Se a internet cair e o usuário estiver na Home, joga ele para as músicas salvas
      if (location.pathname === "/") {
        navigate("/salvas")
      }
    }
    
    const handleOnline = () => setIsOffline(false)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    if (!navigator.onLine && location.pathname === "/") {
      navigate("/salvas")
    }

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [navigate, location])

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/musica/:id" element={<SongPage />} />
      <Route path="/musicas" element={<MusicasPage />} />
      <Route path="/importar/:id" element={<ImportPage />} />
      
      {/* Rota Nova: Músicas Offline */}
      <Route path="/salvas" element={<SavedSongsPage />} />

      <Route path="/artistas" element={<ArtistsPage />} />
      <Route path="/artistas/:nome" element={<ArtistDetailsPage />} />
      <Route path="/categorias" element={<CategoriesPage />} />
      <Route path="/afinador" element={<TunerPage />} />
      <Route path="/repertorios" element={<SetlistsPage />} />
      <Route path="/repertorios/:id" element={<SetlistDetailPage />} />
      <Route path="/apresentacao/:id" element={<PresentationPage />} />
      <Route path="/liturgia" element={<LiturgyBuilderPage />} />
      
      <Route path="/contribuir" element={<ContributePage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rotas Protegidas (Admin) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/admin" element={<AdminPage />} /> 
        <Route path="/admin-secret-cadastro" element={<AdminPage />} />
        
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-list" element={<AdminListPage />} />
        <Route path="/admin-analise" element={<AdminReviewPage />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App