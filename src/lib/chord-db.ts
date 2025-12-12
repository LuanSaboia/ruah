// Importa o banco de dados de violão (guitar) da biblioteca
import guitarDb from '@tombatossals/chords-db/lib/guitar.json';

// Mapeamento de sufixos (O que o usuário digita -> O que a lib entende)
const SUFFIX_MAP: Record<string, string> = {
  '': 'major',
  'm': 'minor',
  'min': 'minor',
  '7': '7',
  'm7': 'm7',
  'maj7': 'maj7',
  'M7': 'maj7',
  'sus4': 'sus4',
  'sus2': 'sus2',
  'dim': 'dim',
  'aug': 'aug',
  '5': '5',
  '6': '6',
  'm6': 'm6',
  '9': '9',
  'm9': 'm9'
};

// Mapeamento de notas equivalentes (A# -> Bb)
const KEY_ALIASES: Record<string, string> = {
  'A#': 'Bb',
  'C#': 'Csharp', // A lib as vezes usa nomes assim
  'Db': 'Csharp',
  'D#': 'Eb',
  'F#': 'Fsharp',
  'Gb': 'Fsharp',
  'G#': 'Ab'
};

export function getChordData(chordName: string) {
  // 1. Tenta separar a Nota (Root) do Sufixo
  // Ex: "Cm7" -> root: "C", suffix: "m7"
  // Ex: "F#m" -> root: "F#", suffix: "m"
  const regex = /^([A-G][#b]?)(.*)$/;
  const match = chordName.match(regex);

  if (!match) return null;

  let [_, root, suffix] = match;

  // 2. Normaliza a Nota (A# vira Bb)
  if (KEY_ALIASES[root]) root = KEY_ALIASES[root];
  
  // A biblioteca usa "C" para Dó, "Csharp" para C# ou Bb para Si bemol.
  // Vamos tentar encontrar a chave principal
  let keyData = guitarDb.keys.find(k => k === root || k.replace('sharp', '#') === root);
  
  if (!keyData && KEY_ALIASES[chordName.substring(0, 2)]) {
     // Tenta de novo com alias se não achou
     root = KEY_ALIASES[chordName.substring(0, 2)];
  }

  // 3. Normaliza o Sufixo (m vira minor)
  const suffixName = SUFFIX_MAP[suffix] || suffix || 'major';

  // 4. Busca na Biblioteca
  // A estrutura é: guitarDb.chords[ROOT] -> Array de sufixos
  const rootChords = (guitarDb.chords as any)[root];
  if (!rootChords) return null;

  const chordData = rootChords.find((c: any) => c.suffix === suffixName);
  
  if (!chordData || !chordData.positions || chordData.positions.length === 0) return null;

  // Retorna a primeira posição (a mais comum)
  // A lib retorna frets: [x, 3, 2, 0, 1, 0]. Vamos converter para o nosso padrão.
  const position = chordData.positions[0];
  
  return {
    name: chordName,
    frets: position.frets, // Ex: [-1, 3, 2, 0, 1, 0]
    barres: position.barres || [], // Pestanas (se tiver)
    capo: position.capo
  };
}