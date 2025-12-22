import { useEffect, useRef, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
// Trocamos autoCorrelate por detectPitch
import { detectPitch, getNote, getNoteString, getCents } from "@/lib/tuner"
import { useToast } from "@/lib/useToast"

export function TunerPage() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState<string>("--")
  const [cents, setCents] = useState<number>(0)
  const { addToast } = useToast()
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const rafIdRef = useRef<number | null>(null)

  const startTuner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 2048
      source.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      sourceRef.current = source
      
      setIsListening(true)
      updatePitch()
    } catch (err) {
      console.error("Erro ao acessar microfone", err)
      addToast("Erro: Precisamos da permissão do microfone.", "error")
    }
  }

  const stopTuner = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    if (sourceRef.current) sourceRef.current.disconnect()
    if (analyserRef.current) analyserRef.current.disconnect()
    if (audioContextRef.current) audioContextRef.current.close()
    
    setIsListening(false)
    setNote("--")
    setCents(0)
  }

  const updatePitch = () => {
    // Verificamos se os refs existem
    if (!analyserRef.current || !audioContextRef.current) return

    const buffer = new Float32Array(analyserRef.current.fftSize)
    analyserRef.current.getFloatTimeDomainData(buffer)
    
    // Correção: usamos detectPitch e acessamos o sampleRate através do .current
    const frequency = detectPitch(buffer, audioContextRef.current.sampleRate)

    if (frequency !== -1) {
      const noteNum = getNote(frequency)
      const noteName = getNoteString(noteNum)
      const detune = getCents(frequency, noteNum)
      
      // Correção: nomes dos seus estados reais
      setNote(noteName)
      setCents(detune)
    }

    rafIdRef.current = requestAnimationFrame(updatePitch)
  }

  useEffect(() => {
    return () => stopTuner()
  }, [])

  const getColor = () => {
    if (Math.abs(cents) < 5) return "text-green-500" // Afinado
    if (Math.abs(cents) < 20) return "text-yellow-500" // Quase
    return "text-red-500" // Desafinado
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 dark:text-white">Afinador</h1>
            <p className="text-zinc-500">Toque uma corda para começar</p>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center rounded-full border-4 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl mb-8">
            <div className="text-center">
                <span className={`text-8xl font-black ${isListening ? getColor() : 'text-zinc-300'}`}>
                    {note}
                </span>
                {isListening && (
                    <div className="mt-2 text-lg font-mono font-bold text-zinc-400">
                        {cents > 0 ? `+${cents}` : cents}
                    </div>
                )}
            </div>
            
            {/* Ponteiro Visual */}
            {isListening && (
                <div 
                    className="absolute w-1 h-8 bg-zinc-800 dark:bg-white rounded-full transition-transform duration-100 origin-bottom"
                    style={{ 
                        bottom: '10px', 
                        height: '100%',
                        width: '2px',
                        backgroundColor: 'transparent',
                        transform: `rotate(${cents * 2}deg)` 
                    }}
                >
                    <div className={`w-4 h-4 rounded-full mx-auto mt-2 ${getColor()} bg-current`} />
                </div>
            )}
        </div>

        <Button 
            size="lg" 
            className={`gap-2 text-lg px-8 h-14 ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
            onClick={isListening ? stopTuner : startTuner}
        >
            {isListening ? <><MicOff /> Parar</> : <><Mic /> Ativar Microfone</>}
        </Button>

      </main>
    </div>
  )
}