import { act } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useFavoritesStore } from "@/features/catalog/store/useFavoritesStore"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

const track1: CatalogItemType = {
  id: 1,
  title: "Song A",
  artist: "Artist A",
  album: "Album A",
  artworkUrl: "http://example.com/a.jpg",
  genre: "Pop",
  duration: 200000,
}

const track2: CatalogItemType = {
  id: 2,
  title: "Song B",
  artist: "Artist B",
  album: "Album B",
  artworkUrl: "http://example.com/b.jpg",
  genre: "Rock",
  duration: 180000,
}

describe("useFavoritesStore", () => {
  beforeEach(() => {
    act(() => {
      useFavoritesStore.getState().clearFavorites()
    })
  })

  describe("toggleFavorite", () => {
    it("should add a track when not already favorited", () => {
      act(() => {
        useFavoritesStore.getState().toggleFavorite(track1)
      })
      expect(useFavoritesStore.getState().isFavorite(track1.id)).toBe(true)
    })

    it("should remove a track when already favorited", () => {
      act(() => {
        useFavoritesStore.getState().toggleFavorite(track1)
        useFavoritesStore.getState().toggleFavorite(track1)
      })
      expect(useFavoritesStore.getState().isFavorite(track1.id)).toBe(false)
    })

    it("should handle multiple tracks independently", () => {
      act(() => {
        useFavoritesStore.getState().toggleFavorite(track1)
        useFavoritesStore.getState().toggleFavorite(track2)
      })
      expect(useFavoritesStore.getState().isFavorite(track1.id)).toBe(true)
      expect(useFavoritesStore.getState().isFavorite(track2.id)).toBe(true)

      act(() => {
        useFavoritesStore.getState().toggleFavorite(track1)
      })
      expect(useFavoritesStore.getState().isFavorite(track1.id)).toBe(false)
      expect(useFavoritesStore.getState().isFavorite(track2.id)).toBe(true)
    })
  })

  describe("isFavorite", () => {
    it("should return false for a non-existent track", () => {
      expect(useFavoritesStore.getState().isFavorite(999)).toBe(false)
    })
  })

  describe("clearFavorites", () => {
    it("should remove all favorites", () => {
      act(() => {
        useFavoritesStore.getState().toggleFavorite(track1)
        useFavoritesStore.getState().toggleFavorite(track2)
        useFavoritesStore.getState().clearFavorites()
      })
      expect(useFavoritesStore.getState().favorites).toEqual({})
    })
  })

  describe("replaceFavorites", () => {
    it("should replace all favorites with the provided tracks", () => {
      act(() => {
        useFavoritesStore.getState().toggleFavorite(track1)
        useFavoritesStore.getState().replaceFavorites([track2])
      })
      expect(useFavoritesStore.getState().isFavorite(track1.id)).toBe(false)
      expect(useFavoritesStore.getState().isFavorite(track2.id)).toBe(true)
    })

    it("should handle an empty array", () => {
      act(() => {
        useFavoritesStore.getState().toggleFavorite(track1)
        useFavoritesStore.getState().replaceFavorites([])
      })
      expect(useFavoritesStore.getState().favorites).toEqual({})
    })

    it("should correctly index tracks by their ID", () => {
      act(() => {
        useFavoritesStore.getState().replaceFavorites([track1, track2])
      })
      const fav = useFavoritesStore.getState().favorites
      expect(fav[track1.id]).toEqual(track1)
      expect(fav[track2.id]).toEqual(track2)
    })
  })
})
