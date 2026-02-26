"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { addTrackToPlaylistAction, getPlaylistDetailAction } from "@/features/playlist/api/playlist-actions"
import { usePlaylistStore } from "@/features/playlist/store/usePlaylistStore"

/**
 * Hook for managing a single playlist's details and track list.
 * Handles fetching, adding tracks, and optimistic UI state.
 */
export function usePlaylistDetail(playlistId?: string) {
  const queryClient = useQueryClient()
  const { markTrackAsAdded, removeTrackFromPlaylist, isTrackInPlaylist } = usePlaylistStore()

  // Fetch playlist details
  const {
    data: playlist = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      if (!playlistId) return null
      const result = await getPlaylistDetailAction(playlistId)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    enabled: !!playlistId,
  })

  // Add track to playlist mutation with true optimistic updates
  const addTrackMutation = useMutation({
    mutationFn: async ({ track }: { track: CatalogItemType }) => {
      if (!playlistId) throw new Error("No playlist selected")
      const result = await addTrackToPlaylistAction(playlistId, track)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onMutate: async ({ track }) => {
      await queryClient.cancelQueries({ queryKey: ["playlist", playlistId] })
      const wasAlreadyAdded = playlistId ? isTrackInPlaylist(playlistId, track.id) : false
      const previousValue = playlistId ? { playlistId, trackId: track.id, wasAlreadyAdded } : null
      if (playlistId) {
        markTrackAsAdded(playlistId, track.id)
      }
      return { previousValue }
    },
    onSuccess: (_, { track }) => {
      toast.success(`Added "${track.title}" to playlist`)
    },
    onError: (err: Error, { track }, context) => {
      if (context?.previousValue && !context.previousValue.wasAlreadyAdded) {
        removeTrackFromPlaylist(context.previousValue.playlistId, context.previousValue.trackId)
      }

      console.error("Failed to add track to playlist:", err.message)
      toast.error(err.message || "Failed to add track")
    },
    onSettled: (_data, _error, _variables, context) => {
      const settledPlaylistId = context?.previousValue?.playlistId ?? playlistId
      queryClient.invalidateQueries({ queryKey: ["playlist", settledPlaylistId] })
      queryClient.invalidateQueries({ queryKey: ["playlists"] })
    },
  })

  /**
   * Adds a track to the current playlist. Errors are handled internally
   * via the mutation's onError callback (toast + console); callers do not
   * need to catch.
   */
  const addTrack = async (track: CatalogItemType): Promise<void> => {
    try {
      await addTrackMutation.mutateAsync({ track })
    } catch {
      // Already handled by the mutation's onError callback
    }
  }

  return {
    playlist,
    isLoading,
    isError,
    error,
    addTrack,
    isAdding: addTrackMutation.isPending,
    refetch,
  }
}
