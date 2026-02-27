"use client"

import { useQuery } from "@tanstack/react-query"

import { getRecommendedTracksAction } from "@/features/catalog/api/recommendations"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { useSession } from "@/lib/auth/auth-client"

/**
 * Hook for fetching and managing recommended tracks.
 * Integrates with React Query for caching, revalidation, and loading states.
 */
export function useRecommendations() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const {
    data: recommendations = [] as CatalogItemType[],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["recommendations", userId],
    enabled: !!userId,
    queryFn: async () => {
      const result = await getRecommendedTracksAction()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    // Recommendations can be cached for a reasonable time since they
    // rely on relatively stable signals (liked songs/playlists).
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    recommendations,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  }
}
