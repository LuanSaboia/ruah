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

  const [foundSongs, setFoundSongs] = useState<Musica[]>([])
  const [foundArtists, setFoundArtists] = useState<string[]>([])

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

  useEffect(() => {
    if (query.length < 2) {
      setFoundSongs([])
      setFoundArtists([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      
      const { data } = await supabase
        .from('musicas')
        .select('*')
        .or(`titulo.ilike.%${query}%,artista.ilike.%${query}%`)
        .limit(10)

      if (data) {
        setFoundSongs(data)

        const allArtistsOnResult = data.flatMap(m => 
            m.artista ? m.artista.split(',').map((a: string) => a.trim()) : []
        )

        const matchingArtists = allArtistsOnResult.filter(artistName => 
            artistName.toLowerCase().includes(query.toLowerCase())
        )

        setFoundArtists(Array.from(new Set(matchingArtists)))
      }
      
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelectSong = (id: number) => {
    navigate(`/musica/${id}`)
    setOpen(false)
  }

  const handleSelectArtist = (artistName: string) => {
    navigate(`/artistas/${encodeURIComponent(artistName)}`)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full justify-start text-sm text-zinc-500 dark:text-zinc-400 sm:pr-12 md:w-40 lg:w-64 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-9 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline-flex">Buscar músicas...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-zinc-50 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100 sm:flex">
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
          <CommandEmpty>
             {loading ? (
                <div className="flex items-center justify-center py-6 gap-2 text-zinc-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
                </div>
             ) : (
                "Nenhum resultado encontrado."
             )}
          </CommandEmpty>

          {!loading && (
            <>
                {foundSongs.length > 0 && (
                  <CommandGroup heading="Músicas">
                    {foundSongs.map((music) => (
                      <CommandItem 
                      key={music.id} 
                      value={"song-" + music.titulo} 
                      onSelect={() => handleSelectSong(music.id)}
                      className="cursor-pointer"
                      >
                        <Music className="mr-2 h-4 w-4 text-zinc-500" />
                        <div className="flex flex-col">
                            <span>{music.titulo}</span>
                            <span className="text-xs text-zinc-400">
                            {music.artista} 
                            </span>
                        </div>
                        </CommandItem>
                    ))}
                    </CommandGroup>
                )}
                
                {foundArtists.length > 0 && foundSongs.length > 0 && <CommandSeparator />}

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
                        <ArrowRight className="ml-auto h-3 w-3 text-zinc-400 opacity-0 group-hover:opacity-100" />
                        </CommandItem>
                    ))}
                    </CommandGroup>
                )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}