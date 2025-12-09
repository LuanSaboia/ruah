import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Tenta pegar do localStorage ou usa 'light' como padrão
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light"
    }
    return "light"
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme }
}