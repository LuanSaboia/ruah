export interface Musica {
  id: number
  titulo: string
  artista: string
  letra?: string
  categoria: string
  numero_cantai?: number
  enviado_por?: string
  link_audio?: string
  cifra?: string
  idioma?: string
  created_at?: string
}

export interface Setlist {
  id: string;
  nome: string;
  descricao?: string;
  dataCriacao: string;
  musicas: Musica[];
}