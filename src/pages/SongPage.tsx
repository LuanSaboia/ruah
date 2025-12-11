import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Heart, Loader2, Download, Check } from "lucide-react"
import type { Musica } from "@/types"
import { storage } from "@/lib/storage" // Importe o storage

export function SongPage() {
  const { id } = useParams()
  const [song, setSong] = useState<Musica | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    async function fetchSong() {
      if (!id) return;
      setLoading(true)

      // ESTRATÉGIA: Network First, Fallback to Cache
      // 1. Tenta buscar no Banco de Dados (Online)
      const { data, error } = await supabase
        .from('musicas')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        // Cenário A: Internet OK -> Usa dados do banco
        setSong(data)
      } else {
        // Cenário B: Deu erro ou sem net -> Tenta buscar no LocalStorage
        console.log("Erro de conexão ou música não encontrada no banco. Tentando offline...")
        
        const savedSongs = storage.getSavedSongs()
        const localSong = savedSongs.find(s => s.id === Number(id))

        if (localSong) {
          setSong(localSong) // Achou offline! Salva o dia.
        } else {
          console.error("Música não encontrada nem no banco nem no offline.")
        }
      }
      
      setLoading(false)
    }

    fetchSong()
  }, [id])

  // Monitora se a música atual está salva (para pintar o botão de download)
  useEffect(() => {
    if (song) {
      setIsSaved(storage.isSaved(song.id))
    }
  }, [song])

  const toggleSave = () => {
    if (!song) return
    if (isSaved) {
      storage.removeSong(song.id)
      setIsSaved(false)
    } else {
      storage.saveSong(song)
      setIsSaved(true)
    }
  }

  // ... (Mantenha o restante do código de Loading, Erro e JSX igualzinho estava)
  // Estado de Carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // Estado de Erro / Não encontrado
  if (!song) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4 transition-colors">
        <p className="text-zinc-500">Música não encontrada ou sem conexão.</p>
        <div className="flex gap-2">
            <Link to="/">
            <Button variant="outline">Ir para o Início</Button>
            </Link>
            <Link to="/salvas">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Ver Músicas Salvas</Button>
            </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        
        {/* Botão Voltar */}
        <Link to="/">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 gap-2 text-zinc-600 dark:text-zinc-400">
                <ArrowLeft className="w-4 h-4" /> Voltar
            </Button>
        </Link>

        {/* Cabeçalho da Música */}
        <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-white">{song.titulo}</h1>
                    <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">{song.artista}</p>
                </div>
                <div className="flex gap-2">
                    {/* Botão de Download / Offline */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={toggleSave}
                      className={isSaved ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400" : "dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400"}
                    >
                        {isSaved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    </Button>

                    <Button variant="outline" size="icon" className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400">
                        <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400">
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
                {(Array.isArray(song.categoria) ? song.categoria : [song.categoria]).filter(Boolean).map((cat: string) => (
                   <Badge key={cat} className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300">
                      {cat}
                   </Badge>
                ))}
                {song.numero_cantai && (
                  <Badge variant="outline" className="text-zinc-500 border-zinc-300 dark:text-zinc-400 dark:border-zinc-700">
                    Cantai nº {song.numero_cantai}
                  </Badge>
                )}
            </div>
        </div>

        {/* A Letra */}
        <article className="prose prose-zinc max-w-none">
            <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
                {song.letra}
            </p>
        </article>

        {/* Créditos */}
        <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-400 italic">
                Enviado por: <span className="text-zinc-600 dark:text-zinc-300 font-medium">{song.enviado_por || "Colaborador Ruah"}</span>
            </p>
        </div>

      </main>
    </div>
  )
}