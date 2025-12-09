// src/data/mockData.ts

export type SearchResult = {
  id: number;
  type: 'musica' | 'artista';
  title: string;
  artist?: string;
  subtitle?: string;
  category?: string;
  lyrics?: string; // Adicionamos este campo
}

export const mockDatabase: SearchResult[] = [
  // Músicas
  { 
    id: 1, 
    type: 'musica', 
    title: 'Ressuscitou', 
    artist: 'Comunidade Shalom', 
    category: 'Páscoa',
    lyrics: `Onde está, ó morte, a tua vitória?
Onde está, ó morte, o teu aguilhão?

O Rei da Glória, o Autor da Vida
O Pai da Eternidade, o Grande Eu Sou
Ressuscitou, Jesus ressuscitou
A morte não o prendeu
O túmulo está vazio`
  },
  { 
    id: 2, 
    type: 'musica', 
    title: 'Abraço de Pai', 
    artist: 'Walmir Alencar', 
    category: 'Adoração',
    lyrics: `Quanto eu esperei
Que chegasse esse momento
Quanto eu esperei
Que estivesses aqui`
  },{ id: 3, type: 'musica', title: 'Belíssimo Esposo', artist: 'Comunidade Shalom', category: 'Espiritualidade' },
  { id: 4, type: 'musica', title: 'O Céu se Abre', artist: 'Walmir Alencar', category: 'Louvor' },
  { id: 5, type: 'musica', title: 'Minha Essência', artist: 'Thiago Brado', category: 'Vocacional' },
  
  // Artistas
  { id: 101, type: 'artista', title: 'Comunidade Shalom', subtitle: 'Banda' },
  { id: 102, type: 'artista', title: 'Walmir Alencar', subtitle: 'Cantor' },
  { id: 103, type: 'artista', title: 'Missionário Shalom', subtitle: 'Banda' },
]