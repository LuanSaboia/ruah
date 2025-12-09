export interface Musica {
  id: number
  titulo: string
  artista: string
  letra?: string
  categoria: string
  numero_cantai?: number // Opcional, caso tenha
  created_at?: string
}