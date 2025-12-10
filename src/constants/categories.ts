// src/constants/categories.ts

// O "as const" diz pro TypeScript que esses valores são FIXOS e imutáveis
export const CATEGORIAS_DISPONIVEIS = [
  "Fraternidade",
  "Adoração",
  "Louvor",
  "Animação",
  "Espírito Santo",
  "Maria",
  "Entrada",
  "Ato Penitencial",
  "Santo",
  "Aclamação do Evangelho",
  "Ofertório",
  "Ação de Graças",
  "Comunhão",
  "Canto Final",
  "Páscoa",
  "Natal"
] as const;

// Mágica do TypeScript: Cria um tipo baseado na lista acima
// Resultado: type Categoria = "Adoração" | "Louvor" | "Animação" ...
export type Categoria = typeof CATEGORIAS_DISPONIVEIS[number];