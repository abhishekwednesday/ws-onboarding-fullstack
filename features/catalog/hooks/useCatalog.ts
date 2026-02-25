import { useInfiniteQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useCallback, useDeferredValue, useMemo, useState, useTransition } from "react"

import { itunesSearchAction } from "../api/catalog-actions"
import { useFavoritesStore } from "../store/useFavoritesStore"

export function useCatalog() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Initialise from URL param so Back navigation restores the search term
  const [searchTerm, setSearchTermState] = useState(() => searchParams.get("q") ?? "")
  const deferredTerm = useDeferredValue(searchTerm)

  const [shouldShowFavoritesOnly, setShouldShowFavoritesOnly] = useState(false)
  const favoritesMap = useFavoritesStore((state) => state.favorites)
  const favoriteItems = useMemo(() => Object.values(favoritesMap), [favoritesMap])

  // React Query for infinite scrolling
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInitialLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["catalog", deferredTerm || "top music"],
    queryFn: ({ pageParam }) => itunesSearchAction(deferredTerm || "top music", pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.nextOffset) return null

      // iTunes API sometimes returns duplicates or loops.
      // If the last page added NO new unique items, we stop.
      const previousItems = allPages.slice(0, -1).flatMap((p) => p.items)
      const existingIds = new Set(previousItems.map((i) => i.id))
      const newUniqueCount = lastPage.items.filter((i) => !existingIds.has(i.id)).length

      if (allPages.length > 1 && newUniqueCount === 0) {
        return null
      }

      return lastPage.nextOffset
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !shouldShowFavoritesOnly, // Disable catalog fetching when showing favorites only
  })

  // Flattened and deduplicated items from all pages
  const items = useMemo(() => {
    const allItems = data?.pages.flatMap((page) => page.items) ?? []
    const seen = new Set<number>()
    return allItems.filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  }, [data])

  // Write the search term back to the URL so it survives Back navigation
  const setSearchTerm = useCallback(
    (term: string) => {
      setSearchTermState(term)
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
          params.set("q", term)
        } else {
          params.delete("q")
        }
        router.replace(`/catalog?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams]
  )

  const handleClear = useCallback(() => {
    setSearchTerm("")
  }, [setSearchTerm])

  const loadMore = useCallback(() => {
    if (!shouldShowFavoritesOnly && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [shouldShowFavoritesOnly, hasNextPage, isFetchingNextPage, fetchNextPage])

  const toggleShowFavoritesOnly = useCallback(() => {
    setShouldShowFavoritesOnly((prev) => !prev)
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    handleClear,
    data: shouldShowFavoritesOnly ? favoriteItems : items,
    isLoading: shouldShowFavoritesOnly ? false : isInitialLoading,
    isFetchingMore: isFetchingNextPage || isPending,
    isError: shouldShowFavoritesOnly ? false : isError,
    error: shouldShowFavoritesOnly ? null : error,
    refetch,
    loadMore,
    hasMore: shouldShowFavoritesOnly ? false : !!hasNextPage,
    shouldShowFavoritesOnly,
    toggleShowFavoritesOnly,
  }
}
