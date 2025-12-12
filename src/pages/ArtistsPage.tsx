import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Mic2, Loader2, ChevronRight } from "lucide-react"

export function ArtistsPage() {
  const [artists, setArtists] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  useEffect(() => {
    async function fetchArtists() {
      setLoading(true)
      const { data, error } = await supabase
        .from('musicas')
        .select('artista')
        .order('artista', { ascending: true })

      if (error) {
        console.error("Erro:", error)
      } else {
        const allArtists = data
            ?.map(item => item.artista)
            .join(',')
            .split(',')
            .map(a => a.trim())
            .filter(Boolean)

        const uniqueArtists = Array.from(new Set(allArtists)).sort()
        
        setArtists(uniqueArtists)
      }
      setLoading(false)
    }
    fetchArtists()
  }, [])

  // Filtro
  const filteredArtists = selectedLetter
    ? artists.filter(artist => {
        if (selectedLetter === '#') return /^\d/.test(artist)
        return artist.toUpperCase().startsWith(selectedLetter)
      })
    : artists

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 tracking-tight">Artistas</h2>

        {/* Barra de Filtro A-Z Responsiva (Scroll Horizontal) */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          <Button
            variant={selectedLetter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLetter(null)}
            className="rounded-full flex-shrink-0"
          >
            Todos
          </Button>
          {alphabet.map(letter => (
            <Button
              key={letter}
              variant={selectedLetter === letter ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedLetter(letter)}
              className="rounded-full w-8 h-8 p-0 flex-shrink-0"
            >
              {letter}
            </Button>
          ))}
        </div>

        {/* Lista de Artistas */}
        {loading ? (
          <div className="flex justify-center h-40 items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          // GRID RESPONSIVO: 1 coluna no celular (grid-cols-1), 2 no tablet, 3 no PC
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArtists.map((artist) => (
              <Link 
                key={artist} 
                to={`/artista/${encodeURIComponent(artist)}`}
                className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <Mic2 className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-lg truncate">{artist}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
            
            {filteredArtists.length === 0 && (
              <div className="col-span-full text-center py-12 text-zinc-500 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                Nenhum artista encontrado com a letra "{selectedLetter}".
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}