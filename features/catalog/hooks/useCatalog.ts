import { useInfiniteQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useShallow } from "zustand/react/shallow"

import { trackCatalogSearch } from "@/lib/analytics/events"
import { itunesSearchAction } from "../api/catalog-actions"
import { useFavoritesStore } from "../store/useFavoritesStore"
import { type CatalogItemType } from "../types/catalog-types"

const DEFAULT_SEARCH_TERM = "top music"

/**
 * Core hook for managing the music catalog state, search, and pagination.
 * Handles the integration between TanStack Query and the local UI state (searchTerm, favorites).
 *
 * @returns {object} Catalog state and interaction handlers.
 */
export function useCatalog() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Initialise from URL params so Back navigation restores the state
  const [searchTerm, setSearchTermState] = useState(() => searchParams.get("q") ?? "")
  const [media, setMedia] = useState(() => searchParams.get("media") ?? "")
  const [country, setCountry] = useState(() => searchParams.get("country") ?? "")
  const [explicit, setExplicit] = useState(() => searchParams.get("explicit") ?? "")

  const deferredTerm = useDeferredValue(searchTerm)
  const deferredMedia = useDeferredValue(media)
  const deferredCountry = useDeferredValue(country)
  const deferredExplicit = useDeferredValue(explicit)

  const [shouldShowFavoritesOnly, setShouldShowFavoritesOnly] = useState(false)
  const favoritesMap = useFavoritesStore(useShallow((state) => state.favorites))
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
    queryKey: [
      "catalog",
      deferredTerm.trim() || DEFAULT_SEARCH_TERM,
      deferredMedia,
      deferredCountry,
      deferredExplicit,
    ],
    queryFn: ({ pageParam }) => {
      const normalizedTerm = deferredTerm.trim() || DEFAULT_SEARCH_TERM
      const options = {
        offset: pageParam,
        media: deferredMedia as any,
        country: deferredCountry || undefined,
        explicit: deferredExplicit as any,
      }
      return itunesSearchAction(normalizedTerm, options)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.nextOffset) return null

      // Deduplication logic
      const seen = new Set<number>()
      for (const page of allPages) {
        if (page) {
          for (const item of page.items) {
            seen.add(item.id)
          }
        }
      }

      let newUniqueCount = 0
      for (const item of lastPage.items) {
        if (!seen.has(item.id)) {
          newUniqueCount++
        }
      }

      if (allPages.length > 1 && newUniqueCount === 0) return null

      return lastPage.nextOffset
    },
    staleTime: 1000 * 60 * 5,
    enabled: !shouldShowFavoritesOnly,
  })

  // Track search intent once the deferred term settles
  useEffect(() => {
    const term = deferredTerm?.trim()
    if (term) trackCatalogSearch(term)
  }, [deferredTerm])

  // Flattened and deduplicated items from all pages
  const items = useMemo(() => {
    if (!data?.pages) return []

    const uniqueItems = new Map<number, CatalogItemType>()
    for (const page of data.pages) {
      for (const item of page.items) {
        if (!uniqueItems.has(item.id)) {
          uniqueItems.set(item.id, item)
        }
      }
    }
    return Array.from(uniqueItems.values())
  }, [data])

  const setFilters = useCallback(
    (newFilters: { q?: string; media?: string; country?: string; explicit?: string }) => {
      if (newFilters.q !== undefined) setSearchTermState(newFilters.q)
      if (newFilters.media !== undefined) setMedia(newFilters.media)
      if (newFilters.country !== undefined) setCountry(newFilters.country)
      if (newFilters.explicit !== undefined) setExplicit(newFilters.explicit)

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value)
          } else {
            params.delete(key)
          }
        })
        router.replace(`/catalog?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams]
  )

  const setSearchTerm = useCallback((q: string) => setFilters({ q }), [setFilters])

  const handleClear = useCallback(() => {
    setFilters({ q: "", media: "", country: "", explicit: "" })
  }, [setFilters])

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
    media,
    setMedia: (media: string) => setFilters({ media }),
    country,
    setCountry: (country: string) => setFilters({ country }),
    explicit,
    setExplicit: (explicit: string) => setFilters({ explicit }),
    handleClear,
    data: shouldShowFavoritesOnly ? favoriteItems : items,
    isLoading: shouldShowFavoritesOnly ? false : isInitialLoading,
    isFetchingMore: isFetchingNextPage,
    isSearchPending: isPending,
    isError: shouldShowFavoritesOnly ? false : isError,
    error: shouldShowFavoritesOnly ? null : error,
    refetch,
    loadMore,
    hasMore: shouldShowFavoritesOnly ? false : Boolean(hasNextPage),
    shouldShowFavoritesOnly,
    toggleShowFavoritesOnly,
    debouncedSearchTerm: deferredTerm,
  }
}
