"use client"

import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react"

import { itunesSearchAction } from "@/actions/catalog/catalog-actions"
import { useFavoritesStore } from "../store/useFavoritesStore"
import { type CatalogItemType, mapItunesTrackToCatalogItem } from "../types/catalog-types"

const PAGE_SIZE = 50

export function useCatalog() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialise from URL param so Back navigation restores the search term
  const [searchTerm, setSearchTermState] = useState(() => searchParams.get("q") ?? "")
  const deferredTerm = useDeferredValue(searchTerm)

  const [items, setItems] = useState<CatalogItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const favoritesMap = useFavoritesStore((state) => state.favorites)

  const offsetRef = useRef(0)
  const isFetchingRef = useRef(false)
  const fetchIdRef = useRef(0)
  const lastTermRef = useRef<string | null>(null)

  // Write the search term back to the URL so it survives Back navigation
  const setSearchTerm = useCallback(
    (term: string) => {
      setSearchTermState(term)
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set("q", term)
      } else {
        params.delete("q")
      }
      router.replace(`/catalog?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const fetchItems = useCallback(async (term: string, offset: number, isReset: boolean) => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true

    const fetchId = ++fetchIdRef.current

    if (isReset) {
      setIsLoading(true)
      setItems([])
      setHasMore(true)
      offsetRef.current = 0
    } else {
      setIsFetchingMore(true)
    }
    setIsError(false)

    try {
      const query = term || "top music"
      const response = await itunesSearchAction(query, offset)

      if (fetchId !== fetchIdRef.current) return

      const newItems = response.results.map(mapItunesTrackToCatalogItem)

      offsetRef.current = offset + PAGE_SIZE

      if (isReset) {
        setItems(newItems)
        setHasMore(newItems.length === PAGE_SIZE)
      } else {
        setItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id))
          const unique = newItems.filter((item) => !existingIds.has(item.id))

          if (unique.length === 0) {
            setHasMore(false)
            return prev
          }

          setHasMore(newItems.length === PAGE_SIZE)
          return [...prev, ...unique]
        })
      }
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return
      setIsError(true)
      setError(err instanceof Error ? err : new Error("Failed to fetch catalog"))
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false)
        setIsFetchingMore(false)
        isFetchingRef.current = false
      }
    }
  }, [])

  useEffect(() => {
    if (showFavoritesOnly) return

    const query = deferredTerm || "top music"
    if (lastTermRef.current === null || query !== lastTermRef.current) {
      lastTermRef.current = query
      isFetchingRef.current = false
      fetchItems(deferredTerm, 0, true)
    }
  }, [deferredTerm, fetchItems, showFavoritesOnly])

  // Sync with favorites when mode is active
  const favoriteItems = React.useMemo(() => Object.values(favoritesMap), [favoritesMap])

  const handleClear = useCallback(() => {
    setSearchTerm("")
  }, [setSearchTerm])

  const refetch = useCallback(() => {
    if (showFavoritesOnly) return
    isFetchingRef.current = false
    fetchItems(deferredTerm, 0, true)
  }, [deferredTerm, fetchItems, showFavoritesOnly])

  const loadMore = useCallback(() => {
    if (showFavoritesOnly) return
    if (!isFetchingRef.current && hasMore) {
      fetchItems(deferredTerm, offsetRef.current, false)
    }
  }, [deferredTerm, hasMore, fetchItems, showFavoritesOnly])

  return {
    searchTerm,
    setSearchTerm,
    handleClear,
    data: showFavoritesOnly ? favoriteItems : items,
    isLoading: showFavoritesOnly ? false : isLoading,
    isFetchingMore,
    isError,
    error,
    refetch,
    loadMore,
    hasMore: showFavoritesOnly ? false : hasMore,
    showFavoritesOnly,
    setShowFavoritesOnly,
  }
}
