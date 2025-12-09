import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus, Loader2, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AdminListPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  async function fetchSongs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('musicas')
      .select('id, titulo, artista, categoria')
      .order('id', { ascending: false })
    
    if (!error && data) setSongs(data)
    setLoading(false)
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from('musicas').delete().eq('id', id)
    if (!error) {
      setSongs(songs.filter(song => song.id !== id))
    } else {
      alert("Erro ao deletar")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Gerenciar Músicas</h1>
          <div className="flex gap-2">
             <Link to="/admin">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4" /> Nova Música
                </Button>
             </Link>
             <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" /> Sair
             </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {songs.map((song) => (
                <div key={song.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{song.titulo}</h3>
                    <p className="text-sm text-zinc-500">{song.artista}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Botão Editar */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => navigate(`/admin?id=${song.id}`)}
                    >
                      <Edit className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </Button>

                    {/* Botão Excluir com Confirmação */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. A música será apagada permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(song.id)} className="bg-red-600 hover:bg-red-700">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}