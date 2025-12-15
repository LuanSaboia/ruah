import { useState } from "react"
import { Button } from "@/components/ui/button"
import { parseCifraLine, SCALE, getChordRoot } from "@/lib/chords"
import { getChordData } from "@/lib/chord-db"
import { ChordDiagram } from "./ChordDiagram"
import { useIsTouch } from "@/lib/use-is-touch"

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

// REMOVIDOS OS IMPORTS DO SELECT (Não precisamos mais)

interface CifraDisplayProps {
  content: string;
}

export function CifraDisplay({ content }: CifraDisplayProps) {
  const [semitones, setSemitones] = useState(0)
  const [fontSize, setFontSize] = useState(16)
  const isTouch = useIsTouch()

  const lines = content.split('\n');

  // 1. Descobre o acorde original base
  const firstChordRaw = parseCifraLine(content, 0).find(s => s.chord)?.chord || "C";
  const { root: originalRoot, suffix: originalSuffix } = getChordRoot(firstChordRaw);
  
  // 2. Calcula qual é o tom ATUAL
  const currentKey = parseCifraLine(`[${firstChordRaw}]`, semitones)[0].chord;

  // Função que troca o tom ao clicar no botão
  const handleKeyChange = (newKeyFull: string) => {
    const { root: newRoot } = getChordRoot(newKeyFull);
    
    if (originalRoot && newRoot) {
        const oldIndex = SCALE.indexOf(originalRoot);
        const newIndex = SCALE.indexOf(newRoot);
        
        // Calcula a distância direta e circular
        let diff = newIndex - oldIndex;
        // Ajuste para garantir o caminho mais curto (opcional, mas fica melhor)
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
    <div className="space-y-4 select-none">
      
      {/* Barra de Controle */}
      <div className="flex flex-col gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 sticky top-16 z-10 shadow-sm backdrop-blur-sm">
        
        {/* LINHA 1: Controles Principais */}
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tom & Texto</span>
             
            {/* Tamanho Texto */}
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 p-1 rounded-lg border dark:border-zinc-700">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFontSize(s => Math.max(12, s - 2))}><span className="text-xs font-bold">A-</span></Button>
                <span className="text-xs font-mono w-6 text-center">{fontSize}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFontSize(s => Math.min(32, s + 2))}><span className="text-sm font-bold">A+</span></Button>
            </div>
        </div>

        {/* LINHA 2: SELETOR DE TOM HORIZONTAL (Estilo Cifra Club) */}
        <div className="w-full overflow-x-auto pb-1 -mb-1 scrollbar-hide"> {/* Container com rolagem */}
            <div className="flex items-center gap-2">
                {SCALE.map((note) => {
                    // Constrói o nome da opção (ex: C + m7 = Cm7)
                    const optionLabel = note + originalSuffix;
                    // Verifica se essa é a opção ativa no momento
                    const isActive = optionLabel === currentKey;

                    return (
                        <button
                            key={note}
                            onClick={() => handleKeyChange(optionLabel)}
                            className={`
                                px-3 py-1.5 rounded-full font-bold text-sm whitespace-nowrap transition-all
                                ${isActive
                                    ? "bg-blue-600 text-white shadow-md scale-105" // Estilo Ativo (Azulão)
                                    : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-700" // Estilo Inativo
                                }
                            `}
                        >
                            {optionLabel}
                        </button>
                    )
                })}
            </div>
        </div>
      </div>

      {/* ÁREA DA CIFRA (Inalterada) */}
      <div 
        className="font-mono text-zinc-800 dark:text-zinc-300 overflow-x-auto pb-20 pt-4 px-1"
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