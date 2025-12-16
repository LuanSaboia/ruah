import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export function ProtectedLayout() {
  const [session, setSession] = useState<boolean | null>(null)

  useEffect(() => {
    // Verifica sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session)
    })

    // Ouve mudanças (ex: logout em outra aba)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Mostra loading enquanto verifica o Supabase
  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // Se não tem sessão, manda pro Login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Se tem sessão, mostra o conteúdo
  return <Outlet />
}