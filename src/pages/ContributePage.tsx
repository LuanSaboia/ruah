import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { Send, Music2, User, Link as LinkIcon, Hash, CheckCircle } from "lucide-react"
import { CATEGORIAS_DISPONIVEIS } from "@/constants/categories"
import { useLocation } from "react-router-dom"
import { useToast } from "@/lib/useToast" 

export function ContributePage() {
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null) // MENSAGEM DE TOPO
  const { addToast } = useToast()
  
  const location = useLocation()
  const editingSong = location.state?.songToEdit

  const [form, setForm] = useState({
    titulo: "",
    artista: "",
    numero: "",
    link_audio: "",
    enviado_por: "",
    conteudo: "", 
    categorias: [] as string[],
    musica_id: null as number | null
  })

  useEffect(() => {
    if (editingSong) {
      setForm({
        titulo: editingSong.titulo,
        artista: editingSong.artista,
        numero: editingSong.numero_cantai ? String(editingSong.numero_cantai) : "",
        link_audio: editingSong.link_audio || "",
        enviado_por: "", 
        conteudo: editingSong.cifra || editingSong.letra,
        categorias: Array.isArray(editingSong.categoria) ? editingSong.categoria : [editingSong.categoria],
        musica_id: editingSong.id
      })
    }
  }, [editingSong])

  const toggleCategoria = (cat: string) => {
    setForm(prev => {
        const exists = prev.categorias.includes(cat)
        if (exists) return { ...prev, categorias: prev.categorias.filter(c => c !== cat) }
        return { ...prev, categorias: [...prev.categorias, cat] }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg(null)

    if (form.categorias.length === 0) setForm(prev => ({ ...prev, categorias: ["Geral"] }))

    const letraLimpa = form.conteudo.replace(/\[.*?\]/g, "")

    try {
      const { error } = await supabase.from('sugestoes').insert([{
        titulo: form.titulo,
        artista: form.artista,
        numero_cantai: form.numero ? parseInt(form.numero) : null,
        link_audio: form.link_audio,
        enviado_por: form.enviado_por || "Anônimo",
        letra: letraLimpa,
        cifra: form.conteudo,
        categoria: form.categorias.length > 0 ? form.categorias : ["Geral"],
        musica_id: form.musica_id
      }])

      if (error) throw error

      // FEEDBACK DUPLO: TOAST E MENSAGEM NO TOPO
      const msg = form.musica_id ? "Correção enviada para análise!" : "Sugestão enviada! Obrigado."
      addToast(msg, "success")
      setSuccessMsg(msg)

      if (!form.musica_id) {
          setForm({ titulo: "", artista: "", numero: "", link_audio: "", enviado_por: "", conteudo: "", categorias: [], musica_id: null })
      }
      
      // Rola para o topo onde a mensagem vai aparecer
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
    } catch (error: any) {
      addToast("Erro ao enviar. Tente novamente.", "error")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
         
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                <Music2 className="w-8 h-8 text-blue-600" />
                {editingSong ? "Corrigir Música" : "Enviar Cifra"}
            </h1>
            <p className="text-zinc-500 mt-2">
                {editingSong 
                    ? `Editando: ${editingSong.titulo} - ${editingSong.artista}`
                    : "Ajude a comunidade a crescer enviando novas músicas."}
            </p>
         </div>

         {/* --- MENSAGEM DE SUCESSO NO TOPO --- */}
         {successMsg && (
             <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
                 <CheckCircle className="w-5 h-5 text-green-600" />
                 <span className="font-medium">{successMsg}</span>
             </div>
         )}

         <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* DADOS BÁSICOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Título da Música</Label>
                        <Input 
                            required 
                            placeholder="Ex: Tão Sublime Sacramento" 
                            value={form.titulo} 
                            onChange={e => setForm({...form, titulo: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Artista / Banda</Label>
                        <Input 
                            required 
                            placeholder="Ex: Comunidade Shalom" 
                            value={form.artista} 
                            onChange={e => setForm({...form, artista: e.target.value})} 
                        />
                    </div>
                </div>

                {/* CATEGORIAS */}
                <div className="space-y-3">
                    <Label>Categorias (Selecione pelo menos uma)</Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                        {CATEGORIAS_DISPONIVEIS.map(cat => (
                            <div key={cat} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={cat} 
                                    checked={form.categorias.includes(cat)}
                                    onCheckedChange={() => toggleCategoria(cat)}
                                />
                                <label
                                    htmlFor={cat}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                                >
                                    {cat}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ÁREA DE TEXTO */}
                <div className="space-y-2">
                    <Label className="flex justify-between">
                        <span>Cifra / Letra</span>
                        <span className="text-xs text-zinc-400 font-normal">Use [ ] para acordes. Ex: [C]Aleluia</span>
                    </Label>
                    <Textarea 
                        required 
                        placeholder={`[C]       [Am]\nAleluia, Aleluia...`} 
                        className="font-mono h-64 text-sm"
                        value={form.conteudo}
                        onChange={e => setForm({...form, conteudo: e.target.value})}
                    />
                </div>

                {/* INFO EXTRA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Número Cantai (Opcional)</Label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                            <Input 
                                placeholder="Ex: 120" 
                                className="pl-9"
                                value={form.numero} 
                                onChange={e => setForm({...form, numero: e.target.value})} 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Link do Youtube (Opcional)</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                            <Input 
                                placeholder="https://..." 
                                className="pl-9"
                                value={form.link_audio} 
                                onChange={e => setForm({...form, link_audio: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>

                {/* BOTÃO DE ENVIAR */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                             <Label>Seu Nome (Opcional)</Label>
                             <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                <Input 
                                    placeholder={editingSong ? "Nome do Revisor..." : "Seu nome..."} 
                                    className="pl-9"
                                    value={form.enviado_por} 
                                    onChange={e => setForm({...form, enviado_por: e.target.value})} 
                                />
                             </div>
                         </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10" disabled={loading}>
                            {loading ? "Enviando..." : <><Send className="w-4 h-4 mr-2" /> Enviar {editingSong ? "Correção" : "Sugestão"}</>}
                        </Button>
                    </div>
                </div>

            </form>
        </div>
      </main>
    </div>
  )
}