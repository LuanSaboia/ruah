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
  User, 
  Moon, 
  Sun,
  Settings,
  CalendarDays
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
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
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
                        <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 w-9 h-9">
                            <User className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <div className="px-2 py-1.5 text-xs text-zinc-500 break-all">
                            {user.email}
                        </div>
                        <DropdownMenuSeparator />
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
                <Link to="/login">
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-full px-4">
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Entrar</span>
                    </Button>
                </Link>
            )}
        </div>

      </div>
    </nav>
  )
}