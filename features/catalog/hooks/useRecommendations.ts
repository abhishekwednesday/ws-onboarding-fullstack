"use client"

import { useQuery } from "@tanstack/react-query"

import { getRecommendedTracksAction } from "@/features/catalog/api/recommendations"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

/**
 * Hook for fetching and managing recommended tracks.
 * Integrates with React Query for caching, revalidation, and loading states.
 */
export function useRecommendations() {
  const {
    data: recommendations = [] as CatalogItemType[],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["recommendations"],
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
