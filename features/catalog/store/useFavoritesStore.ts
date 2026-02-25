import { create } from "zustand"
import { persist } from "zustand/middleware"

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
    }
  )
)
