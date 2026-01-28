import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { setlistStorage } from "@/lib/setlist-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Download, X } from "lucide-react"
import { useToast } from "@/lib/useToast"

export function ImportPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [sharedData, setSharedData] = useState<any>(null)

    useEffect(() => {
        const fetchShared = async () => {
            try {
                const { data, error } = await supabase
                    .from('compartilhamentos')
                    .select('*')
                    .eq('id', id)
                    .single()
                
                if (error || !data) throw new Error("Link inválido")

                // Busca os detalhes das músicas para salvar localmente com tudo preenchido
                const { data: songs } = await supabase
                    .from('musicas')
                    .select('*')
                    .in('id', data.musica_ids)
                
                setSharedData({ ...data, musicas_completas: songs })
            } catch (err) {
                addToast("Link de compartilhamento expirado ou inválido.", "error")
                navigate('/')
            } finally {
                setLoading(false)
            }
        }
        fetchShared()
    }, [id, navigate, addToast])

    const handleImport = () => {
        if (!sharedData) return

        const newList = setlistStorage.create(sharedData.titulo)
        sharedData.musicas_completas.forEach((song: any) => {
            setlistStorage.addSong(newList.id, song)
        })

        addToast("Repertório baixado com sucesso!", "success")        
        navigate('/repertorios')
    }

    const handleCancel = () => {
        navigate('/')
    }

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-zinc-500 animate-pulse">Carregando repertório compartilhado...</p>
            </div>
        )
    }

    return (
        <Dialog open={true} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-600" />
                        Importar Repertório
                    </DialogTitle>
                </DialogHeader>
                
                <div className="py-6">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Você recebeu o repertório <strong className="text-zinc-900 dark:text-white">"{sharedData?.titulo}"</strong>. 
                        <br /><br />
                        Deseja baixar estas <span className="font-bold">{sharedData?.musica_ids.length} músicas</span> para o seu dispositivo?
                    </p>
                </div>

                <DialogFooter className="flex flex-row gap-2 sm:justify-end">
                    <Button 
                        variant="ghost" 
                        onClick={handleCancel}
                        className="flex-1 sm:flex-none gap-2"
                    >
                        <X className="w-4 h-4" /> Agora não
                    </Button>
                    <Button 
                        onClick={handleImport} 
                        className="flex-1 sm:flex-none gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Download className="w-4 h-4" /> Sim, baixar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}