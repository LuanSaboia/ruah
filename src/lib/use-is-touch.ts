import { useState, useEffect } from "react"

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Verifica se o dispositivo suporta toque (touch)
    const checkTouch = () => {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches)
    }
    
    checkTouch()
    window.addEventListener("resize", checkTouch)
    return () => window.removeEventListener("resize", checkTouch)
  }, [])

  return isTouch
}