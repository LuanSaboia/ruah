import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Heart, Loader2 } from "lucide-react"
import type { Musica } from "@/types"

export function SongPage() {
  const { id } = useParams()
  const [song, setSong] = useState<Musica | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSong() {
      if (!id) return;

      const { data, error } = await supabase
        .from('musicas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error("Erro ao buscar música:", error)
      } else {
        setSong(data)
      }
      setLoading(false)
    }

    fetchSong()
  }, [id])

  // Estado de Carregamento (Com fundo escuro corrigido)
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // Estado de Erro / Não encontrado (Com fundo escuro corrigido)
  if (!song) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4 transition-colors">
        <p className="text-zinc-500">Música não encontrada.</p>
        <Link to="/">
          <Button variant="outline">Voltar para o início</Button>
        </Link>
      </div>
    )
  }

  return (
    // AQUI ESTAVA O PROBLEMA: Adicionei dark:bg-zinc-950 e dark:text-zinc-50
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        
        {/* Botão Voltar */}
        <Link to="/">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 gap-2 text-zinc-600 dark:text-zinc-400">
                <ArrowLeft className="w-4 h-4" /> Voltar para o início
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
                    <Button variant="outline" size="icon" className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400">
                        <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400">
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
                {/* Lógica para exibir múltiplas categorias ou string antiga */}
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

      </main>
    </div>
  )
}