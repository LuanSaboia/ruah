import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import type { Musica } from "@/types"
import { SongListItem } from "@/components/SongListItem"
import { Button } from "@/components/ui/button"
import { Loader2, Tag } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function CategoriesPage() {
  const navigate = useNavigate()
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
        
        // Extrair todas as categorias únicas existentes nas músicas
        const catsSet = new Set<string>()
        data.forEach(song => {
          const cats = Array.isArray(song.categoria) ? song.categoria : [song.categoria]
          cats.filter(Boolean).forEach((c: string) => catsSet.add(c))
        })
        // Ordenar alfabeticamente
        setAllCategories(Array.from(catsSet).sort())
      }
      
      setLoading(false)
    }
    fetchData()
  }, [])

  // Define quais grupos vamos exibir (Todos ou apenas o selecionado)
  const groupsToDisplay = selectedCategory ? [selectedCategory] : allCategories

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto max-w-3xl px-0 md:px-4 py-8">
        
        <div className="px-4 md:px-0 mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
              <Tag className="w-8 h-8 text-blue-600" />
              Categorias
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Navegue pelos temas do repertório.
            </p>
        </div>

        {/* Barra de Filtro Horizontal (Scrollável) */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar touch-pan-x sticky top-16 bg-white/95 dark:bg-zinc-950/95 backdrop-blur z-40 py-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="rounded-full flex-shrink-0"
          >
            Todas
          </Button>
          {allCategories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full flex-shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : (
          <div className="space-y-8">
            {groupsToDisplay.map((category) => {
              
              // AQUI ESTÁ A MÁGICA:
              // Filtramos as músicas que possuem ESSA categoria na lista delas.
              const songsInThisCategory = songs.filter(song => {
                const cats = Array.isArray(song.categoria) ? song.categoria : [song.categoria]
                return cats.includes(category)
              })

              if (songsInThisCategory.length === 0) return null

              return (
                <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Cabeçalho da Categoria (Estilo Letras.mus.br # A B C) */}
                  <div className="flex items-center gap-4 mb-3 px-4 md:px-0">
                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {category}
                    </h3>
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                    <span className="text-xs font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                      {songsInThisCategory.length}
                    </span>
                  </div>

                  {/* Lista de Músicas desta Categoria */}
                  <div className="border-t border-zinc-100 dark:border-zinc-800">
                    {songsInThisCategory.map((song) => (
                      <SongListItem
                        key={`${category}-${song.id}`} // Chave única combinada para o React não reclamar se repetir
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