import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music2, User } from "lucide-react"

interface SongCardProps {
  title: string;
  artist: string;
  category: string;
  onClick?: () => void;
}

export function SongCard({ title, artist, category, onClick }: SongCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-all hover:border-blue-200 group bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {category}
        </CardTitle>
        <Music2 className="h-4 w-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
      </CardHeader>
      
      <CardContent>
        
        <div className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <User className="w-3 h-3" />
            {artist}
        </div>
        
        <div className="mt-4 flex gap-2">
            <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300">
                Letra
            </Badge>
        </div>
      </CardContent>
    </Card>
  )
}