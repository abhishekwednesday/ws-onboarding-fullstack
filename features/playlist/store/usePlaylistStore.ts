"use client"

import { create } from "zustand"

/**
 * Zustand store for ephemeral playlist UI state.
 * Primarily used to track which tracks have been added to which playlists
 * during the current session for immediate optimistic UI feedback (e.g., checkmarks).
 */
interface PlaylistState {
  // Map of playlistId -> Set of trackIds.
  // WARNING: Set<number> is not JSON-serializable. Do NOT add Zustand persist
  // middleware to this store without converting to a serializable structure first.
  addedTracks: Record<string, Set<number>>

  /**
   * Marks a track as added to a specific playlist.
   */
  markTrackAsAdded: (playlistId: string, trackId: number) => void

  /**
   * Removes a track from a specific playlist (used for rollbacks).
   */
  removeTrackFromPlaylist: (playlistId: string, trackId: number) => void

  /**
   * Checks if a track is in a specific playlist.
   */
  isTrackInPlaylist: (playlistId: string, trackId: number) => boolean

  /**
   * Resets the added tracks state.
   */
  reset: () => void
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  addedTracks: {},

  markTrackAsAdded: (playlistId, trackId) => {
    set((state) => {
      const playlistTracks = new Set(state.addedTracks[playlistId] || [])
      playlistTracks.add(trackId)
      return {
        addedTracks: {
          ...state.addedTracks,
          [playlistId]: playlistTracks,
        },
      }
    })
  },

  removeTrackFromPlaylist: (playlistId, trackId) => {
    set((state) => {
      const playlistTracks = new Set(state.addedTracks[playlistId] || [])
      playlistTracks.delete(trackId)
      if (playlistTracks.size === 0) {
        const { [playlistId]: _, ...rest } = state.addedTracks
        return { addedTracks: rest }
      }
      return {
        addedTracks: {
          ...state.addedTracks,
          [playlistId]: playlistTracks,
        },
      }
    })
  },

  isTrackInPlaylist: (playlistId, trackId) => {
    const state = get()
    return state.addedTracks[playlistId]?.has(trackId) || false
  },

  reset: () => set({ addedTracks: {} }),
}))
