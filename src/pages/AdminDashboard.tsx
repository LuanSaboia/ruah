import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { LogOut, PlusCircle, CheckSquare, ListMusic } from "lucide-react"

export function AdminDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Painel Administrativo</h1>
                <p className="text-zinc-500">Bem-vindo de volta, Admin.</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            
            {/* Card 1: Análise de Sugestões (Destaque) */}
            <Card className="cursor-pointer hover:border-blue-500 transition-colors border-zinc-200 dark:border-zinc-800" onClick={() => navigate('/admin-analise')}>
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                        <CheckSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle>Analisar Sugestões</CardTitle>
                        <CardDescription>Aprovar ou rejeitar músicas enviadas.</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            {/* Card 2: Gerenciar Músicas */}
            <Card className="cursor-pointer hover:border-zinc-400 transition-colors border-zinc-200 dark:border-zinc-800" onClick={() => navigate('/admin-list')}>
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                        <ListMusic className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle>Gerenciar Repertório</CardTitle>
                        <CardDescription>Ver, editar ou excluir músicas existentes.</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            {/* Card 3: Cadastrar Nova */}
            <Card className="cursor-pointer hover:border-zinc-400 transition-colors border-zinc-200 dark:border-zinc-800" onClick={() => navigate('/admin')}>
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                        <PlusCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle>Cadastrar Música</CardTitle>
                        <CardDescription>Adicionar uma música manualmente.</CardDescription>
                    </div>
                </CardHeader>
            </Card>

        </div>
      </main>
    </div>
  )
}