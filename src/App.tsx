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
import { RegisterPage } from "@/pages/RegisterPage" // <--- Importando a nova página
import { CategoriesPage } from "@/pages/CategoriesPage"
import { ContributePage } from "@/pages/ContributePage"
import { AdminReviewPage } from "@/pages/AdminReviewPage"
import { AdminDashboard } from "@/pages/AdminDashboard"
import { SavedSongsPage } from "@/pages/SavedSongsPage"
import { TunerPage } from "./pages/TunerPage"
import { SetlistsPage } from "./pages/SetlistsPage"
import { SetlistDetailPage as SetlistDetailView } from "./pages/SetlistDetailPage"
import { PresentationPage } from "./pages/PresentationPage"
import { LiturgyBuilderPage } from "./pages/LiturgyBuilderPage"

// Importando o Contexto de Autenticação
import { AuthProvider } from "@/contexts/AuthContext"

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Estado para controlar offline
  const [_isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/musica/:id" element={<SongPage />} />
      <Route path="/musicas" element={<MusicasPage />} />
      
      {/* Rota Nova: Músicas Offline */}
      <Route path="/salvas" element={<SavedSongsPage />} />

      <Route path="/artistas" element={<ArtistsPage />} />
      <Route path="/artistas/:nome" element={<ArtistDetailsPage />} />
      <Route path="/categorias" element={<CategoriesPage />} />
      <Route path="/afinador" element={<TunerPage />} />
      <Route path="/repertorios" element={<SetlistsPage />} />
      <Route path="/repertorios/:id" element={<SetlistDetailView />} />
      <Route path="/apresentacao/:id" element={<PresentationPage />} />
      <Route path="/liturgia" element={<LiturgyBuilderPage />} />
      
      <Route path="/contribuir" element={<ContributePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} /> {/* <--- Nova Rota de Registro */}
      
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

export default function App() {
  return (
    <AuthProvider> {/* <--- O AuthProvider envolve todo o App */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}