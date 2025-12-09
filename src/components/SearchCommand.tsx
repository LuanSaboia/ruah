import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useState, useEffect } from "react"
import { Search, Music, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("") // O que o usuário digita
  const [results, setResults] = useState<any[]>([]) // Resultados do banco
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

  // Buscar no banco quando o usuário digita
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('musicas')
        .select('id, titulo, artista, categoria') // Pegamos só o necessário
        .ilike('titulo', `%${query}%`) // ilike = insensitivo (ignora maiúscula/minúscula)
        .limit(5)
      
      setResults(data || [])
      setLoading(false)
    }, 300) // Espera 300ms antes de buscar para não sobrecarregar

    return () => clearTimeout(delayDebounce)
  }, [query])

  // Função ao clicar em um resultado
  const handleSelect = (id: number) => {
    navigate(`/musica/${id}`)
    setOpen(false)
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="relative w-full max-w-sm border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-4 text-sm text-zinc-500 text-left flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors bg-white dark:bg-zinc-950 shadow-sm"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline truncate">Buscar músicas...</span>
        <span className="sm:hidden truncate">Buscar...</span>
        <kbd className="absolute right-2 top-2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100">
          <span className="text-xs">⌘</span>K / <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Digite o nome da música..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && <div className="p-4 text-center text-sm text-zinc-500"><Loader2 className="w-4 h-4 animate-spin inline mr-2"/>Buscando...</div>}
          
          {!loading && results.length === 0 && query.length > 0 && (
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          )}

          {results.length > 0 && (
            <CommandGroup heading="Músicas Encontradas">
              {results.map((music) => (
                <CommandItem 
                  key={music.id} 
                  value={music.titulo} // Importante para o filtro interno do componente
                  onSelect={() => handleSelect(music.id)}
                  className="cursor-pointer"
                >
                  <Music className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{music.titulo}</span>
                    <span className="text-xs text-zinc-400">{music.artista} • {music.categoria}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}