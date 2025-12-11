import type { Musica } from "@/types"

const STORAGE_KEY = "ruah_saved_songs"

export const storage = {
  // Salvar uma música
  saveSong: (song: Musica) => {
    const saved = storage.getSavedSongs()
    // Evita duplicatas
    if (!saved.some(s => s.id === song.id)) {
      const newJson = JSON.stringify([...saved, song])
      localStorage.setItem(STORAGE_KEY, newJson)
    }
  },

  // Remover uma música
  removeSong: (id: number) => {
    const saved = storage.getSavedSongs()
    const newSaved = saved.filter(s => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved))
  },

  // Verificar se está salva
  isSaved: (id: number): boolean => {
    const saved = storage.getSavedSongs()
    return saved.some(s => s.id === id)
  },

  // Pegar todas (para a lista)
  getSavedSongs: (): Musica[] => {
    const json = localStorage.getItem(STORAGE_KEY)
    return json ? JSON.parse(json) : []
  }
}