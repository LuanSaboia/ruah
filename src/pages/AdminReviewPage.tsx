import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

interface Sugestao {
    id: number;
    titulo: string;
    artista: string;
    letra: string;
    cifra: string;
    categoria: string[];
    numero_cantai: number | null;
    link_audio: string;
    enviado_por: string;
    musica_id: number | null;
    created_at: string;
}

export function AdminReviewPage() {
  const [suggestions, setSuggestions] = useState<Sugestao[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => { fetchSuggestions() }, [])

  async function fetchSuggestions() {
    setLoading(true)
    const { data, error } = await supabase
        .from('sugestoes')
        .select('*')
        .order('created_at', { ascending: false })
    
    if (error) {
        console.error("Erro ao buscar sugestões:", error)
    }

    if (data) setSuggestions(data as Sugestao[])
    setLoading(false)
  }

  async function handleReject(id: number) {
    if(!confirm("Rejeitar e apagar esta sugestão?")) return
    await supabase.from('sugestoes').delete().eq('id', id)
    fetchSuggestions()
  }

  const handleApprove = async (sugestao: Sugestao) => {
    setProcessing(sugestao.id)
    
    try {
      
      if (sugestao.musica_id && sugestao.musica_id > 0) {
        
        const { error } = await supabase
          .from('musicas')
          .update({
            titulo: sugestao.titulo,
            artista: sugestao.artista,
            letra: sugestao.letra,
            cifra: sugestao.cifra,
            categoria: sugestao.categoria,
            numero_cantai: sugestao.numero_cantai,
            link_audio: sugestao.link_audio,
            revisado_por: sugestao.enviado_por || "Anônimo" 
          })
          .eq('id', sugestao.musica_id)
        
        if (error) throw error

      } else {
        
        const { error } = await supabase.from('musicas').insert([{
            titulo: sugestao.titulo,
            artista: sugestao.artista,
            letra: sugestao.letra,
            cifra: sugestao.cifra,
            categoria: sugestao.categoria,
            numero_cantai: sugestao.numero_cantai,
            link_audio: sugestao.link_audio,
            enviado_por: sugestao.enviado_por || "Anônimo",
            revisado_por: null
        }])
        
        if (error) throw error
      }

      await supabase.from('sugestoes').delete().eq('id', sugestao.id)
      setSuggestions(prev => prev.filter(s => s.id !== sugestao.id))
      
    } catch (error: any) {
      alert(`Erro ao aprovar: ${error.message || error}`)
    } finally {
      setProcessing(null)
    }
}

  function ReviewModal({ suggestion }: { suggestion: Sugestao }) {
    const hasOriginalId = suggestion.musica_id && suggestion.musica_id > 0;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1 md:flex-none">
                    <Check className="w-4 h-4" /> Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {hasOriginalId ? (
                             <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                                Edição
                             </Badge>
                        ) : (
                             <Badge className="bg-green-100 text-green-800 border-green-200">Nova Música</Badge>
                        )}
                        <span>{suggestion.titulo}</span>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Título</Label>
                            <Input defaultValue={suggestion.titulo} readOnly className="bg-zinc-50" />
                        </div>
                        <div>
                            <Label>Artista</Label>
                            <Input defaultValue={suggestion.artista} readOnly className="bg-zinc-50" />
                        </div>
                    </div>
                    
                    <div>
                        <Label>Conteúdo</Label>
                        <Textarea defaultValue={suggestion.cifra || suggestion.letra} rows={10} readOnly className="font-mono text-xs bg-zinc-50" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-50 p-3 rounded border">
                        <User className="w-4 h-4" />
                        {hasOriginalId ? (
                             <span>Revisor: <strong>{suggestion.enviado_por || "Anônimo"}</strong></span>
                        ) : (
                             <span>Criador: <strong>{suggestion.enviado_por || "Anônimo"}</strong></span>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="destructive" onClick={() => handleReject(suggestion.id)}>
                        Rejeitar
                    </Button>
                    <Button 
                        onClick={() => handleApprove(suggestion)} 
                        disabled={processing === suggestion.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {processing === suggestion.id ? <Loader2 className="w-4 h-4 animate-spin"/> : (hasOriginalId ? "Confirmar Edição" : "Aprovar Criação")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
            Análise de Sugestões 
            <Badge variant="outline" className="ml-2">{suggestions.length}</Badge>
        </h1>

        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : (
          <div className="space-y-4">
            {suggestions.length === 0 && (
                <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500">
                    Nenhuma sugestão pendente.
                </div>
            )}
            
            {suggestions.map(sug => (
              <div key={sug.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                      {sug.musica_id ? (
                          <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100 text-[10px]">
                            Edição
                          </Badge>
                      ) : (
                          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 text-[10px]">
                            Nova
                          </Badge>
                      )}
                      <h3 className="font-bold text-lg dark:text-zinc-100">{sug.titulo}</h3>
                  </div>
                  <p className="text-zinc-500 text-sm flex items-center gap-2">
                      {sug.artista} 
                      <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                      <span className="flex items-center gap-1 text-xs">
                        <User className="w-3 h-3"/> {sug.enviado_por || "Anônimo"}
                      </span>
                  </p>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                   <ReviewModal suggestion={sug} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}