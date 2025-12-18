import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CifraDisplay } from "@/components/CifraDisplay"
import { ArrowLeft, Loader2, Download, Check, PlayCircle, Guitar, FileText, Languages, AlertTriangle, ListPlus } from "lucide-react"
import type { Musica } from "@/types"
import { storage } from "@/lib/storage"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AutoScroll } from "@/components/AutoScroll"
import { setlistStorage } from "@/lib/setlist-storage"
import { useToast } from "@/lib/useToast"
import { LANGUAGE_MAP } from "@/constants/languages"

function getYouTubeId(url: string | null) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function SongPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [song, setSong] = useState<Musica | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [showCifra, setShowCifra] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [versions, setVersions] = useState<{id: number, idioma: string, titulo: string}[]>([])
  const [setlists, setSetlists] = useState<any[]>([])
  const [isAddToSetlistOpen, setIsAddToSetlistOpen] = useState(false)
  const { addToast } = useToast()

  const handleOpenSetlistModal = () => {
    setSetlists(setlistStorage.getAll())
    setIsAddToSetlistOpen(true)
  }

  const handleAddToSetlist = (setlistId: string) => {
        if (song) {
            const added = setlistStorage.addSong(setlistId, song)
            
            if (added) {
                addToast("Adicionado ao repertório!", "success")
                setIsAddToSetlistOpen(false)
            } else {
                addToast("Esta música já está na lista.", "error")
            }
        }
    }

  useEffect(() => {
    async function fetchSongAndVersions() {
      if (!id) return;
      setLoading(true)

      const { data: currentSong, error } = await supabase
        .from('musicas')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && currentSong) {
        setSong(currentSong)
        if (currentSong.cifra && currentSong.cifra.includes('[')) {
            setShowCifra(true)
        }

        const parentId = currentSong.versao_de || currentSong.id
        const { data: relatedSongs } = await supabase
            .from('musicas')
            .select('id, idioma, titulo, versao_de')
            .or(`id.eq.${parentId},versao_de.eq.${parentId}`)
            .neq('id', currentSong.id)
            .order('idioma')

        if (relatedSongs) setVersions(relatedSongs)

      } else {
        const savedSongs = storage.getSavedSongs()
        const localSong = savedSongs.find(s => s.id === Number(id))
        if (localSong) {
            setSong(localSong)
            if (localSong.cifra && localSong.cifra.includes('[')) setShowCifra(true)
        }
      }
      setLoading(false)
    }

    fetchSongAndVersions()
  }, [id])

  useEffect(() => {
    if (song) setIsSaved(storage.isSaved(song.id))
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

  const handleCategoryClick = (category: string) => {
    navigate('/categorias', { state: { autoSelect: category } })
  }

  const youtubeId = song ? getYouTubeId(song.link_audio || "") : null
  const hasCifra = song?.cifra && song.cifra.includes('[')

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4 transition-colors">
        <p className="text-zinc-500">Música não encontrada.</p>
        <Link to="/"><Button variant="outline">Início</Button></Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        
        <Link to="/">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 gap-2 text-zinc-600 dark:text-zinc-400">
                <ArrowLeft className="w-4 h-4" /> Voltar
            </Button>
        </Link>

        {/* Header */}
        <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-white">{song.titulo}</h1>
                    
                    {/* --- ARTISTAS SEPARADOS E CLICÁVEIS --- */}
                    <p className="text-xl text-blue-600 dark:text-blue-400 font-medium flex flex-wrap gap-1">
                      {song.artista.split(',').map((art, index, arr) => {
                        const artistName = art.trim();
                        return (
                          <span key={index}>
                            <Link 
                              to={`/artistas/${encodeURIComponent(artistName)}`}
                              className="hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                              {artistName}
                            </Link>
                            {index < arr.length - 1 && <span className="text-zinc-400 mr-1">,</span>}
                          </span>
                        )
                      })}
                    </p>
                </div>
                
                <div className="flex gap-2 self-start md:self-auto flex-wrap">
                    
                    {versions.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20">
                                    <Languages className="w-4 h-4" />
                                    <span className="hidden sm:inline">Idioma</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem disabled className="opacity-100 font-bold bg-zinc-100 dark:bg-zinc-800">
                                    {LANGUAGE_MAP[song.idioma || 'pt-BR'] || song.idioma} (Atual)
                                </DropdownMenuItem>
                                {versions.map(v => (
                                    <DropdownMenuItem key={v.id} onClick={() => navigate(`/musica/${v.id}`)} className="cursor-pointer gap-2">
                                        <span>{LANGUAGE_MAP[v.idioma || 'pt-BR'] || v.idioma}</span>
                                        <span className="text-xs text-zinc-400 ml-auto">{v.titulo !== song.titulo ? `(${v.titulo})` : ''}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {youtubeId && (
                        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-900/10 dark:border-red-900 dark:text-red-400">
                                <PlayCircle className="w-4 h-4" /> 
                                <span className="hidden sm:inline">Ouvir</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] p-0 bg-black border-zinc-800 overflow-hidden">
                            <DialogHeader className="p-4 absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                              <DialogTitle className="text-white text-sm font-medium drop-shadow-md">{song.titulo}</DialogTitle>
                            </DialogHeader>
                            <div className="aspect-video w-full">
                              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                          </DialogContent>
                        </Dialog>
                    )}

                    <Dialog open={isAddToSetlistOpen} onOpenChange={setIsAddToSetlistOpen}>
                      <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={handleOpenSetlistModal} className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400">
                              <ListPlus className="w-4 h-4" />
                          </Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Adicionar ao Repertório</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 py-2">
                              {setlists.length === 0 ? (
                                  <div className="text-center py-4">
                                      <p className="text-zinc-500 mb-4">Você ainda não tem listas.</p>
                                      <Button onClick={() => navigate('/repertorios')} variant="outline">Criar Lista</Button>
                                  </div>
                              ) : (
                                  setlists.map(list => (
                                      <button
                                          key={list.id}
                                          onClick={() => handleAddToSetlist(list.id)}
                                          className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex items-center justify-between border border-transparent hover:border-zinc-200 transition-all"
                                      >
                                          <span className="font-medium">{list.nome}</span>
                                          <span className="text-xs text-zinc-500">{list.musicas.length} músicas</span>
                                      </button>
                                  ))
                              )}
                          </div>
                      </DialogContent>
                  </Dialog>

                    <Button variant="outline" size="icon" onClick={toggleSave} className={isSaved ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400" : "dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400"}>
                        {isSaved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    </Button>
                    {/* <Button variant="outline" size="icon" className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400"><Share2 className="w-4 h-4" /></Button> */}
                </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
                {/* --- CATEGORIAS CLICÁVEIS --- */}
                {(Array.isArray(song.categoria) ? song.categoria : [song.categoria]).filter(Boolean).map((cat: string) => (
                   <Badge 
                      key={cat} 
                      onClick={() => handleCategoryClick(cat)}
                      className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer transition-colors active:scale-95 select-none hover:text-blue-600 dark:hover:text-blue-400"
                   >
                      {cat}
                   </Badge>
                ))}
                
                {song.numero_cantai && (
                  <Badge variant="outline" className="text-zinc-500 border-zinc-300 dark:text-zinc-400 dark:border-zinc-700">
                    Cantai nº {song.numero_cantai}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    {LANGUAGE_MAP[song.idioma || 'pt-BR'] || song.idioma}
                </Badge>
            </div>
        </div>

        {hasCifra && (
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <button onClick={() => setShowCifra(false)} className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${!showCifra ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'}`}>
                      <FileText className="w-4 h-4" /> Letra
                  </button>
                  <button onClick={() => setShowCifra(true)} className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${showCifra ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'}`}>
                      <Guitar className="w-4 h-4" /> Cifra
                  </button>
              </div>
        )}

        {showCifra && hasCifra ? (
            <CifraDisplay content={song!.cifra!} />
        ) : (
            <article className="prose prose-zinc max-w-none">
                <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
                    {song?.letra}
                </p>
            </article>
        )}

        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p className="italic">
              Enviado por: <span className="font-medium text-zinc-700 dark:text-zinc-300">{song.enviado_por || "Colaborador Ruah"}</span>
          </p>
          <button onClick={() => navigate('/contribuir', { state: { songToEdit: song } })} className="flex items-center gap-2 hover:text-orange-600 transition-colors">
            <AlertTriangle className="w-4 h-4" />
            Encontrou algum erro? Sugerir correção
          </button>
       </div>
        <AutoScroll />
      </main>
    </div>
  )
}