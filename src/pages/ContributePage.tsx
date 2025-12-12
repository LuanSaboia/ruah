import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { Send, CheckCircle2, AlertCircle, Music2, User, Link as LinkIcon, Hash } from "lucide-react"
import { CATEGORIAS_DISPONIVEIS } from "@/constants/categories"

export function ContributePage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)
  
  const [form, setForm] = useState({
    titulo: "",
    artista: "",
    numero: "",
    link_audio: "",
    enviado_por: "",
    conteudo: "", // Campo único
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

    if (form.categorias.length === 0) setForm(prev => ({ ...prev, categorias: ["Geral"] }))

    // Gera letra limpa automaticamente
    const letraLimpa = form.conteudo.replace(/\[.*?\]/g, "")

    try {
      const { error } = await supabase.from('sugestoes').insert([{
        titulo: form.titulo,
        artista: form.artista,
        numero_cantai: form.numero ? parseInt(form.numero) : null,
        link_audio: form.link_audio,
        enviado_por: form.enviado_por || "Anônimo",
        letra: letraLimpa,
        cifra: form.conteudo, // Salva o original como cifra
        categoria: form.categorias.length > 0 ? form.categorias : ["Geral"]
      }])

      if (error) throw error

      setStatus({ type: 'success', msg: "Sugestão enviada! Obrigado por contribuir." })
      setForm({ titulo: "", artista: "", numero: "", link_audio: "", enviado_por: "", conteudo: "", categorias: [] })
      window.scrollTo(0, 0)
      
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
        <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Contribua com o Ruah</h1>
            <p className="text-zinc-500 mt-2">Ajude a comunidade enviando músicas que ainda não temos.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider border-b pb-2 mb-4">Dados da Música</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Music2 className="w-4 h-4 text-blue-500"/> Título</Label>
                            <Input required placeholder="Ex: Kyrie Eleison" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><User className="w-4 h-4 text-purple-500"/> Artista / Banda</Label>
                            <Input required placeholder="Ex: Shalom, Suely" value={form.artista} onChange={e => setForm({...form, artista: e.target.value})} />
                            <p className="text-[11px] text-zinc-400">Para múltiplos artistas, separe por vírgula.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Hash className="w-4 h-4 text-zinc-400"/> Nº Cantai</Label>
                            <Input type="number" placeholder="000" value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} />
                            <p className="text-[11px] text-zinc-400">Opcional</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-red-500"/> Link YouTube/Spotify</Label>
                            <Input placeholder="https://..." value={form.link_audio} onChange={e => setForm({...form, link_audio: e.target.value})} />
                            <p className="text-[11px] text-zinc-400">Opcional</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Categorias</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800 max-h-48 overflow-y-auto">
                      {CATEGORIAS_DISPONIVEIS.map(cat => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox id={`sug-${cat}`} checked={form.categorias.includes(cat)} onCheckedChange={() => toggleCategoria(cat)} />
                          <label htmlFor={`sug-${cat}`} className="text-sm cursor-pointer select-none">{cat}</label>
                        </div>
                      ))}
                    </div>
                </div>

                {/* CAMPO ÚNICO */}
                <div className="space-y-2">
                    <Label htmlFor="conteudo" className="flex items-center gap-2">
                        Letra e Cifra
                    </Label>
                    <p className="text-xs text-zinc-500">
                        Para adicionar cifras, use colchetes no meio da letra. Ex: <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">[G]Aleluia</span>. Se não usar colchetes, será salvo apenas como letra.
                    </p>
                    <Textarea 
                        required 
                        placeholder="[G]Aleluia..." 
                        className="min-h-[250px] font-mono text-sm leading-relaxed p-4" 
                        value={form.conteudo} 
                        onChange={e => setForm({...form, conteudo: e.target.value})} 
                    />
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Seu Nome (Opcional)</Label>
                            <Input placeholder="Para os créditos..." value={form.enviado_por} onChange={e => setForm({...form, enviado_por: e.target.value})} />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10" disabled={loading}>
                            {loading ? "Enviando..." : <><Send className="w-4 h-4 mr-2" /> Enviar Sugestão</>}
                        </Button>
                    </div>
                </div>

                {status && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0"/> : <AlertCircle className="w-5 h-5 flex-shrink-0"/>}
                        <p className="font-medium">{status.msg}</p>
                    </div>
                )}

            </form>
        </div>
      </main>
    </div>
  )
}