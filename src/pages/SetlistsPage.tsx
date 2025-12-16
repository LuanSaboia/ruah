import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Plus, FolderOpen, Calendar, Trash2, ListMusic } from "lucide-react"
import { setlistStorage } from "@/lib/setlist-storage"
import type { Setlist } from "@/types"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function SetlistsPage() {
  const [lists, setLists] = useState<Setlist[]>([])
  const [newListName, setNewListName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = () => {
    setLists(setlistStorage.getAll())
  }

  const handleCreate = () => {
    if (!newListName.trim()) return
    setlistStorage.create(newListName)
    setNewListName("")
    setIsDialogOpen(false)
    loadLists()
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm("Tem certeza que deseja apagar este repertório?")) {
      setlistStorage.delete(id)
      loadLists()
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <ListMusic className="w-8 h-8 text-purple-600" />
                    Meus Repertórios
                </h1>
                <p className="text-zinc-500 mt-1">Organize suas músicas para missas e eventos.</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                        <Plus className="w-4 h-4" /> Novo
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar Novo Repertório</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome do Repertório</label>
                            <Input 
                                placeholder="Ex: Missa Domingo 18h" 
                                value={newListName}
                                onChange={e => setNewListName(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleCreate} className="w-full">Criar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

        {lists.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
                <FolderOpen className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Nenhum repertório criado</h3>
                <p className="text-zinc-500 max-w-xs mx-auto mt-2">Crie sua primeira lista para organizar as músicas da próxima celebração.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lists.map(list => (
                    <Card 
                        key={list.id} 
                        className="cursor-pointer hover:border-purple-500 transition-all group relative overflow-hidden"
                        onClick={() => navigate(`/repertorios/${list.id}`)}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex justify-between items-start">
                                {list.nome}
                                <button 
                                    onClick={(e) => handleDelete(e, list.id)}
                                    className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 text-xs">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(list.dataCriacao), "d 'de' MMMM", { locale: ptBR })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded">
                                <ListMusic className="w-4 h-4" />
                                <span className="font-bold">{list.musicas.length}</span> músicas
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </main>
    </div>
  )
}