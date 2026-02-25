import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { type CatalogItemType, type FavoritesStateType } from "../types/catalog-types"

export const useFavoritesStore = create<FavoritesStateType>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (track) => {
        const { favorites } = get()
        const newFavorites = { ...favorites }
        if (newFavorites[track.id]) {
          delete newFavorites[track.id]
        } else {
          newFavorites[track.id] = track
        }
        set({ favorites: newFavorites })
      },
      isFavorite: (id) => !!get().favorites[id],
    }),
    {
      name: "music-stream-favorites",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : memoryStorage())),
    }
  )
)

// Fallback in-memory storage for SSR/test environments
function memoryStorage() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  }
}
