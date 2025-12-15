import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import type { Musica } from "@/types"
import { SongListItem } from "@/components/SongListItem"
import { Button } from "@/components/ui/button"
import { Loader2, Tag, X } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export function CategoriesPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [songs, setSongs] = useState<Musica[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data, error } = await supabase
        .from('musicas')
        .select('*')
        .order('titulo', { ascending: true })

      if (error) {
        console.error(error)
      } else if (data) {
        setSongs(data)
        
        const catsSet = new Set<string>()
        data.forEach(song => {
          const cats = Array.isArray(song.categoria) ? song.categoria : [song.categoria]
          cats.filter(Boolean).forEach((c: string) => catsSet.add(c))
        })
        setAllCategories(Array.from(catsSet).sort())
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Detecção Automática (Vindo da música)
  useEffect(() => {
    if (location.state && location.state.autoSelect) {
        setSelectedCategory(location.state.autoSelect)
        window.history.replaceState({}, '') 
    }
  }, [location])

  const groupsToDisplay = selectedCategory 
    ? allCategories.filter(c => c === selectedCategory)
    : allCategories

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Tag className="w-8 h-8 text-blue-600" />
              Categorias
            </h1>
            <p className="text-zinc-500 mt-1">
              {selectedCategory 
                ? `Exibindo: ${selectedCategory}` 
                : "Navegue por temas."}
            </p>
          </div>

          {selectedCategory && (
            <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30"
            >
                <X className="w-4 h-4 mr-2"/> Limpar Filtro
            </Button>
          )}
        </div>

        {/* --- BARRA DE ROLAGEM HORIZONTAL --- */}
        {!loading && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                <Badge
                    variant={selectedCategory === null ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap ${selectedCategory === null ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    onClick={() => setSelectedCategory(null)}
                >
                    Todas
                </Badge>

                {allCategories.map(cat => (
                    <Badge
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap transition-all ${
                            selectedCategory === cat 
                                ? 'bg-blue-600 hover:bg-blue-700 shadow-md scale-105' 
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                        onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    >
                        {cat}
                    </Badge>
                ))}
            </div>
        )}

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {groupsToDisplay.map((category) => {
              const songsInThisCategory = songs.filter(s => {
                const cats = Array.isArray(s.categoria) ? s.categoria : [s.categoria]
                return cats.includes(category)
              })

              if (songsInThisCategory.length === 0) return null

              return (
                <div key={category} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <div 
                    className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {category}
                    </h3>
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                    <span className="text-xs font-medium text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-full">
                      {songsInThisCategory.length}
                    </span>
                  </div>

                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-100 dark:border-zinc-800">
                    {songsInThisCategory.map((song) => (
                      <SongListItem
                        key={`${category}-${song.id}`} 
                        title={song.titulo}
                        artist={song.artista}
                        category={song.categoria}
                        numero={song.numero_cantai}
                        onClick={() => navigate(`/musica/${song.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}

            {groupsToDisplay.length === 0 && !loading && (
               <div className="text-center py-12 text-zinc-500">
                 Nenhuma categoria encontrada.
               </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}