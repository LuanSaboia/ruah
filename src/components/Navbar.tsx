import { Link, useNavigate } from "react-router-dom"
import { SearchCommand } from "./SearchCommand"
import { Button } from "./ui/button"
import {
  Menu,
  Home,
  ListMusic,
  Mic2,
  Music2,
  Users,
  LayoutList,
  Heart,
  PlusCircle,
  LogIn,
  LogOut,
  Moon,
  Sun,
  Settings,
  CalendarDays,
  Lock,
  Loader2
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/lib/useTheme"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/lib/useToast"
import { useState } from "react"
// IMPORTS CORRETOS (Usando os seus componentes da pasta UI para ter estilo)
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { addToast } = useToast()
  const isAdmin = user?.email === "admin@ruah.com"
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      addToast("Erro: " + error.message, "error")
      setLoading(false)
    } else {
      addToast("Bem-vindo de volta!", "success")
      addToast("Bem-vindo de volta!" + user?.email, "success")
      setLoading(false)
      setIsLoginOpen(false) // Fecha a janelinha
    }
  }

  // Função para deslogar
  const handleLogout = async () => {
    await signOut()
    addToast("Até logo!", "info")
    navigate("/")
  }

  const MenuLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <SheetClose asChild>
      <Link
        to={to}
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-md transition-all"
      >
        <Icon className="w-5 h-5" />
        {label}
      </Link>
    </SheetClose>
  )

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* --- LADO ESQUERDO: MENU LATERAL + LOGO --- */}
        <div className="flex items-center gap-3">

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] sm:w-[350px] pr-0">
              <SheetHeader className="px-4 text-left mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <img src="/ruah.svg" alt="Ruah Logo" className="w-8 h-8" />
                  <span className="font-bold text-xl">Ruah</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-full overflow-y-auto pb-20 scrollbar-hide">
                <div className="px-2 space-y-1">
                  <p className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-2">Principal</p>
                  <MenuLink to="/" icon={Home} label="Início" />
                  <MenuLink to="/repertorios" icon={ListMusic} label="Meus Repertórios" />
                  <MenuLink to="/liturgia" icon={CalendarDays} label="Gerador de Liturgia" />
                  <MenuLink to="/afinador" icon={Mic2} label="Afinador Online" />

                  <p className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-6">Explorar</p>
                  <MenuLink to="/artistas" icon={Users} label="Artistas" />
                  <MenuLink to="/categorias" icon={LayoutList} label="Categorias" />
                  <MenuLink to="/musicas" icon={Music2} label="Todas as Músicas" />

                  <p className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-6">Pessoal</p>
                  <MenuLink to="/salvas" icon={Heart} label="Músicas Favoritas" />
                  <MenuLink to="/contribuir" icon={PlusCircle} label="Enviar Cifra / Correção" />

                  {user && (
                    <>
                      <p className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-6">Admin</p>
                      <MenuLink to="/admin-dashboard" icon={Settings} label="Painel Administrativo" />
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* LOGO (Clicável para Home) */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/ruah.svg" alt="Ruah" className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white hidden sm:inline-block">Ruah</span>
          </Link>

        </div>

        {/* --- CENTRO: BARRA DE BUSCA --- */}
        <div className="flex-1 max-w-xl flex justify-center md:justify-end lg:justify-center">
          <SearchCommand />
        </div>

        {/* --- DIREITA: USUÁRIO E TEMA --- */}
        <div className="flex items-center gap-2">

          {/* TEMA (Sol/Lua) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-zinc-500 dark:text-zinc-400"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* MENU DO USUÁRIO (DROPDOWN) */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 font-bold">
                  {/* Pega as iniciais do nome ou e-mail */}
                  {user.user_metadata?.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <div className="px-2 py-1.5 text-xs text-zinc-500 break-all">
                  {user.email}
                </div>
                <DropdownMenuSeparator />

                {/* Link de Admin só aparece se for você */}
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin-dashboard')}>
                    <Lock className="w-4 h-4 mr-2" /> Painel Admin
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => navigate('/repertorios')}>
                  <ListMusic className="w-4 h-4 mr-2" /> Meus Repertórios
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-full px-4">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">Entrar no Ruah</DialogTitle>
                  <DialogDescription className="text-center">
                    Acesse sua conta para sincronizar seus repertórios.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Entrar"}
                  </Button>
                </form>

                <div className="text-center text-sm text-zinc-500">
                  Não tem uma conta?{" "}
                  <Link to="/registro" className="text-blue-600 hover:underline" onClick={() => setIsLoginOpen(false)}>
                    Criar conta grátis
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

      </div>
    </nav>
  )
}