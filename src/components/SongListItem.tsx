import { Music, ChevronRight } from "lucide-react"

interface SongListItemProps {
  title: string;
  artist: string;
  // MUDANÇA AQUI: Aceita string (antigo) ou array de strings (novo)
  category?: string | string[]; 
  numero?: number;
  onClick?: () => void;
}

export function SongListItem({ title, artist, category, numero, onClick }: SongListItemProps) {
  
  // Função auxiliar para garantir que sempre tratamos como lista
  const categories = Array.isArray(category) 
    ? category 
    : category ? [category] : [];

  return (
    <div 
      onClick={onClick}
      className="group flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4 overflow-hidden">
        
        {/* Ícone Redondo */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {numero ? (
               <span className="font-mono text-sm font-bold text-zinc-500">{numero}</span>
            ) : (
               <Music className="w-5 h-5" />
            )}
        </div>

        {/* Textos */}
        <div className="flex flex-col min-w-0 gap-1">
          <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate pr-4">
            {title}
          </span>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
              {artist}
            </span>
            
            {/* LOOPS NAS CATEGORIAS */}
            {categories.map((cat) => (
              <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hidden sm:inline-block whitespace-nowrap">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors flex-shrink-0" />
    </div>
  )
}