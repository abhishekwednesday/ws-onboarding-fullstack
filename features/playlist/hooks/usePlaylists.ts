"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createPlaylistAction,
  getPlaylistTrackMapAction,
  getUserPlaylistsAction,
} from "@/features/playlist/api/playlist-actions"
import { usePlaylistStore } from "@/features/playlist/store/usePlaylistStore"
import { type CreatePlaylistInput } from "@/features/playlist/types/playlist-types"

/**
 * Hook for managing the collection of user playlists.
 * Provides data fetching, creation mutation, and loading states.
 */
export function usePlaylists() {
  const queryClient = useQueryClient()
  const { addedTracks, markTrackAsAdded, reset } = usePlaylistStore()

  // Fetch playlists using TanStack Query
  const {
    data: playlists = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const result = await getUserPlaylistsAction()
      if (!result.success) {
        throw new Error(result.error)
      }

      // After fetching playlists, hydrate the local store with track mappings
      // so global indicators (like checkmarks on CatalogCards) reflect DB state.
      const mapResult = await getPlaylistTrackMapAction()
      if (mapResult.success && mapResult.data) {
        // Reset local store to avoid stale state from previous sessions
        reset()
        Object.entries(mapResult.data).forEach(([playlistId, trackIds]) => {
          trackIds.forEach((trackId) => {
            markTrackAsAdded(playlistId, trackId)
          })
        })
      }

      return result.data
    },
  })

  // Create playlist mutation
  const createPlaylistMutation = useMutation({
    mutationFn: async (data: CreatePlaylistInput) => {
      const result = await createPlaylistAction(data)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] })
      toast.success("Playlist created successfully")
    },
    onError: (err: Error) => {
      console.error("Failed to create playlist:", err.message)
      toast.error(err.message || "Failed to create playlist")
    },
  })

  /**
   * Wrapper for creating a playlist that returns a promise for the caller.
   */
  const createPlaylist = async (data: CreatePlaylistInput) => {
    return createPlaylistMutation.mutateAsync(data)
  }

  return {
    playlists,
    isLoading,
    isError,
    error,
    createPlaylist,
    isCreating: createPlaylistMutation.isPending,
    refetch,
  }
}
