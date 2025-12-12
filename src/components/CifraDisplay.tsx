import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, RefreshCw } from "lucide-react"
import { parseCifraLine } from "@/lib/chords"
import { getChordData } from "@/lib/chord-db"
import { ChordDiagram } from "./ChordDiagram"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface CifraDisplayProps {
  content: string;
}

export function CifraDisplay({ content }: CifraDisplayProps) {
  const [semitones, setSemitones] = useState(0)
  const [fontSize, setFontSize] = useState(16) // Tamanho base um pouco maior

  const lines = content.split('\n');

  // Identifica o tom inicial (visual)
  const firstChord = parseCifraLine(content, 0).find(s => s.chord)?.chord || "?";
  const currentKey = parseCifraLine(`[${firstChord}]`, semitones)[0].chord;

  return (
    <div className="space-y-4 select-none">
      
      {/* Barra de Controle */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 sticky top-16 z-10 shadow-sm">
        
        {/* Tom */}
        <div className="flex items-center gap-1 border-r border-zinc-300 dark:border-zinc-700 pr-3 mr-1">
            <div className="flex flex-col mr-2">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Tom</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none">{currentKey}</span>
            </div>
            
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSemitones(s => s - 1)}>
                <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                {semitones > 0 ? `+${semitones}` : semitones}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSemitones(s => s + 1)}>
                <Plus className="w-3 h-3" />
            </Button>
            {semitones !== 0 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={() => setSemitones(0)}>
                    <RefreshCw className="w-3 h-3" />
                </Button>
            )}
        </div>

        {/* Tamanho Texto */}
        <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-zinc-500 uppercase mr-1 hidden sm:inline">Texto</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setFontSize(s => Math.max(12, s - 2))}><span className="text-xs">A-</span></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setFontSize(s => Math.min(32, s + 2))}><span className="text-lg">A+</span></Button>
        </div>
      </div>

      {/* ÁREA DA CIFRA 
          MUDANÇA: 'font-sans' em vez de 'font-mono' deixa a letra muito mais natural.
          tracking-wide ajuda na leitura.
      */}
      <div 
        className="font-sans font-medium tracking-wide text-zinc-800 dark:text-zinc-300 overflow-x-auto pb-20 pt-4 px-1"
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
      >
        {lines.map((line, i) => (
          <div key={i} className="flex flex-wrap items-end mb-6 min-h-[3em]">
             {parseCifraLine(line, semitones).map((seg, j) => (
                <div key={j} className="flex flex-col pr-0.5 group">
                   {/* Acorde */}
                   {seg.chord ? (
                     <HoverCard openDelay={0} closeDelay={0}>
                        <HoverCardTrigger asChild>
                            <span 
                                className="text-blue-600 dark:text-blue-400 font-bold mb-1 leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom-left touch-none min-w-[2ch]"
                                onTouchStart={(e) => e.stopPropagation()} 
                            >
                                {seg.chord}
                            </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto p-0 border-none bg-transparent shadow-xl z-50" side="top" sideOffset={5}>
                            {(() => {
                                const data = getChordData(seg.chord);
                                return data ? (
                                    <ChordDiagram name={seg.chord} frets={data.frets} barres={data.barres} />
                                ) : (
                                    <div className="bg-zinc-800 text-white p-2 rounded text-xs">Sem desenho</div>
                                )
                            })()}
                        </HoverCardContent>
                     </HoverCard>
                   ) : (
                     <span className="h-[1.2em] mb-1"></span>
                   )}
                   
                   {/* Texto da Letra */}
                   <span className="whitespace-pre leading-none text-zinc-700 dark:text-zinc-200">
                     {seg.text}
                   </span>
                </div>
             ))}
          </div>
        ))}
      </div>
    </div>
  )
}