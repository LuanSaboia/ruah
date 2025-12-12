import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, RefreshCw } from "lucide-react"
import { parseCifraLine } from "@/lib/chords"

interface CifraDisplayProps {
  content: string;
}

export function CifraDisplay({ content }: CifraDisplayProps) {
  const [semitones, setSemitones] = useState(0)
  const [fontSize, setFontSize] = useState(16)

  const lines = content.split('\n');

  return (
    <div className="space-y-4 select-none">
      
      {/* Barra de Controle */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 sticky top-16 z-10 shadow-sm">
        <div className="flex items-center gap-1 border-r border-zinc-300 dark:border-zinc-700 pr-3 mr-1">
            <span className="text-xs font-bold text-zinc-500 uppercase mr-1">Tom</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSemitones(s => s - 1)}><Minus className="w-3 h-3" /></Button>
            <span className="w-8 text-center font-mono font-bold text-blue-600 dark:text-blue-400">{semitones > 0 ? `+${semitones}` : semitones}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSemitones(s => s + 1)}><Plus className="w-3 h-3" /></Button>
            {semitones !== 0 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={() => setSemitones(0)}><RefreshCw className="w-3 h-3" /></Button>
            )}
        </div>
        <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-zinc-500 uppercase mr-1">Tamanho</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setFontSize(s => Math.max(12, s - 2))}><span className="text-xs">A-</span></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setFontSize(s => Math.min(32, s + 2))}><span className="text-lg">A+</span></Button>
        </div>
      </div>

      {/* AJUSTE AQUI: leading-[3rem] (Antes era 3.5rem) */}
      <div 
        className="font-mono text-zinc-800 dark:text-zinc-300 overflow-x-auto pb-20 pt-4 px-1"
        style={{ fontSize: `${fontSize}px` }}
      >
        {lines.map((line, i) => (
          <div key={i} className="flex flex-wrap items-end mb-2 min-h-[2.8em]">
             {parseCifraLine(line, semitones).map((seg, j) => (
                <div key={j} className="flex flex-col pr-0.5 group">
                   {seg.chord ? (
                     <span className="text-blue-600 dark:text-blue-400 font-bold mb-0.5 leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom-left">
                       {seg.chord}
                     </span>
                   ) : (
                     <span className="h-[1em] mb-0.5"></span>
                   )}
                   <span className="whitespace-pre leading-none">{seg.text}</span>
                </div>
             ))}
          </div>
        ))}
      </div>
    </div>
  )
}