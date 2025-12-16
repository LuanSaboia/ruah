import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { SongListItem } from "@/components/SongListItem"
import { setlistStorage } from "@/lib/setlist-storage"
import type { Setlist } from "@/types"
import { ArrowLeft, PlayCircle, Trash2 } from "lucide-react"

export function SetlistDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [list, setList] = useState<Setlist | undefined>(undefined)

    useEffect(() => {
        if (id) {
            const found = setlistStorage.getById(id)
            if (found) setList(found)
            else navigate('/repertorios')
        }
    }, [id, navigate])

    const handleRemoveSong = (e: React.MouseEvent, songId: number) => {
        e.stopPropagation()
        if (!list) return
        setlistStorage.removeSong(list.id, songId)
        setList(setlistStorage.getById(list.id))
    }

    const startPresentation = () => {
        navigate(`/apresentacao/${list?.id}`)
    }

    if (!list) return null

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 transition-colors">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <Link to="/repertorios">
                    <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent text-zinc-500 gap-2">
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </Button>
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{list.nome}</h1>
                        <p className="text-zinc-500 mt-1">{list.musicas.length} músicas selecionadas</p>
                    </div>
                    {list.musicas.length > 0 && (
                        <Button onClick={startPresentation} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full md:w-auto">
                            <PlayCircle className="w-4 h-4" /> Iniciar Apresentação
                        </Button>
                    )}
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                    {list.musicas.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500">
                            <p>Esta lista está vazia.</p>
                            <p className="text-sm mt-2">Vá até uma música e clique em <br /><strong>"Adicionar ao Repertório"</strong>.</p>
                            <Link to="/">
                                <Button variant="outline" className="mt-4">Procurar Músicas</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {list.musicas.map((song) => (
                                <div key={song.id} className="relative group">
                                    <SongListItem
                                        title={song.titulo}
                                        artist={song.artista}
                                        category={song.categoria}
                                        numero={song.numero_cantai}
                                        onClick={() => navigate(`/musica/${song.id}`)}
                                    />
                                    {/* Botão de Remover (Aparece no Hover ou sempre no mobile) */}
                                    <button
                                        onClick={(e) => handleRemoveSong(e, song.id)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-red-500 shadow-sm border rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all z-10"
                                        title="Remover da lista"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}