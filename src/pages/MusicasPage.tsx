import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import type { Musica } from "@/types"
import { SongListItem } from "@/components/SongListItem"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function MusicasPage() {
  const navigate = useNavigate()
  const [songs, setSongs] = useState<Musica[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  useEffect(() => {
    async function fetchAllSongs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('musicas')
        .select('*')
        .order('titulo', { ascending: true })

      if (error) console.error(error)
      else setSongs(data || [])
      
      setLoading(false)
    }
    fetchAllSongs()
  }, [])

  // Filtragem
  const filteredSongs = selectedLetter
    ? songs.filter(song => {
        if (selectedLetter === '#') return /^\d/.test(song.titulo)
        return song.titulo.toUpperCase().startsWith(selectedLetter)
      })
    : songs

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto max-w-3xl px-0 md:px-4 py-8">
        
        <div className="px-4 md:px-0 mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Biblioteca</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Todas as músicas cadastradas.</p>
        </div>

        {/* Filtro A-Z */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar touch-pan-x">
          <Button
            variant={selectedLetter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLetter(null)}
            className="rounded-full flex-shrink-0"
          >
            Todas
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

        {/* LISTA DE MÚSICAS */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : (
          <div className="border-t border-zinc-100 dark:border-zinc-800">
            {filteredSongs.map((song) => (
              <SongListItem
                key={song.id}
                title={song.titulo}
                artist={song.artista}
                category={song.categoria}
                onClick={() => navigate(`/musica/${song.id}`)}
              />
            ))}
            
            {filteredSongs.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                    Nenhuma música encontrada com "{selectedLetter}".
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}