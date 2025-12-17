// O "as const" diz pro TypeScript que esses valores são fixos
export const CATEGORIAS_DISPONIVEIS = [
  "Fraternidade",
  "Adoração",
  "Louvor",
  "Animação",
  "Espírito Santo",
  "Maria",
  "Entrada",
  "Ato Penitencial",
  "Glória",
  "Santo",
  "Aclamação do Evangelho",
  "Ofertório",
  "Ação de Graças",
  "Comunhão",
  "Canto Final",
  "Páscoa",
  "Natal"
] as const;

// Cria um tipo baseado na lista acima
// Resultado: type Categoria = "Adoração" | "Louvor" | "Animação" ...
export type Categoria = typeof CATEGORIAS_DISPONIVEIS[number];

export const CATEGORY_MAPPING: Record<string, string[]> = {
  // Momentos Fixos da Missa
  "Entrada": ["Entrada", "Abertura"],
  "Ato Penitencial": ["Ato Penitencial", "Penitencial", "Kyrie", "Piedade", "Misericórdia"],
  "Glória": ["Glória", "Hino de Louvor"],
  "Salmo": ["Salmo"],
  "Aclamação": ["Aclamação", "Aleluia", "Evangelho"],
  "Ofertório": ["Ofertório", "Oferta", "Apresentação"],
  "Santo": ["Santo"], 
  "Cordeiro": ["Cordeiro", "Agnus Dei", "Paz"],
  "Comunhão": ["Comunhão", "Eucaristia"],
  "Final": ["Final", "Maria", "Nossa Senhora", "Envio"],
  
  // Temas Específicos
  "Maria": ["Maria", "Nossa Senhora", "Mariano"],
  "Espírito Santo": ["Espírito Santo", "Pentecostes"],
  "Adoração": ["Adoração", "Santíssimo", "Exposição"],
  "Louvor": ["Louvor", "Animação"]
}