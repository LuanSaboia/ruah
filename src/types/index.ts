export interface Musica {
  id: number
  titulo: string
  artista: string
  letra?: string
  categoria: string
  numero_cantai?: number // Opcional, caso tenha
  enviado_por?: string,
  created_at?: string
}