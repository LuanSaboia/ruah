import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SongListItem } from "@/components/SongListItem"
import { setlistStorage } from "@/lib/setlist-storage"
import { useToast } from "@/lib/useToast"
import type { Setlist } from "@/types"
import { 
    ArrowLeft, 
    PlayCircle, 
    Trash2, 
    Share2, 
    Pencil, 
    GripVertical,
} from "lucide-react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/dialog"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { supabase } from "@/lib/supabase"

export function SetlistDetailPage() {
    const { addToast } = useToast()
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [list, setList] = useState<Setlist | undefined>(undefined)
    const [isSharing, setIsSharing] = useState(false)
    
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [newName, setNewName] = useState("")

    useEffect(() => {
        if (id) {
            const found = setlistStorage.getById(id)
            if (found) {
                setList(found)
                setNewName(found.nome)
            } else {
                navigate('/repertorios')
            }
        }
    }, [id, navigate])

    const handleRemoveSong = (e: React.MouseEvent, songId: number) => {
        e.stopPropagation()
        if (!list) return
        setlistStorage.removeSong(list.id, songId)
        setList(setlistStorage.getById(list.id))
        addToast("Música removida", "success")
    }

    const handleRename = () => {
        if (!list || !newName.trim()) return
        setlistStorage.update(list.id, { nome: newName })
        setList({ ...list, nome: newName })
        setIsRenameOpen(false)
        addToast("Nome atualizado!", "success")
    }

    const onDragEnd = (result: any) => {
        if (!result.destination || !list) return

        const items = Array.from(list.musicas)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setList({ ...list, musicas: items })
        setlistStorage.reorderSongs(list.id, items)
    }

    const handleShare = async () => {
        if (!list) return
        setIsSharing(true)
        try {
            const { data, error } = await supabase
                .from('compartilhamentos')
                .insert([{ titulo: list.nome, musica_ids: list.musicas.map(m => m.id) }])
                .select().single()

            if (error) throw error
            const shareUrl = `${window.location.origin}/importar/${data.id}`
            await navigator.clipboard.writeText(shareUrl)
            addToast("Link copiado! Envie para sua equipe.", "success")
        } catch (err) {
            addToast("Erro ao compartilhar", "error")
        } finally {
            setIsSharing(false)
        }
    }

    if (!list) return null

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 pt-24">
                <Link to="/repertorios" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 group">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 italic">
                                {list.nome}
                            </h1>
                            <button 
                                onClick={() => setIsRenameOpen(true)}
                                className="p-1 text-zinc-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-zinc-500 mt-1">{list.musicas.length} músicas no repertório</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={handleShare} disabled={isSharing}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartilhar
                        </Button>
                        <Button onClick={() => navigate(`/apresentacao/${list.id}`)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Apresentação
                        </Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    {list.musicas.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-zinc-500">Nenhuma música adicionada ainda.</p>
                            <Button variant="link" onClick={() => navigate('/musicas')}>Procurar músicas</Button>
                        </div>
                    ) : (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="songs">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {list.musicas.map((song, index) => (
                                            <Draggable key={song.id} draggableId={song.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className="relative group flex items-center bg-white dark:bg-zinc-900"
                                                    >
                                                        <div {...provided.dragHandleProps} className="px-3 text-zinc-300 hover:text-zinc-500">
                                                            <GripVertical className="w-5 h-5" />
                                                        </div>

                                                        <div className="flex-1">
                                                            <SongListItem
                                                                title={song.titulo}
                                                                artist={song.artista}
                                                                category={song.categoria}
                                                                numero={song.numero_cantai}
                                                                onClick={() => navigate(`/musica/${song.id}`)}
                                                            />
                                                        </div>

                                                        <button
                                                            onClick={(e) => handleRemoveSong(e, song.id)}
                                                            className="mr-4 p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>
            </main>

            {/* Modal para Renomear */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Renomear Repertório</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nome do repertório"
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>Cancelar</Button>
                        <Button onClick={handleRename}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}