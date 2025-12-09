import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import type { Musica } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mic2, Loader2, Music } from "lucide-react"
import { SongListItem } from "@/components/SongListItem"

export function ArtistDetailsPage() {
  const { nome } = useParams()
  const artistName = decodeURIComponent(nome || "")
  const navigate = useNavigate()
  
  const [songs, setSongs] = useState<Musica[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  useEffect(() => {
    async function fetchArtistSongs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('musicas')
        .select('*')
        .eq('artista', artistName)
        .order('titulo', { ascending: true })

      if (error) console.error(error)
      else setSongs(data || [])
      
      setLoading(false)
    }
    fetchArtistSongs()
  }, [artistName])

  // Filtro
  const filteredSongs = selectedLetter
    ? songs.filter(song => {
        if (selectedLetter === '#') return /^\d/.test(song.titulo)
        return song.titulo.toUpperCase().startsWith(selectedLetter)
      })
    : songs

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        
        {/* Cabeçalho do Artista */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:bg-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-sm">
                <Mic2 className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{artistName}</h1>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mt-2">
                <Music className="w-4 h-4" />
                <span>{songs.length} músicas cadastradas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Filtro A-Z */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
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

        {/* Lista de Músicas */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>
        ) : (
          <div className="flex flex-col border-t border-zinc-100 dark:border-zinc-800">
            {filteredSongs.map((song) => (
              <SongListItem 
                  key={song.id}
                  title={song.titulo}
                  artist={song.artista}
                  // category={song.categoria} // Opcional mostrar categoria aqui
                  onClick={() => navigate(`/musica/${song.id}`)}
              />
            ))}
            {filteredSongs.length === 0 && (
                <div className="col-span-full text-center py-12 text-zinc-500 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                    Nenhuma música encontrada com "{selectedLetter}".
                </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}