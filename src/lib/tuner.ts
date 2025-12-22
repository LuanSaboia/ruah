import { PitchDetector } from "pitchy";

export const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * Usa a biblioteca Pitchy para detetar a frequência (Pitch) de um sinal de áudio.
 */
export function detectPitch(buf: Float32Array, sampleRate: number): number {
  
  const detector = PitchDetector.forFloat32Array(buf.length);
  
  const [pitch, clarity] = detector.findPitch(buf, sampleRate);

  // Se a claridade for baixa (ruído de fundo), ignoramos o resultado
  // 0.8 é um bom valor de base, mas podes ajustar se estiver muito sensível ou pouco
  if (clarity < 0.8) return -1;

  return pitch;
}

export function getNote(frequency: number) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

export function getNoteString(noteNum: number) {
  return NOTE_STRINGS[noteNum % 12];
}

export function getCents(frequency: number, noteNum: number) {
  const frequencyNote = 440 * Math.pow(2, (noteNum - 69) / 12);
  return Math.floor(1200 * Math.log(frequency / frequencyNote) / Math.log(2));
}