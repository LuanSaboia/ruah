import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useState, useEffect } from "react"
import { Search, Music, Mic2, Loader2, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import type { Musica } from "@/types"

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Estados separados para os resultados
  const [foundSongs, setFoundSongs] = useState<Musica[]>([])
  const [foundArtists, setFoundArtists] = useState<string[]>([])

  // Atalho de teclado (Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Efeito de Busca
  useEffect(() => {
    if (query.length < 2) {
      setFoundSongs([])
      setFoundArtists([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      
      // Realizamos duas buscas em paralelo (Promise.all é mais rápido)
      const [songsRes, artistsRes] = await Promise.all([
        // 1. Busca por Título da Música
        supabase
          .from('musicas')
          .select('id, titulo, artista, categoria')
          .ilike('titulo', `%${query}%`)
          .limit(4), // Limite de 4 músicas para não poluir

        // 2. Busca por Nome do Artista
        supabase
          .from('musicas')
          .select('artista')
          .ilike('artista', `%${query}%`)
          .limit(10) // Pegamos mais para garantir que achamos únicos
      ])
      
      if (songsRes.error) console.error(songsRes.error)
      if (artistsRes.error) console.error(artistsRes.error)

      // Atualiza Músicas
      setFoundSongs(songsRes.data || [])

      // Atualiza Artistas (Remove duplicatas, pois o banco retorna várias linhas do mesmo artista)
      if (artistsRes.data) {
        // Cria um Set para pegar valores únicos e converte de volta para array
        const uniqueArtists = Array.from(new Set(artistsRes.data.map(item => item.artista)))
        // Filtra para mostrar apenas os que dão match com a busca (segurança extra)
        const matchedArtists = uniqueArtists.filter(a => a.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
        setFoundArtists(matchedArtists)
      }

      setLoading(false)
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  // Navegação
  const handleSelectSong = (id: number) => {
    navigate(`/musica/${id}`)
    setOpen(false)
  }

  const handleSelectArtist = (artistName: string) => {
    navigate(`/artista/${encodeURIComponent(artistName)}`)
    setOpen(false)
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="relative w-full max-w-sm border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-4 text-sm text-zinc-500 text-left flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors bg-white dark:bg-zinc-950 shadow-sm min-w-0"
      >
        <Search className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline truncate">Buscar músicas ou artistas...</span>
        <span className="sm:hidden truncate">Buscar...</span>
        <kbd className="absolute right-2 top-2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Digite o nome da música ou artista..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && <div className="p-4 text-center text-sm text-zinc-500"><Loader2 className="w-4 h-4 animate-spin inline mr-2"/>Buscando...</div>}
          
          {!loading && foundSongs.length === 0 && foundArtists.length === 0 && query.length > 0 && (
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          )}

          {/* GRUPO 1: MÚSICAS */}
          {foundSongs.length > 0 && (
            <CommandGroup heading="Músicas">
              {foundSongs.map((music) => (
                <CommandItem 
                  key={music.id} 
                  value={music.titulo} 
                  onSelect={() => handleSelectSong(music.id)}
                  className="cursor-pointer"
                >
                  <Music className="mr-2 h-4 w-4 text-zinc-500" />
                  <div className="flex flex-col">
                    <span>{music.titulo}</span>
                    <span className="text-xs text-zinc-400">
                      {music.artista} 
                      {music.categoria && ` • ${Array.isArray(music.categoria) ? music.categoria[0] : music.categoria}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {/* Separador se tiver os dois tipos */}
          {foundArtists.length > 0 && foundSongs.length > 0 && <CommandSeparator />}
          
          {/* GRUPO 2: ARTISTAS (Destaque no topo se achar) */}
          {foundArtists.length > 0 && (
            <CommandGroup heading="Artistas">
              {foundArtists.map((artist) => (
                <CommandItem 
                  key={artist} 
                  value={"artist-" + artist}
                  onSelect={() => handleSelectArtist(artist)}
                  className="cursor-pointer"
                >
                  <Mic2 className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="font-medium">{artist}</span>
                  <ArrowRight className="ml-auto h-3 w-3 text-zinc-400" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

        </CommandList>
      </CommandDialog>
    </>
  )
}