import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { setlistStorage } from "@/lib/setlist-storage"
import type { Setlist } from "@/types"
import { Button } from "@/components/ui/button"
import { CifraDisplay } from "@/components/CifraDisplay"
import { ArrowLeft, ArrowRight, X, Music2 } from "lucide-react"
import { useToast } from "@/lib/useToast"
import { AutoScroll } from "@/components/AutoScroll"

export function PresentationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const [list, setList] = useState<Setlist | undefined>(undefined)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCifra, setShowCifra] = useState(true)

  useEffect(() => {
    if (id) {
        const found = setlistStorage.getById(id)
        if (found && found.musicas.length > 0) {
            setList(found)
        } else {
            addToast("Lista vazia ou não encontrada", "error")
            navigate(-1)
        }
    }
  }, [id, navigate])

  // Navegação por teclado (Setas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") nextSong()
        if (e.key === "ArrowLeft") prevSong()
        if (e.key === "Escape") navigate(-1)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, list])

  if (!list) return null
  
  const currentSong = list.musicas[currentIndex]
  const hasNext = currentIndex < list.musicas.length - 1
  const hasPrev = currentIndex > 0

  const nextSong = () => {
    if (hasNext) {
        setCurrentIndex(prev => prev + 1)
        window.scrollTo(0, 0)
    }
  }

  const prevSong = () => {
    if (hasPrev) {
        setCurrentIndex(prev => prev - 1)
        window.scrollTo(0, 0)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      
      {/* BARRA DE CONTROLE SUPERIOR (FIXA) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 text-white flex items-center justify-between px-4 z-50 shadow-md">
         <div className="flex items-center gap-4">
             <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => navigate(-1)}>
                 <X className="w-6 h-6" /> <span className="hidden sm:inline ml-2">Sair</span>
             </Button>
             
             <div className="flex flex-col">
                 <span className="font-bold text-sm md:text-lg truncate max-w-[150px] md:max-w-md">
                    {currentIndex + 1}. {currentSong.titulo}
                 </span>
                 <span className="text-xs text-zinc-400">{list.nome}</span>
             </div>
         </div>

         <div className="flex items-center gap-2">
             <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                onClick={() => setShowCifra(!showCifra)}
             >
                {showCifra ? "Ver Letra" : "Ver Cifra"}
             </Button>

             <div className="flex items-center bg-zinc-800 rounded-md ml-2">
                 <Button variant="ghost" disabled={!hasPrev} onClick={prevSong} className="text-white hover:bg-zinc-700">
                    <ArrowLeft className="w-5 h-5" />
                 </Button>
                 <span className="text-xs font-mono px-2 text-zinc-400">
                    {currentIndex + 1}/{list.musicas.length}
                 </span>
                 <Button variant="ghost" disabled={!hasNext} onClick={nextSong} className="text-white hover:bg-zinc-700">
                    <ArrowRight className="w-5 h-5" />
                 </Button>
             </div>
         </div>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="container mx-auto px-2 pt-20 max-w-4xl">
         {/* Se tiver cifra e o modo cifra estiver ativado */}
         {showCifra && currentSong.cifra ? (
             <CifraDisplay content={currentSong.cifra} />
         ) : (
             <div className="prose prose-zinc dark:prose-invert max-w-none p-4 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{currentSong.titulo}</h2>
                <p className="text-xl text-zinc-500 mb-8">{currentSong.artista}</p>
                <p className="whitespace-pre-line text-xl leading-loose font-medium">
                    {currentSong.letra}
                </p>
             </div>
         )}
      </div>

      {/* Navegação Flutuante no Rodapé (Para Mobile) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 md:hidden z-40 bg-zinc-900/90 p-2 rounded-full shadow-2xl backdrop-blur-sm border border-zinc-700">
          <Button size="icon" variant="ghost" disabled={!hasPrev} onClick={prevSong} className="text-white rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Music2 className="w-5 h-5 text-blue-500 animate-pulse" />
          <Button size="icon" variant="ghost" disabled={!hasNext} onClick={nextSong} className="text-white rounded-full">
            <ArrowRight className="w-6 h-6" />
          </Button>
      </div>
      <AutoScroll />

    </div>
  )
}