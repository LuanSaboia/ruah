import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Check, X, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

export function AdminReviewPage() {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSuggestions() }, [])

  async function fetchSuggestions() {
    setLoading(true)
    const { data } = await supabase.from('sugestoes').select('*').order('created_at', { ascending: false })
    if (data) setSuggestions(data)
    setLoading(false)
  }

  async function handleReject(id: number) {
    if(!confirm("Rejeitar e apagar esta sugestão?")) return
    await supabase.from('sugestoes').delete().eq('id', id)
    fetchSuggestions()
  }

  // Componente interno para o Modal de Aprovação/Edição
  function ReviewModal({ suggestion }: { suggestion: any }) {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ ...suggestion })
    const [saving, setSaving] = useState(false)

    const handleApprove = async () => {
      setSaving(true)
      // 1. Salva na tabela REAL (musicas)
      const { error } = await supabase.from('musicas').insert([{
        titulo: form.titulo,
        artista: form.artista,
        letra: form.letra,
        categoria: form.categoria || ["Geral"],
        numero_cantai: form.numero_cantai,
        enviado_por: suggestion.enviado_por
      }])

      if (!error) {
        // 2. Remove da tabela de SUGESTÕES
        await supabase.from('sugestoes').delete().eq('id', suggestion.id)
        setOpen(false)
        fetchSuggestions()
      } else {
        alert("Erro ao aprovar: " + error.message)
      }
      setSaving(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <Check className="w-4 h-4" /> Analisar
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisar Sugestão de {suggestion.enviado_por}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Título" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
              <Input placeholder="Artista" value={form.artista} onChange={e => setForm({...form, artista: e.target.value})} />
            </div>
            <Textarea 
              placeholder="Letra" 
              className="min-h-[300px] font-mono" 
              value={form.letra} 
              onChange={e => setForm({...form, letra: e.target.value})} 
            />
            <p className="text-sm text-zinc-500">Categorias: {Array.isArray(form.categoria) ? form.categoria.join(", ") : form.categoria}</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleApprove} disabled={saving} className="bg-blue-600">
              {saving ? "Salvando..." : "Aprovar e Publicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Análise de Sugestões</h1>

        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            {suggestions.length === 0 && <p className="text-zinc-500">Nenhuma sugestão pendente.</p>}
            
            {suggestions.map(sug => (
              <div key={sug.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div>
                  <h3 className="font-bold text-lg dark:text-zinc-100">{sug.titulo}</h3>
                  <p className="text-zinc-500 text-sm">{sug.artista} • <User className="w-3 h-3 inline"/> {sug.enviado_por}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="outline" className="text-red-500 hover:bg-red-50 flex-1 md:flex-none" onClick={() => handleReject(sug.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 md:flex-none">
                    <ReviewModal suggestion={sug} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}