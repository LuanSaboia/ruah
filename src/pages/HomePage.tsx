import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import type { Musica } from "@/types"
import { SongListItem } from "@/components/SongListItem"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Heart, Sparkles, BookOpen, Music, Mic2, ArrowRight, Clock, Search } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"

export function HomePage() {
  const navigate = useNavigate()
  const [recentSongs, setRecentSongs] = useState<Musica[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      
      // Buscar apenas as 5 últimas músicas adicionadas
      const { data: recents } = await supabase
        .from('musicas')
        .select('*')
        .order('id', { ascending: false }) // Assume que ID maior = mais novo
        .limit(5)

      if (recents) setRecentSongs(recents)
      setLoading(false)
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* 1. SEÇÃO DE BOAS-VINDAS / BUSCA RÁPIDA */}
        <section className="mb-10 text-center py-10 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              Bem-vindo ao <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Ruah</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
              Seu repertório digital. Encontre letras, cifras e organize sua liturgia em segundos.
            </p>
            
            <div className="flex justify-center gap-3">
              <Button onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k', 'ctrlKey': true}))} variant="outline" className="gap-2 h-12 px-6 rounded-full border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300">
                <Search className="w-4 h-4" /> Buscar música...
              </Button>
              <Button onClick={() => navigate('/musicas')} className="gap-2 h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none">
                <Music className="w-4 h-4" /> Ver Biblioteca
              </Button>
            </div>
        </section>

        {/* 2. ATALHOS DE CATEGORIAS (GRID) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" /> Explorar por Tema
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <CategoryCard 
              icon={Flame} label="Louvor" color="text-orange-500" bg="bg-orange-50 dark:bg-orange-950/30" 
              onClick={() => navigate('/categorias')} // Futuro: Filtrar direto
            />
            <CategoryCard 
              icon={Heart} label="Adoração" color="text-red-500" bg="bg-red-50 dark:bg-red-950/30" 
              onClick={() => navigate('/categorias')} 
            />
            <CategoryCard 
              icon={BookOpen} label="Litúrgico" color="text-purple-500" bg="bg-purple-50 dark:bg-purple-950/30" 
              onClick={() => navigate('/categorias')} 
            />
            <CategoryCard 
              icon={Mic2} label="Artistas" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-950/30" 
              onClick={() => navigate('/artistas')} 
            />
          </div>
        </section>

        {/* 3. ÚLTIMAS ADICIONADAS (LISTA) */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> Adicionadas Recentemente
            </h2>
            <Link to="/musicas" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              Ver todas <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {loading ? (
               <div className="p-8 text-center text-zinc-500">Carregando novidades...</div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentSongs.map((song) => (
                  <SongListItem
                    key={song.id}
                    title={song.titulo}
                    artist={song.artista}
                    category={song.categoria}
                    // Adicionamos um ícone de "Novo" visualmente
                    onClick={() => navigate(`/musica/${song.id}`)}
                  />
                ))}
                
                {recentSongs.length === 0 && (
                  <div className="p-8 text-center text-zinc-500">
                    Nenhuma música cadastrada ainda.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}

// Componente auxiliar para os cards de categoria
function CategoryCard({ icon: Icon, label, color, bg, onClick }: any) {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-all border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group"
    >
      <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      </CardContent>
    </Card>
  )
}