import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { SongListItem } from "@/components/SongListItem"
import { storage } from "@/lib/storage"
import type { Musica } from "@/types"
import { Download, WifiOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function SavedSongsPage() {
  const navigate = useNavigate()
  const [songs, setSongs] = useState<Musica[]>([])

  useEffect(() => {
    // Carrega instantaneamente do LocalStorage
    setSongs(storage.getSavedSongs())
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto max-w-3xl px-0 md:px-4 py-8">
        
        <div className="px-4 md:px-0 mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
              <WifiOff className="w-8 h-8 text-green-600" />
              Músicas Offline
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              {songs.length} músicas disponíveis sem internet.
            </p>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {songs.map((song) => (
            <SongListItem
              key={song.id}
              title={song.titulo}
              artist={song.artista}
              category={song.categoria}
              numero={song.numero_cantai}
              onClick={() => navigate(`/musica/${song.id}`)}
            />
          ))}
          
          {songs.length === 0 && (
              <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4 text-zinc-400">
                    <Download className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Nenhuma música salva</h3>
                  <p className="text-zinc-500 mt-2 max-w-xs mx-auto">
                    Toque no ícone de download nas músicas para acessá-las quando estiver sem internet.
                  </p>
              </div>
          )}
        </div>
      </main>
    </div>
  )
}