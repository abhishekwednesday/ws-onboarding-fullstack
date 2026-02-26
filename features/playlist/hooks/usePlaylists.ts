import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTransition } from "react"

import { createPlaylistAction, getUserPlaylistsAction } from "@/features/playlist/api/playlist-actions"
import { type CreatePlaylistInput } from "@/features/playlist/types/playlist-types"

/**
 * Hook for managing the collection of user playlists.
 * Provides data fetching, creation mutation, and loading states.
 */
export function usePlaylists() {
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()

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
    },
    onError: (err: Error) => {
      console.error("Failed to create playlist:", err.message)
    },
  })

  /**
   * Wrapper for creating a playlist that uses useTransition for smoother UI.
   */
  const createPlaylist = (data: CreatePlaylistInput) => {
    startTransition(async () => {
      await createPlaylistMutation.mutateAsync(data)
    })
  }

  return {
    playlists,
    isLoading: isLoading || isPending,
    isError,
    error,
    createPlaylist,
    isCreating: createPlaylistMutation.isPending,
    refetch,
  }
}
