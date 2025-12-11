import { Link } from "react-router-dom"
import { SearchCommand } from "./SearchCommand"
import { Menu, Sun, Moon, Home, List, LogIn, Mic2, Music, PlusCircle } from "lucide-react"
import { useTheme } from "@/lib/useTheme"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center gap-4">
        
        {/* Lado Esquerdo: Menu Mobile (Sheet) + Logo */}
        <div className="flex items-center gap-3">
            
            {/* O MENU MOBILE COMEÇA AQUI */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="left" className="w-[300px] bg-white dark:bg-zinc-950 dark:border-zinc-800">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      Ruah
                      <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />
                    </SheetTitle>
                  </SheetHeader>
                  
                  {/* Links de Navegação Mobile */}
                  <div className="flex flex-col gap-2">
                    <MobileLink href="/" icon={Home}>Início</MobileLink>
                    <MobileLink href="/categorias" icon={List}>Categorias</MobileLink>
                    <MobileLink href="/artistas" icon={Mic2}>Artistas</MobileLink>
                    <MobileLink href="/musicas" icon={Music}>Músicas</MobileLink>
                    
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />
                    <MobileLink href="/contribuir" icon={PlusCircle}>Contribuir</MobileLink>

                    {/* Se estiver logado (ou se quiser deixar visível o link da análise) */}
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />
                    <MobileLink href="/admin" icon={LogIn}>Área Admin</MobileLink>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {/* FIM DO MENU MOBILE */}

            <Link to="/">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-pointer">
                  Ruah
              </h1>
            </Link>
        </div>

        {/* Centro: Busca (Visível em Desktop e Mobile reduzido) */}
        {/* Centro: Busca */}
        {/* Adicionei 'min-w-0' para permitir que o flexbox encolha esse item se apertar */}
        <div className="flex-1 max-w-lg mx-2 md:mx-4 min-w-0"> 
            <SearchCommand />
        </div>

        {/* Lado Direito: Ações Desktop */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Botão de Tema */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Links Desktop (Somente telas grandes) */}
          <div className="hidden md:flex items-center gap-6 ml-2">
             <Link to="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">Início</Link>
             <Link to="/categorias" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">Categorias</Link>
             <Link to="/artistas" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">Artistas</Link>
             <Link to="/musicas" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">Músicas</Link>
             <Link to="/contribuir">
                <Button variant="outline" size="sm" className="hidden md:flex gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                    <PlusCircle className="w-4 h-4" /> Contribuir
                </Button>
             </Link>
             <Link to="/admin-dashboard">
                <Button variant="outline" size="sm" className="hidden md:flex gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                    <LogIn className="w-4 h-4" /> Área Admin
                </Button>
             </Link>
             {/* <Link to="/musicas" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">Área Admin</Link> */}
          </div>

          {/* Avatar */}
          {/* <div className="hidden md:flex w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center border border-zinc-200 dark:border-zinc-700 cursor-pointer">
            <User className="w-4 h-4 text-zinc-400" />
          </div> */}
        </div>

      </div>
    </nav>
  )
}

// Pequeno componente auxiliar para os links do menu mobile ficarem padronizados
function MobileLink({ href, icon: Icon, children }: { href: string, icon: any, children: React.ReactNode }) {
  return (
    <Link 
      to={href} 
      className="flex items-center gap-3 px-4 py-3 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-medium"
    >
      <Icon className="w-5 h-5 text-zinc-500" />
      {children}
    </Link>
  )
}