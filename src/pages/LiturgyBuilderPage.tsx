import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Plus, Save, Search, CalendarDays, ChevronRight } from "lucide-react"
import { LITURGY_TEMPLATES, type LiturgyTemplate } from "@/constants/liturgy-templates"
import { supabase } from "@/lib/supabase"
import { setlistStorage } from "@/lib/setlist-storage"
import { useToast } from "@/lib/useToast"
import { useNavigate } from "react-router-dom"
import type { Musica } from "@/types"
import { CATEGORY_MAPPING } from "@/constants/categories"

export function LiturgyBuilderPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedTemplate, setSelectedTemplate] = useState<LiturgyTemplate | null>(null)
  const [liturgyName, setLiturgyName] = useState("")
  
  const [slots, setSlots] = useState<Record<string, Musica | null>>({})
  
  const [activeSlot, setActiveSlot] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [allSongs, setAllSongs] = useState<Musica[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadSongs() {
      const { data } = await supabase.from('musicas').select('*').order('titulo')
      if (data) setAllSongs(data)
    }
    loadSongs()
  }, [])

  const handleSelectTemplate = (template: LiturgyTemplate) => {
    setSelectedTemplate(template)
    const initialSlots: Record<string, null> = {}
    template.slots.forEach(s => initialSlots[s] = null)
    setSlots(initialSlots)
    
    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    setLiturgyName(`${template.name} - ${date}`)
    
    setStep(2)
  }

  const openSelectionModal = (slotName: string) => {
    setActiveSlot(slotName)
    setSearchTerm("") 
    setIsModalOpen(true)
  }

  const confirmSelection = (song: Musica) => {
    if (activeSlot) {
        setSlots(prev => ({ ...prev, [activeSlot]: song }))
        setIsModalOpen(false)
    }
  }

  const handleSaveSetlist = () => {
    if (!liturgyName.trim()) {
        addToast("Dê um nome para a liturgia!", "error")
        return
    }

    const newList = setlistStorage.create(liturgyName, selectedTemplate?.name)
    
    selectedTemplate?.slots.forEach(slot => {
        const song = slots[slot]
        if (song) {
            setlistStorage.addSong(newList.id, song)
        }
    })

    addToast("Repertório litúrgico criado com sucesso!", "success")
    navigate(`/repertorios/${newList.id}`)
  }

  const filteredSongs = allSongs.filter(song => {
    const matchesSearch = searchTerm === "" || 
        song.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artista.toLowerCase().includes(searchTerm.toLowerCase())

    if (searchTerm === "") {
        if (!activeSlot) return true
        
        const songCats = Array.isArray(song.categoria) ? song.categoria : [song.categoria]
        
        // Pega as categorias válidas para este slot (Ex: Slot "Santo" -> ["Santo"])
        const validCategories = CATEGORY_MAPPING[activeSlot] || [activeSlot]

        // Verifica match exato (Case Insensitive)
        const matchesCategory = songCats.some(c => 
            c && validCategories.some(valid => c.toLowerCase() === valid.toLowerCase())
        )

        return matchesCategory
    }

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-8 h-8 text-blue-600" />
                Gerador de Liturgia
            </h1>
            <p className="text-zinc-500 mt-1">
                {step === 1 ? "Escolha o tipo de celebração para começar." : "Preencha os momentos da celebração."}
            </p>
        </div>

        {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4">
                {LITURGY_TEMPLATES.map(template => (
                    <Card 
                        key={template.id} 
                        className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
                        onClick={() => handleSelectTemplate(template)}
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {template.name}
                                <ChevronRight className="text-zinc-300 group-hover:text-blue-500" />
                            </CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {template.slots.slice(0, 4).map(s => (
                                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                                ))}
                                {template.slots.length > 4 && <span className="text-xs text-zinc-400">+{template.slots.length - 4}</span>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}

        {step === 2 && selectedTemplate && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
                
                <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="w-full md:w-auto flex-1">
                        <label className="text-sm font-medium text-zinc-500 mb-1 block">Nome do Repertório</label>
                        <Input 
                            value={liturgyName} 
                            onChange={e => setLiturgyName(e.target.value)} 
                            className="text-lg font-bold"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" onClick={() => setStep(1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none" onClick={handleSaveSetlist}>
                            <Save className="w-4 h-4 mr-2" /> Salvar Repertório
                        </Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {selectedTemplate.slots.map((slot, index) => {
                            const selectedSong = slots[slot]
                            
                            return (
                                <div key={index} className="p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <div className="w-full sm:w-1/3 flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedSong ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{slot}</span>
                                    </div>

                                    <div className="w-full sm:flex-1">
                                        {selectedSong ? (
                                            <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                                <div>
                                                    <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{selectedSong.titulo}</p>
                                                    <p className="text-xs text-zinc-500">{selectedSong.artista}</p>
                                                </div>
                                                <Button size="sm" variant="ghost" onClick={() => openSelectionModal(slot)}>
                                                    Trocar
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button 
                                                variant="outline" 
                                                className="w-full border-dashed text-zinc-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                                                onClick={() => openSelectionModal(slot)}
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Selecionar música para {slot}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex flex-col gap-1">
                        <span>Selecionar: {activeSlot}</span>
                        <span className="text-xs font-normal text-zinc-500">
                            Filtro: {CATEGORY_MAPPING[activeSlot || ""] ? CATEGORY_MAPPING[activeSlot || ""].join(" ou ") : activeSlot}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="relative mb-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input 
                        placeholder={`Buscar música para ${activeSlot}...`} 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9"
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-1">
                    {filteredSongs.length === 0 ? (
                        <div className="text-center py-10 text-zinc-500">
                            {searchTerm ? "Nenhuma música encontrada." : `Nenhuma música encontrada na categoria "${activeSlot}".`}
                        </div>
                    ) : (
                        filteredSongs.map(song => (
                            <button
                                key={song.id}
                                onClick={() => confirmSelection(song)}
                                className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex items-center justify-between group transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{song.titulo}</p>
                                    <p className="text-xs text-zinc-500 flex gap-2 items-center">
                                        {song.artista}
                                        <span className="bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[10px]">
                                            {Array.isArray(song.categoria) ? song.categoria[0] : song.categoria}
                                        </span>
                                    </p>
                                </div>
                                <Check className="w-4 h-4 text-transparent group-hover:text-green-500" />
                            </button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}