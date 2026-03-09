import { useInfiniteQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useDeferredValue, useEffect, useMemo, useState, useTransition } from "react"
import { useShallow } from "zustand/react/shallow"

import { trackCatalogSearch } from "@/lib/analytics/events"
import { itunesSearchAction } from "../api/catalog-actions"
import { CatalogExplicitType, CatalogMediaType, type SearchOptions } from "@/lib/api/schemas"
import { useFavoritesStore } from "../store/useFavoritesStore"
import { type CatalogItemType } from "../types/catalog-types"

const DEFAULT_SEARCH_TERM = "top music"

/** Returns the value only if it is a valid CatalogMediaType, otherwise undefined. */
function isValidCatalogMediaType(value: string | null): CatalogMediaType | undefined {
  if (value && Object.values(CatalogMediaType).includes(value as CatalogMediaType)) {
    return value as CatalogMediaType
  }
  return undefined
}

/** Returns the value only if it is a valid CatalogExplicitType, otherwise undefined. */
function isValidCatalogExplicitType(value: string | null): CatalogExplicitType | undefined {
  if (value && Object.values(CatalogExplicitType).includes(value as CatalogExplicitType)) {
    return value as CatalogExplicitType
  }
  return undefined
}

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
  const [media, setMedia] = useState<CatalogMediaType | undefined>(() =>
    isValidCatalogMediaType(searchParams.get("media"))
  )
  const [country, setCountryState] = useState<string | undefined>(() => searchParams.get("country") || undefined)
  const [explicit, setExplicit] = useState<CatalogExplicitType | undefined>(() =>
    isValidCatalogExplicitType(searchParams.get("explicit"))
  )

  // Extract raw string values once so the effect below can depend on them (not on
  // the searchParams object reference, which may change identity every render).
  const spQ = searchParams.get("q") ?? ""
  const spMedia = searchParams.get("media") ?? ""
  const spCountry = searchParams.get("country") ?? ""
  const spExplicit = searchParams.get("explicit") ?? ""

  // Re-sync state when the URL values change (e.g. browser back/forward navigation).
  // Depending on the string values (not the object) means this only fires when the
  // actual URL content changes, not on every re-render.
  useEffect(() => {
    setSearchTermState(spQ)
    setMedia(isValidCatalogMediaType(spMedia || null))
    setCountryState(spCountry || undefined)
    setExplicit(isValidCatalogExplicitType(spExplicit || null))
  }, [spQ, spMedia, spCountry, spExplicit])

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
    queryKey: ["catalog", deferredTerm.trim() || DEFAULT_SEARCH_TERM, deferredMedia, deferredCountry, deferredExplicit],
    queryFn: ({ pageParam, queryKey }) => {
      const normalizedTerm = (queryKey[1] as string) || DEFAULT_SEARCH_TERM
      const options: Omit<SearchOptions, "term"> = {
        offset: pageParam,
        media: queryKey[2] as CatalogMediaType | undefined,
        country: queryKey[3] as string | undefined,
        explicit: queryKey[4] as CatalogExplicitType | undefined,
      }
      return itunesSearchAction(normalizedTerm, options)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.nextOffset) return undefined

      // Deduplication logic: construction seen from all pages except lastPage
      const seenIds = new Set<number>()
      allPages.slice(0, -1).forEach((page) => {
        page.items.forEach((item) => {
          seenIds.add(item.id)
        })
      })

      const newUniqueCount = lastPage.items.filter((item) => !seenIds.has(item.id)).length

      return newUniqueCount > 0 ? lastPage.nextOffset : undefined
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
      if (newFilters.media !== undefined) setMedia(isValidCatalogMediaType(newFilters.media))
      if (newFilters.country !== undefined) setCountryState(newFilters.country || undefined)
      if (newFilters.explicit !== undefined) setExplicit(isValidCatalogExplicitType(newFilters.explicit))

      startTransition(() => {
        const params = new URLSearchParams(window.location.search)
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
    [router, searchParams, startTransition]
  )

  const setSearchTerm = useCallback((q: string) => setFilters({ q }), [setFilters])

  /** Clears only the search term, leaving media/country/explicit filters intact. */
  const handleSearchClear = useCallback(() => {
    setFilters({ q: "" })
  }, [setFilters])

  /** Resets all filters (search term + media + country + explicit). */
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
    setMedia: (media: string | undefined) => setFilters({ media: media || "" }),
    country,
    setCountry: (country: string | undefined) => setFilters({ country: country || "" }),
    explicit,
    setExplicit: (explicit: string | undefined) => setFilters({ explicit: explicit || "" }),
    handleClear,
    handleSearchClear,
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
