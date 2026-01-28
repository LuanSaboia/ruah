import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Search, Music, Mic2, Loader2, ArrowRight, Quote } from "lucide-react"
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
  const [lyricsMatches, setLyricsMatches] = useState<Musica[]>([])

  // Atalho de teclado
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
      setLyricsMatches([])
      return
    }

    const searchMusic = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('musicas')
          .select('id, titulo, artista, letra')
          .or(`titulo.ilike.%${query}%,artista.ilike.%${query}%,letra.ilike.%${query}%`)
          .limit(15)

        if (error) throw error

        if (data) {
          const songs = data as Musica[]
          const lowerQuery = query.toLowerCase()

          // 1. Artistas únicos
          const artists = Array.from(new Set(
            songs
              .filter(s => s.artista?.toLowerCase().includes(lowerQuery))
              .map(s => s.artista)
          )).slice(0, 3)

          // 2. Músicas (Prioridade: Título ou Artista)
          const directMatches = songs.filter(s =>
            s.titulo?.toLowerCase().includes(lowerQuery) ||
            s.artista?.toLowerCase().includes(lowerQuery)
          ).slice(0, 5)

          // 3. Trechos (Bate apenas na letra)
          const onlyLyricsMatches = songs.filter(s =>
            !s.titulo?.toLowerCase().includes(lowerQuery) &&
            !s.artista?.toLowerCase().includes(lowerQuery) &&
            s.letra?.toLowerCase().includes(lowerQuery)
          ).slice(0, 5)

          setFoundSongs(directMatches)
          setFoundArtists(artists)
          setLyricsMatches(onlyLyricsMatches)
        }
      } catch (err) {
        console.error("Erro na busca:", err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchMusic, 300)
    return () => clearTimeout(timer)
  }, [query])

  const getSnippet = (letra: string, termo: string) => {
    if (!letra) return ""
    const index = letra.toLowerCase().indexOf(termo.toLowerCase())
    if (index === -1) return ""

    const start = Math.max(0, index - 25)
    const end = Math.min(letra.length, index + termo.length + 35)
    let snippet = letra.substring(start, end).replace(/\n/g, " ")

    return `${start > 0 ? "..." : ""}${snippet}${end < letra.length ? "..." : ""}`
  }

  // Ajustado para aceitar string ou number
  const handleSelectSong = (id: string | number) => {
    setOpen(false)
    navigate(`/musica/${id}`)
  }

  const handleSelectArtist = (artistName: string) => {
    setOpen(false)
    navigate(`/artistas?search=${encodeURIComponent(artistName)}`)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all outline-none group"
      >
        <Search className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
        <span className="flex-1 text-left">Pesquisar música...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white dark:bg-zinc-950 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-2xl sm:max-w-[600px]">
          {/* Usamos o Command aqui com shouldFilter={false} para que o motor não bloqueie nossos resultados do Supabase */}
          <Command shouldFilter={false} className="rounded-none border-none">
            <CommandInput
              placeholder="Escreva o que procura..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className="max-h-[400px]">
              {loading && (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              )}

              {!loading && query.length >= 2 && foundSongs.length === 0 && lyricsMatches.length === 0 && foundArtists.length === 0 && (
                <CommandEmpty className="py-10 text-center text-sm text-zinc-500">
                  Nenhuma música encontrada.
                </CommandEmpty>
              )}

              {!loading && (
                <>

                  {lyricsMatches.length > 0 && (
                    <CommandGroup heading="Trechos de música">
                      {lyricsMatches.map((music) => (
                        <CommandItem
                          key={`lyric-${music.id}`}
                          onSelect={() => handleSelectSong(music.id)}
                          className="cursor-pointer py-3"
                        >
                          <Quote className="mr-3 h-4 w-4 text-blue-400" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-xs italic text-zinc-500 truncate mb-1">
                              {getSnippet(music.letra || "", query)}
                            </span>
                            <span className="text-sm font-medium">{music.titulo} - {music.artista}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {foundSongs.length > 0 && (
                    <CommandGroup heading="Músicas">
                      {foundSongs.map((music) => (
                        <CommandItem
                          key={music.id}
                          onSelect={() => handleSelectSong(music.id)}
                          className="cursor-pointer py-3"
                        >
                          <Music className="mr-3 h-4 w-4 text-zinc-500" />
                          <div className="flex flex-col">
                            <span className="font-medium">{music.titulo}</span>
                            <span className="text-xs text-zinc-400">{music.artista}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {(foundSongs.length > 0 || lyricsMatches.length > 0) && foundArtists.length > 0 && <CommandSeparator />}

                  {foundArtists.length > 0 && (
                    <CommandGroup heading="Artistas">
                      {foundArtists.map((artist) => (
                        <CommandItem
                          key={artist}
                          onSelect={() => handleSelectArtist(artist)}
                          className="cursor-pointer py-3"
                        >
                          <Mic2 className="mr-3 h-4 w-4 text-blue-500" />
                          <span className="font-medium flex-1">{artist}</span>
                          <ArrowRight className="h-3 w-3 text-zinc-400" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}