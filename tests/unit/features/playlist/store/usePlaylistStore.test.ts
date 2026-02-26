import { act } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { usePlaylistStore } from "@/features/playlist/store/usePlaylistStore"

describe("usePlaylistStore", () => {
  beforeEach(() => {
    act(() => {
      usePlaylistStore.getState().reset()
    })
  })

  describe("markTrackAsAdded", () => {
    it("should add a track to a playlist", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
      })
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(true)
    })

    it("should handle multiple tracks in the same playlist", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
        usePlaylistStore.getState().markTrackAsAdded("p1", 200)
      })
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(true)
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 200)).toBe(true)
    })

    it("should handle the same track across different playlists", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
        usePlaylistStore.getState().markTrackAsAdded("p2", 100)
      })
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(true)
      expect(usePlaylistStore.getState().isTrackInPlaylist("p2", 100)).toBe(true)
    })

    it("should be idempotent for the same track+playlist", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
      })
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(true)
    })
  })

  describe("removeTrackFromPlaylist", () => {
    it("should remove a track from a playlist", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
        usePlaylistStore.getState().removeTrackFromPlaylist("p1", 100)
      })
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(false)
    })

    it("should clean up the playlist key when the last track is removed", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
        usePlaylistStore.getState().removeTrackFromPlaylist("p1", 100)
      })
      expect(usePlaylistStore.getState().addedTracks["p1"]).toBeUndefined()
    })

    it("should not affect other playlists when removing", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
        usePlaylistStore.getState().markTrackAsAdded("p2", 100)
        usePlaylistStore.getState().removeTrackFromPlaylist("p1", 100)
      })
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(false)
      expect(usePlaylistStore.getState().isTrackInPlaylist("p2", 100)).toBe(true)
    })

    it("should be safe to remove a non-existent track", () => {
      act(() => {
        usePlaylistStore.getState().removeTrackFromPlaylist("p1", 999)
      })
      expect(usePlaylistStore.getState().addedTracks["p1"]).toBeUndefined()
    })
  })

  describe("isTrackInPlaylist", () => {
    it("should return false for a non-existent playlist", () => {
      expect(usePlaylistStore.getState().isTrackInPlaylist("nonexistent", 100)).toBe(false)
    })

    it("should return false for a non-existent track in an existing playlist", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
      })
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 999)).toBe(false)
    })
  })

  describe("hydrateTrackMap", () => {
    it("should replace the entire state with server data", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("stale", 1)
        usePlaylistStore.getState().hydrateTrackMap({
          p1: [100, 200],
          p2: [300],
        })
      })
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(true)
      expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 200)).toBe(true)
      expect(usePlaylistStore.getState().isTrackInPlaylist("p2", 300)).toBe(true)
      expect(usePlaylistStore.getState().isTrackInPlaylist("stale", 1)).toBe(false)
    })

    it("should handle an empty track map", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
        usePlaylistStore.getState().hydrateTrackMap({})
      })
      expect(usePlaylistStore.getState().addedTracks).toEqual({})
    })
  })

  describe("reset", () => {
    it("should clear all state", () => {
      act(() => {
        usePlaylistStore.getState().markTrackAsAdded("p1", 100)
        usePlaylistStore.getState().markTrackAsAdded("p2", 200)
        usePlaylistStore.getState().reset()
      })
      expect(usePlaylistStore.getState().addedTracks).toEqual({})
    })
  })
})
