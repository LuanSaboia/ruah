const SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function transposeChord(chord: string, semitones: number): string {
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;

  let [_, root, suffix] = match;
  
  if (root === "Db") root = "C#";
  if (root === "Eb") root = "D#";
  if (root === "Gb") root = "F#";
  if (root === "Ab") root = "G#";
  if (root === "Bb") root = "A#";

  const index = SCALE.indexOf(root);
  if (index === -1) return chord;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  return SCALE[newIndex] + suffix;
}

// Nova interface para os pedaços da cifra
export interface ChordSegment {
  chord: string | null;
  text: string;
}

// Função que processa linha por linha
export function parseCifraLine(line: string, semitones: number): ChordSegment[] {
  const segments: ChordSegment[] = [];
  
  // Divide a linha pelos colchetes: "Texto [A]Acorde [B]Fim"
  // O split gera: ["Texto ", "A", "Acorde ", "B", "Fim"]
  const parts = line.split(/\[(.*?)\]/); 
  
  // A primeira parte é sempre texto (pode ser vazio se a linha começar com acorde)
  if (parts[0]) segments.push({ chord: null, text: parts[0] });
  
  // Itera de 2 em 2 (Acorde + Texto seguinte)
  for (let i = 1; i < parts.length; i += 2) {
    const rawChord = parts[i];
    const text = parts[i+1];
    
    segments.push({
      chord: transposeChord(rawChord, semitones),
      text: text || "" // Garante string vazia se não tiver texto
    });
  }
  
  return segments;
}