import type { Musica } from "@/types"

const STORAGE_KEY = "ruah_saved_songs"

export const storage = {
  
  saveSong: (song: Musica) => {
    const saved = storage.getSavedSongs()

    if (!saved.some(s => s.id === song.id)) {
      const newJson = JSON.stringify([...saved, song])
      localStorage.setItem(STORAGE_KEY, newJson)
    }
  },

  removeSong: (id: number) => {
    const saved = storage.getSavedSongs()
    const newSaved = saved.filter(s => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved))
  },

  isSaved: (id: number): boolean => {
    const saved = storage.getSavedSongs()
    return saved.some(s => s.id === id)
  },

  getSavedSongs: (): Musica[] => {
    const json = localStorage.getItem(STORAGE_KEY)
    return json ? JSON.parse(json) : []
  }
}