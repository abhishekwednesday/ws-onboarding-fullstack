import { useQuery } from "@tanstack/react-query"

import { itunesSearchAction } from "../api/catalog-actions"
import { mapItunesTrackToCatalogItem } from "../types/catalog-types"

export function useCatalogQuery(query: string = "top music") {
  return useQuery({
    queryKey: ["catalog", query],
    queryFn: async () => {
      const response = await itunesSearchAction(query)
      return response.items // itunesSearchAction now returns items directly
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export type UseCatalogQueryResultType = ReturnType<typeof useCatalogQuery>
