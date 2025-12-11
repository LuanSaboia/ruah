import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { Send, CheckCircle2, AlertCircle } from "lucide-react"
import { CATEGORIAS_DISPONIVEIS } from "@/constants/categories"

export function ContributePage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)
  
  const [form, setForm] = useState({
    titulo: "",
    artista: "",
    numero: "",
    link_audio: "", // <--- Campo Novo
    enviado_por: "",
    letra: "",
    categorias: [] as string[]
  })

  const toggleCategoria = (categoria: string) => {
    setForm(prev => {
      const exists = prev.categorias.includes(categoria)
      if (exists) return { ...prev, categorias: prev.categorias.filter(c => c !== categoria) }
      return { ...prev, categorias: [...prev.categorias, categoria] }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    if (form.categorias.length === 0) {
      setForm(prev => ({ ...prev, categorias: ["Geral"] }))
    }

    try {
      const { error } = await supabase.from('sugestoes').insert([{
        titulo: form.titulo,
        artista: form.artista,
        numero_cantai: form.numero ? parseInt(form.numero) : null,
        link_audio: form.link_audio, // <--- Envia o link
        enviado_por: form.enviado_por || "Anônimo",
        letra: form.letra,
        categoria: form.categorias.length > 0 ? form.categorias : ["Geral"]
      }])

      if (error) throw error

      setStatus({ type: 'success', msg: "Sugestão enviada! Obrigado por contribuir." })
      setForm({ titulo: "", artista: "", numero: "", link_audio: "", enviado_por: "", letra: "", categorias: [] })
      
    } catch (error: any) {
      setStatus({ type: 'error', msg: "Erro ao enviar. Tente novamente." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Envie uma Sugestão</h1>
            <p className="text-zinc-500">Ajude a comunidade a crescer enviando músicas que faltam.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Linha 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Título da Música</Label>
                        <Input required placeholder="Ex: Kyrie Eleison" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Artista / Banda</Label>
                        <Input required placeholder="Ex: Shalom" value={form.artista} onChange={e => setForm({...form, artista: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Nº Cantai</Label>
                        <Input type="number" placeholder="000" value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} />
                    </div>
                </div>

                {/* Linha 2: Link de Áudio (NOVO) */}
                <div className="space-y-2">
                    <Label>Link para Ouvir (YouTube/Spotify) - Opcional</Label>
                    <Input 
                      placeholder="https://youtu.be/..." 
                      value={form.link_audio} 
                      onChange={e => setForm({...form, link_audio: e.target.value})} 
                    />
                </div>

                {/* Categorias */}
                <div className="space-y-3">
                    <Label>Categorias Sugeridas</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md dark:border-zinc-700">
                      {CATEGORIAS_DISPONIVEIS.map(cat => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox id={`sug-${cat}`} checked={form.categorias.includes(cat)} onCheckedChange={() => toggleCategoria(cat)} />
                          <label htmlFor={`sug-${cat}`} className="text-sm cursor-pointer">{cat}</label>
                        </div>
                      ))}
                    </div>
                </div>

                {/* Letra */}
                <div className="space-y-2">
                    <Label>Letra Completa</Label>
                    <Textarea required placeholder="Cole a letra aqui..." className="min-h-[200px]" value={form.letra} onChange={e => setForm({...form, letra: e.target.value})} />
                </div>

                {/* Nome do Contribuidor */}
                <div className="space-y-2">
                    <Label>Seu Nome (Opcional)</Label>
                    <Input placeholder="Para sabermos quem agradecer" value={form.enviado_por} onChange={e => setForm({...form, enviado_por: e.target.value})} />
                </div>

                {/* Feedback */}
                {status && (
                    <div className={`p-4 rounded-md flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                        {status.msg}
                    </div>
                )}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                    {loading ? "Enviando..." : <><Send className="w-4 h-4 mr-2" /> Enviar Sugestão</>}
                </Button>
            </form>
        </div>
      </main>
    </div>
  )
}