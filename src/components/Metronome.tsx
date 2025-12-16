import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Square, Timer } from "lucide-react"

export function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(80)
  const timerRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playClick = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 1000 
    gain.gain.value = 1
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.stop(ctx.currentTime + 0.1)
  }

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000
      timerRef.current = window.setInterval(() => { playClick() }, interval)
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [isPlaying, bpm])

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 pr-3 rounded-md h-10 w-full max-w-sm">
        <Button 
            size="icon"
            variant={isPlaying ? "destructive" : "ghost"}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`h-8 w-8 shrink-0 rounded-sm ${isPlaying ? '' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'}`}
        >
            {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
        </Button>

        <div className="flex-1 flex flex-col justify-center gap-0.5">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Timer className="w-3 h-3"/> {bpm} BPM
                </span>
            </div>
            <Slider 
                value={[bpm]} 
                onValueChange={(v) => setBpm(v[0])} 
                min={40} max={200} step={1} 
                className="cursor-pointer py-1"
            />
        </div>
    </div>
  )
}