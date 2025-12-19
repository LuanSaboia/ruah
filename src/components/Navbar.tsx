import { Link, useNavigate } from "react-router-dom"
import { SearchCommand } from "./SearchCommand"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { 
  Menu, 
  Home, 
  ListMusic, 
  Mic2, 
  Music2, 
  Users, 
  LayoutList, 
  Heart, 
  LogIn, 
  LogOut, 
  User, 
  Loader2,
  Lock
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "@/lib/useTheme"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext" // <--- Usando nosso contexto novo
import { useToast } from "@/lib/useToast"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const { user, signOut } = useAuth() // <--- Pega o usuário do contexto global
  const { addToast } = useToast()

  // Estados do Login Modal
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
      addToast("Erro ao entrar: " + error.message, "error")
      setLoading(false)
    } else {
      addToast("Bem-vindo de volta!", "success")
      setIsLoginOpen(false) // Fecha o modal
      setLoading(false)
      // Não precisa navigate, o AuthContext atualiza a tela sozinho
    }
  }

  const handleLogout = async () => {
    await signOut()
    addToast("Você saiu da conta.", "info")
    navigate("/")
  }

  // Pega as iniciais para o Avatar
  const getInitials = () => {
    if (!user) return "U"
    // Tenta pegar do metadata, ou usa o email
    const name = user.user_metadata?.full_name || user.email || "U"
    return name.substring(0, 2).toUpperCase()
  }

  // Verifica se é admin (regra simples por email por enquanto)
  const isAdmin = user?.email === "seu_email_admin@gmail.com" // Troque pelo seu email real

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* --- MENU MOBILE (Mantido igual) --- */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-white">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Music2 className="w-5 h-5" />
                  </div>
                  Ruah
                </Link>
                
                <div className="flex flex-col gap-2">
                  <Link to="/" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Home className="w-5 h-5" /> Início
                  </Link>
                  <Link to="/musicas" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <ListMusic className="w-5 h-5" /> Músicas
                  </Link>
                  <Link to="/artistas" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Mic2 className="w-5 h-5" /> Artistas
                  </Link>
                  <Link to="/repertorios" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <LayoutList className="w-5 h-5" /> Repertórios
                  </Link>
                  <Link to="/afinador" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Music2 className="w-5 h-5" /> Afinador
                  </Link>
                  <Link to="/contribuir" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Users className="w-5 h-5" /> Contribuir
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-white mr-auto md:mr-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Music2 className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline">Ruah</span>
        </Link>

        {/* --- LINKS DESKTOP (Mantido igual) --- */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link to="/musicas" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Músicas</Link>
          <Link to="/artistas" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Artistas</Link>
          <Link to="/categorias" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Categorias</Link>
          <Link to="/repertorios" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Repertórios</Link>
        </div>

        {/* --- DIREITA (Busca + User) --- */}
        <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block w-64 lg:w-80">
                <SearchCommand />
            </div>
            
            <div className="md:hidden">
                <SearchCommand iconOnly />
            </div>

            {user ? (
                // --- USUÁRIO LOGADO (DROPDOWN) ---
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                           {getInitials()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span>{user.user_metadata?.full_name || "Minha Conta"}</span>
                                <span className="text-xs font-normal text-zinc-500">{user.email}</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {/* LINK EXTRA PARA ADMIN */}
                        {isAdmin && (
                           <>
                             <DropdownMenuItem onClick={() => navigate('/admin-dashboard')} className="cursor-pointer bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 focus:bg-red-100 dark:focus:bg-red-900/40">
                                <Lock className="w-4 h-4 mr-2" /> Painel Admin
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                           </>
                        )}

                        <DropdownMenuItem onClick={() => navigate('/repertorios')} className="cursor-pointer">
                            <ListMusic className="w-4 h-4 mr-2" /> Meus Repertórios
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/salvas')} className="cursor-pointer">
                            <Heart className="w-4 h-4 mr-2" /> Favoritos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="w-4 h-4 mr-2" /> Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                // --- USUÁRIO DESLOGADO (MODAL NO BOTÃO) ---
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-full px-4">
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Entrar</span>
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                          <LogIn className="w-6 h-6" />
                        </div>
                        Acesse sua conta
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Entre para sincronizar seus repertórios e acessar recursos exclusivos.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleLogin} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="seu@email.com" 
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="******" 
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Entrar"}
                      </Button>
                    </form>

                    <div className="text-center text-sm text-zinc-500">
                       Não tem uma conta?{" "}
                       <Link 
                         to="/registro" 
                         className="text-blue-600 hover:underline font-medium"
                         onClick={() => setIsLoginOpen(false)} // Fecha modal ao ir pro registro
                       >
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