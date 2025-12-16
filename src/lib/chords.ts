export const SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function getChordRoot(chord: string) {
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return { root: null, suffix: "" };
  
  let [_, root, suffix] = match;
  
  if (root === "Db") root = "C#";
  if (root === "Eb") root = "D#";
  if (root === "Gb") root = "F#";
  if (root === "Ab") root = "G#";
  if (root === "Bb") root = "A#";
  
  return { root, suffix };
}

export function transposeChord(chord: string, semitones: number): string {
  const { root, suffix } = getChordRoot(chord);
  if (!root) return chord;

  const index = SCALE.indexOf(root);
  if (index === -1) return chord;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  return SCALE[newIndex] + suffix;
}

export interface ChordSegment {
  chord: string | null;
  text: string;
}

export function parseCifraLine(line: string, semitones: number): ChordSegment[] {
  const segments: ChordSegment[] = [];
  const parts = line.split(/\[(.*?)\]/); 
  
  if (parts[0]) segments.push({ chord: null, text: parts[0] });
  
  for (let i = 1; i < parts.length; i += 2) {
    const rawChord = parts[i];
    const text = parts[i+1];
    
    segments.push({
      chord: transposeChord(rawChord, semitones),
      text: text || "" 
    });
  }
  
  return segments;
}