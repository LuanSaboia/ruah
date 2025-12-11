import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox" // Importe o Checkbox
import { supabase } from "@/lib/supabase"
import { Save, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import { useSearchParams, Link } from "react-router-dom"
import { CATEGORIAS_DISPONIVEIS } from "@/constants/categories"

export function AdminPage() {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id') // Pega o ID da URL se existir

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)
  
  // Estado do formulário
  const [form, setForm] = useState({
    titulo: "",
    artista: "",
    numero: "",
    link_audio: "",
    letra: "",
    categorias: [] as string[] // Agora é um Array
  })

  // Se for edição, carrega os dados
  useEffect(() => {
    if (editId) {
      async function fetchSong() {
        const { data } = await supabase.from('musicas').select('*').eq('id', editId).single()
        if (data) {
          setForm({
            titulo: data.titulo,
            artista: data.artista,
            numero: data.numero_cantai ? String(data.numero_cantai) : "",
            link_audio: data.link_audio || "",
            letra: data.letra,
            categorias: data.categoria || [] // Garante que seja array
          })
        }
      }
      fetchSong()
    }
  }, [editId])

  const toggleCategoria = (categoria: string) => {
    setForm(prev => {
      const exists = prev.categorias.includes(categoria)
      if (exists) {
        return { ...prev, categorias: prev.categorias.filter(c => c !== categoria) }
      } else {
        return { ...prev, categorias: [...prev.categorias, categoria] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const payload = {
      titulo: form.titulo,
      artista: form.artista,
      categoria: form.categorias, // Envia o array
      numero_cantai: form.numero ? parseInt(form.numero) : null,
      link_audio: form.link_audio,
      letra: form.letra
    }

    try {
      let error;
      
      if (editId) {
        // ATUALIZAR
        const res = await supabase.from('musicas').update(payload).eq('id', editId)
        error = res.error
      } else {
        // CRIAR NOVO
        const res = await supabase.from('musicas').insert([payload])
        error = res.error
      }

      if (error) throw error

      setStatus({ type: 'success', msg: editId ? "Música atualizada!" : "Música cadastrada!" })
      if (!editId) setForm({ ...form, titulo: "", numero: "", letra: "", categorias: [] }) 
      
    } catch (error: any) {
      setStatus({ type: 'error', msg: error.message || "Erro ao salvar." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {editId ? "Editar Música" : "Cadastro de Músicas"}
                </h1>
                <p className="text-zinc-500">Preencha os dados abaixo.</p>
            </div>
            <Link to="/admin-list">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Listar Músicas
              </Button>
            </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Título e Número */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 space-y-2">
                        <Label htmlFor="titulo">Título</Label>
                        <Input 
                            id="titulo" 
                            placeholder="Ex: Ressuscitou" 
                            required 
                            value={form.titulo} 
                            onChange={e => setForm({...form, titulo: e.target.value})} 
                        />
                    </div>
                    <div className="col-span-1 space-y-2">
                        <Label htmlFor="numero">Nº</Label>
                        <Input 
                            id="numero" type="number" 
                            value={form.numero} 
                            onChange={e => setForm({...form, numero: e.target.value})} 
                        />
                    </div>
                </div>

                {/* Artista */}
                <div className="space-y-2">
                    <Label htmlFor="artista">Artista</Label>
                    <Input 
                        id="artista" 
                        value={form.artista} 
                        onChange={e => setForm({...form, artista: e.target.value})} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="link">Link para Ouvir (YouTube/Spotify)</Label>
                    <Input 
                        id="link" 
                        placeholder="https://youtu.be/..." 
                        value={form.link_audio} 
                        onChange={e => setForm({...form, link_audio: e.target.value})} 
                    />
                </div>

                {/* Multiselect de Categorias */}
                <div className="space-y-3">
                    <Label>Categorias (Selecione uma ou mais)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-md border border-zinc-100 dark:border-zinc-800">
                      
                      {/* Usamos a constante importada para gerar a lista */}
                      {CATEGORIAS_DISPONIVEIS.map(cat => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox 
                            id={cat} 
                            checked={form.categorias.includes(cat)}
                            onCheckedChange={() => toggleCategoria(cat)}
                          />
                          <label htmlFor={cat} className="...">
                            {cat}
                          </label>
                        </div>
                      ))}
                      
                    </div>
                </div>

                {/* Letra */}
                <div className="space-y-2">
                    <Label htmlFor="letra">Letra</Label>
                    <Textarea 
                        id="letra" 
                        placeholder="Cole a letra..." 
                        className="min-h-[300px] font-mono text-sm"
                        required 
                        value={form.letra} 
                        onChange={e => setForm({...form, letra: e.target.value})} 
                    />
                </div>

                {/* Feedback */}
                {status && (
                    <div className={`p-4 rounded-md flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                        {status.msg}
                    </div>
                )}

                <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900" disabled={loading}>
                    {loading ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> {editId ? "Atualizar Música" : "Salvar Música"}</>}
                </Button>

            </form>
        </div>
      </main>
    </div>
  )
}