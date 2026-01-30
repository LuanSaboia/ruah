import type { Musica, Setlist } from "@/types";

const KEY = "ruah_setlists";

export const setlistStorage = {
  getAll: (): Setlist[] => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getById: (id: string): Setlist | undefined => {
    const lists = setlistStorage.getAll();
    return lists.find(l => l.id === id);
  },

  create: (nome: string, descricao?: string) => {
    const lists = setlistStorage.getAll();
    const newList: Setlist = {
      id: crypto.randomUUID(),
      nome,
      descricao,
      dataCriacao: new Date().toISOString(),
      musicas: []
    };
    localStorage.setItem(KEY, JSON.stringify([newList, ...lists]));
    return newList;
  },

  update: (id: string, data: Partial<Setlist>) => {
    const lists = setlistStorage.getAll();
    const updated = lists.map(l => l.id === id ? { ...l, ...data } : l);
    localStorage.setItem(KEY, JSON.stringify(updated));
  },

  delete: (id: string) => {
    const lists = setlistStorage.getAll().filter(l => l.id !== id);
    localStorage.setItem(KEY, JSON.stringify(lists));
  },

  addSong: (setlistId: string, song: Musica): boolean => {
    const lists = setlistStorage.getAll();
    let success = false;

    const updated = lists.map(list => {
      if (list.id === setlistId) {
        if (list.musicas.some(m => m.id === song.id)) {
            return list;
        }
        success = true; 
        return { ...list, musicas: [...list.musicas, song] };
      }
      return list;
    });

    if (success) {
        localStorage.setItem(KEY, JSON.stringify(updated));
    }
    return success;
  },

  removeSong: (setlistId: string, songId: number) => {
    const lists = setlistStorage.getAll();
    const updated = lists.map(list => {
      if (list.id === setlistId) {
        return { ...list, musicas: list.musicas.filter(m => m.id !== songId) };
      }
      return list;
    });
    localStorage.setItem(KEY, JSON.stringify(updated));
  },

  reorderSongs: (setlistId: string, musicas: Musica[]) => {
    const lists = setlistStorage.getAll();
    const updated = lists.map(list => {
      if (list.id === setlistId) {
        return { ...list, musicas };
      }
      return list;
    });
    localStorage.setItem(KEY, JSON.stringify(updated));
  }
};