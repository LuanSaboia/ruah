import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider" 
import { Play, Pause } from "lucide-react"

export function AutoScroll() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1) // 1 (Lento) a 5 (Rápido)

  useEffect(() => {
    let interval: any // ou NodeJS.Timeout se estiver num ambiente que suporte

    if (isPlaying) {
      // Quanto maior a velocidade, menor o delay (mais rápido)
      // Speed 1 = 50ms, Speed 5 = 10ms
      const delay = 60 - (speed * 10) 
      
      interval = setInterval(() => {
        // Se chegou no fim da página, para
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          setIsPlaying(false)
        } else {
          window.scrollBy(0, 1) // Desce 1 pixel por vez
        }
      }, delay)
    }

    return () => clearInterval(interval)
  }, [isPlaying, speed])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 animate-in slide-in-from-bottom-4">
      
      {/* Painel de Controle */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-xl flex flex-col gap-4 w-48">
        
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Rolagem</span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{speed}x</span>
        </div>
        
        {/* Slider do Shadcn */}
        <Slider 
          value={[speed]} 
          onValueChange={(vals) => setSpeed(vals[0])} 
          min={1} 
          max={5} 
          step={1}
          className="cursor-pointer"
        />

        <Button 
            size="sm" 
            onClick={() => setIsPlaying(!isPlaying)}
            className={isPlaying ? "bg-red-600 hover:bg-red-700 text-white w-full" : "bg-blue-600 hover:bg-blue-700 text-white w-full"}
        >
            {isPlaying ? (
                <><Pause className="w-4 h-4 mr-2" /> Parar</>
            ) : (
                <><Play className="w-4 h-4 mr-2" /> Iniciar</>
            )}
        </Button>
      </div>
    </div>
  )
}