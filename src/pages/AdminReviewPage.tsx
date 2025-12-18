import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, User, Edit2, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { useToast } from "@/lib/useToast"
import { CATEGORIAS_DISPONIVEIS } from "@/constants/categories"

interface Sugestao {
    id: number;
    titulo: string;
    artista: string;
    letra: string;
    cifra: string;
    categoria: string[] | string;
    numero_cantai: number | null;
    link_audio: string;
    enviado_por: string;
    musica_id: number | null;
    created_at: string;
}

export function AdminReviewPage() {
  const [suggestions, setSuggestions] = useState<Sugestao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSuggestions() }, [])

  async function fetchSuggestions() {
    const { data, error } = await supabase
      .from('sugestoes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setSuggestions(data || [])
    setLoading(false)
  }

  // Remove da lista local após ação
  const removeSuggestion = (id: number) => {
    setSuggestions(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
           Revisão de Sugestões
           <Badge className="bg-blue-600">{suggestions.length}</Badge>
        </h1>

        {loading ? (
           <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
        ) : suggestions.length === 0 ? (
           <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
               <p className="text-zinc-500">Nenhuma sugestão pendente.</p>
           </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map(sug => (
              <div key={sug.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center shadow-sm hover:border-blue-300 transition-colors">
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
                   <ReviewModal 
                      suggestion={sug} 
                      onActionComplete={() => removeSuggestion(sug.id)} 
                    />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// --- O MODAL DE REVISÃO E EDIÇÃO ---
function ReviewModal({ suggestion, onActionComplete }: { suggestion: Sugestao, onActionComplete: () => void }) {
    const { addToast } = useToast()
    const [open, setOpen] = useState(false)
    const [processing, setProcessing] = useState(false)

    // Form State (inicializado com os dados da sugestão)
    const [form, setForm] = useState({
        titulo: suggestion.titulo,
        artista: suggestion.artista,
        cifra: suggestion.cifra, // Conteúdo completo (letra + acordes)
        categorias: Array.isArray(suggestion.categoria) 
            ? suggestion.categoria 
            : [suggestion.categoria || "Geral"]
    })

    const toggleCategoria = (cat: string) => {
        setForm(prev => {
            const exists = prev.categorias.includes(cat)
            if (exists) return { ...prev, categorias: prev.categorias.filter(c => c !== cat) }
            return { ...prev, categorias: [...prev.categorias, cat] }
        })
    }

    const handleApprove = async () => {
        setProcessing(true)
        try {
            // Prepara os dados FINAIS (editados)
            const finalData = {
                titulo: form.titulo,
                artista: form.artista,
                cifra: form.cifra,
                letra: form.cifra.replace(/\[.*?\]/g, ""), // Limpa a letra automaticamente
                categoria: form.categorias,
                revisado_por: "Admin" // Ou pegar nome do admin logado
            }

            if (suggestion.musica_id) {
                // UPDATE
                const { error } = await supabase
                    .from('musicas')
                    .update({ ...finalData, revisado_por: suggestion.enviado_por }) // Mantém crédito original se quiser
                    .eq('id', suggestion.musica_id)
                if (error) throw error
            } else {
                // INSERT
                const { error } = await supabase
                    .from('musicas')
                    .insert([{
                        ...finalData,
                        enviado_por: suggestion.enviado_por,
                        bpm: 0,
                        tom_original: ""
                    }])
                if (error) throw error
            }

            // Deleta sugestão
            await supabase.from('sugestoes').delete().eq('id', suggestion.id)
            
            addToast("Aprovado com sucesso!", "success")
            setOpen(false)
            onActionComplete()

        } catch (error: any) {
            addToast("Erro ao aprovar: " + error.message, "error")
        } finally {
            setProcessing(false)
        }
    }

    const handleReject = async () => {
        if (!confirm("Tem certeza que deseja rejeitar?")) return
        setProcessing(true)
        try {
            await supabase.from('sugestoes').delete().eq('id', suggestion.id)
            addToast("Sugestão rejeitada.", "info")
            setOpen(false)
            onActionComplete()
        } catch (error) {
            addToast("Erro ao rejeitar.", "error")
        } finally {
            setProcessing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                    <Edit2 className="w-4 h-4 mr-2" /> Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Revisar Sugestão</DialogTitle>
                    <DialogDescription>
                        Faça as alterações necessárias antes de aprovar.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Campos de Título e Artista */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input 
                                value={form.titulo} 
                                onChange={e => setForm({...form, titulo: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Artista</Label>
                            <Input 
                                value={form.artista} 
                                onChange={e => setForm({...form, artista: e.target.value})} 
                            />
                        </div>
                    </div>

                    {/* Editor de Categorias */}
                    <div className="space-y-2">
                        <Label>Categorias</Label>
                        <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 max-h-32 overflow-y-auto">
                            {CATEGORIAS_DISPONIVEIS.map(cat => (
                                <div key={cat} className="flex items-center space-x-2 bg-white dark:bg-zinc-800 px-2 py-1 rounded border border-zinc-100 dark:border-zinc-700">
                                    <Checkbox 
                                        id={`modal-${cat}`}
                                        checked={form.categorias.includes(cat)}
                                        onCheckedChange={() => toggleCategoria(cat)}
                                    />
                                    <label htmlFor={`modal-${cat}`} className="text-xs cursor-pointer select-none">
                                        {cat}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Editor de Cifra/Letra */}
                    <div className="space-y-2">
                        <Label>Conteúdo (Cifra)</Label>
                        <Textarea 
                            className="font-mono text-sm min-h-[300px]"
                            value={form.cifra}
                            onChange={e => setForm({...form, cifra: e.target.value})}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="destructive" onClick={handleReject} disabled={processing}>
                        <X className="w-4 h-4 mr-2" /> Rejeitar
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove} disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                        Aprovar Edição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}