import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HomePage } from "@/pages/HomePage"
import { SongPage } from "@/pages/SongPage"
import { AdminPage } from "@/pages/AdminPage" // <--- Importe aqui
import { ArtistsPage } from "./pages/ArtistsPage"
import { ArtistDetailsPage } from "./pages/ArtistDetailsPage"
import { MusicasPage } from "./pages/MusicasPage"
import { AdminListPage } from "./pages/AdminListPage"
import { ProtectedLayout } from "./components/ProtectedLayout"
import { LoginPage } from "./pages/LoginPage"
import { CategoriesPage } from "./pages/CategoriesPage"
import { ContributePage } from "./pages/ContributePage"
import { AdminReviewPage } from "./pages/AdminReviewPage"
import { AdminDashboard } from "./pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/musica/:id" element={<SongPage />} />

        <Route path="/musicas" element={<MusicasPage />} />

        <Route path="/artistas" element={<ArtistsPage />} />
        <Route path="/artista/:nome" element={<ArtistDetailsPage />} />

        <Route path="/contribuir" element={<ContributePage />} />

        {/* Rota de Categorias */}
        <Route path="/categorias" element={<CategoriesPage />} />
        
        {/* Rota de Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rotas Protegidas (Grupo Admin) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-list" element={<AdminListPage />} />
          <Route path="/admin-analise" element={<AdminReviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App