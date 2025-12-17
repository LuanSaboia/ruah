export interface LiturgyTemplate {
  id: string;
  name: string;
  description: string;
  slots: string[];
}

export const LITURGY_TEMPLATES: LiturgyTemplate[] = [
  {
    id: 'missa',
    name: 'Santa Missa',
    description: 'Estrutura clássica com Entrada, Ato Penitencial, Glória, etc.',
    slots: [
      'Entrada',
      'Ato Penitencial',
      'Glória',
      'Aclamação',
      'Ofertório',
      'Santo',
      'Cordeiro',
      'Comunhão',
      'Ação de Graças',
      'Final'
    ]
  },
  {
    id: 'grupo',
    name: 'Grupo de Oração',
    description: 'Condução do grupo',
    slots: [
      'Fraternidade',
      'Animação',
      'Louvor',
      'Espírito Santo',
    ]
  },
  {
    id: 'culto',
    name: 'Celebração da Palavra',
    description: 'Estrutura genérica para celebrações da Palavra.',
    slots: [
      'Entrada',
      'Ato Penitencial',
      'Aclamação',
      'Comunhão',
      'Ação de Graças',
      'Final'
    ]
  }
];