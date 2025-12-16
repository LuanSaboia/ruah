import { useState } from "react"
import { Button } from "@/components/ui/button"
import { parseCifraLine, SCALE, getChordRoot } from "@/lib/chords"
import { getChordData } from "@/lib/chord-db"
import { ChordDiagram } from "./ChordDiagram"
import { useIsTouch } from "@/lib/use-is-touch"
import { Metronome } from "./Metronome"
import { Minus, Plus, Music2 } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CifraDisplayProps {
  content: string;
}

export function CifraDisplay({ content }: CifraDisplayProps) {
  const [semitones, setSemitones] = useState(0)
  const [fontSize, setFontSize] = useState(16)
  const isTouch = useIsTouch()

  const lines = content.split('\n');

  // Lógica de Tons
  const firstChordRaw = parseCifraLine(content, 0).find(s => s.chord)?.chord || "C";
  const { root: originalRoot, suffix: originalSuffix } = getChordRoot(firstChordRaw);
  const currentKey = parseCifraLine(`[${firstChordRaw}]`, semitones)[0].chord;

  const handleKeyChange = (newKeyFull: string) => {
    const { root: newRoot } = getChordRoot(newKeyFull);
    if (originalRoot && newRoot) {
        const oldIndex = SCALE.indexOf(originalRoot);
        const newIndex = SCALE.indexOf(newRoot);
        let diff = newIndex - oldIndex;
        if (diff > 6) diff -= 12;
        if (diff < -6) diff += 12;
        setSemitones(diff);
    }
  };

  const renderChordContent = (chordName: string) => {
    const data = getChordData(chordName);
    return data ? (
        <ChordDiagram name={chordName} frets={data.frets} barres={data.barres} />
    ) : (
        <div className="bg-zinc-800 text-white p-2 rounded text-xs">Sem desenho</div>
    );
  };

  return (
    <div className="relative min-h-[50vh]">
      
      {/* --- HEADER DE CONTROLE (STICKY) --- */}
      <div className="sticky top-16 z-20 -mx-4 px-4 md:mx-0 md:px-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-all">
        
        <div className="flex flex-col">
            
            {/* SELETOR DE TOM */}
            <div className="w-full overflow-x-auto scrollbar-hide py-3 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-2 px-1">
                    <div className="flex items-center gap-1 mr-3 text-zinc-400 shrink-0">
                        <Music2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Tom</span>
                    </div>
                    
                    {SCALE.map((note) => {
                        const optionLabel = note + originalSuffix;
                        const isActive = optionLabel === currentKey;
                        return (
                            <button
                                key={note}
                                onClick={() => handleKeyChange(optionLabel)}
                                className={`
                                    h-8 px-4 rounded-full font-bold text-sm whitespace-nowrap transition-all border
                                    ${isActive
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                                        : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800"
                                    }
                                `}
                            >
                                {optionLabel}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* BARRA DE FERRAMENTAS (Metrônomo + Fonte) */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-1">
                
                {/* Lado Esquerdo: Metrônomo*/}
                <div className="flex-1 max-w-md">
                    <Metronome />
                </div>

                {/* Lado Direito: Controle de Fonte */}
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800 shrink-0 h-10">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-colors" 
                        onClick={() => setFontSize(s => Math.max(12, s - 2))}
                    >
                        <Minus className="w-4 h-4 text-zinc-500" />
                    </Button>
                    
                    <div className="w-8 text-center text-xs font-bold text-zinc-500 font-mono">
                        {fontSize}
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-colors" 
                        onClick={() => setFontSize(s => Math.min(36, s + 2))}
                    >
                        <Plus className="w-4 h-4 text-zinc-500" />
                    </Button>
                </div>

            </div>
        </div>
      </div>

      {/* --- ÁREA DA CIFRA --- */}
      <div 
        className="font-mono text-zinc-800 dark:text-zinc-300 overflow-x-auto pb-40 pt-8 px-1 select-none"
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
      >
        {lines.map((line, i) => (
          <div key={i} className="flex flex-wrap items-end mb-4 min-h-[3em] w-full">
             {parseCifraLine(line, semitones).map((seg, j) => (
                <div key={j} className="flex flex-col pr-0.5 group relative">
                   {seg.chord ? (
                     isTouch ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button type="button" className="text-blue-600 dark:text-blue-400 font-bold mb-1 leading-none cursor-pointer active:scale-95 transition-transform origin-bottom-left select-none touch-manipulation bg-transparent border-none p-0 m-0 text-left">
                                    {seg.chord}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-xl z-50" side="top" sideOffset={5}>
                                {renderChordContent(seg.chord)}
                            </PopoverContent>
                        </Popover>
                     ) : (
                        <HoverCard openDelay={0} closeDelay={0}>
                            <HoverCardTrigger asChild>
                                <button type="button" className="text-blue-600 dark:text-blue-400 font-bold mb-1 leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom-left select-none bg-transparent border-none p-0 m-0 text-left">
                                    {seg.chord}
                                </button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-auto p-0 border-none bg-transparent shadow-xl z-50" side="top" sideOffset={5}>
                                {renderChordContent(seg.chord)}
                            </HoverCardContent>
                        </HoverCard>
                     )
                   ) : (
                     <span className="h-[1.2em] mb-1 w-px"></span>
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