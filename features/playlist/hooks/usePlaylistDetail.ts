"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTransition } from "react"

import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { addTrackToPlaylistAction, getPlaylistDetailAction } from "@/features/playlist/api/playlist-actions"
import { usePlaylistStore } from "@/features/playlist/store/usePlaylistStore"

/**
 * Hook for managing a single playlist's details and track list.
 * Handles fetching, adding tracks, and optimistic UI state.
 */
export function usePlaylistDetail(playlistId?: string) {
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const { markTrackAsAdded } = usePlaylistStore()

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

  // Add track to playlist mutation
  const addTrackMutation = useMutation({
    mutationFn: async ({ track }: { track: CatalogItemType }) => {
      if (!playlistId) throw new Error("No playlist selected")
      const result = await addTrackToPlaylistAction(playlistId, track)
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    onSuccess: (_, { track }) => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] })
      queryClient.invalidateQueries({ queryKey: ["playlists"] })

      // Update local optimistic store to show immediate feedback in catalog
      if (playlistId) {
        markTrackAsAdded(playlistId, track.id)
      }
    },
    onError: (err: Error) => {
      console.error("Failed to add track to playlist:", err.message)
    },
  })

  const addTrack = (track: CatalogItemType) => {
    startTransition(async () => {
      await addTrackMutation.mutateAsync({ track })
    })
  }

  return {
    playlist,
    isLoading: isLoading || isPending,
    isError,
    error,
    addTrack,
    isAdding: addTrackMutation.isPending,
    refetch,
  }
}
