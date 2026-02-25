import { useQuery } from "@tanstack/react-query"

import { itunesLookupSingleAction } from "../api/catalog-actions"
import { type CatalogItemType } from "../types/catalog-types"

/**
 * React Query hook to fetch a single track's detail from the iTunes API.
 * Independent of catalog list state — re-fetches on mount, works on page refresh.
 *
 * @param id The iTunes trackId to look up.
 */
export function useTrackDetail(id: number) {
  return useQuery<CatalogItemType, Error>({
    queryKey: ["track", id],
    queryFn: () => itunesLookupSingleAction(id),
    staleTime: 1000 * 60 * 5, // 5 minutes — track metadata rarely changes
    retry: 1,
  })
}
