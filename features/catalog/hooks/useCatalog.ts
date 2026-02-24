"use client"

import * as React from "react"
import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react"

import { itunesSearchAction } from "@/actions/catalog/catalog-actions"
import { type CatalogItemType, mapItunesTrackToCatalogItem } from "../types/catalog-types"

const PAGE_SIZE = 50

export function useCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const deferredTerm = useDeferredValue(searchTerm)

  const [items, setItems] = useState<CatalogItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const offsetRef = useRef(0)
  const isFetchingRef = useRef(false)
  const fetchIdRef = useRef(0)
  const lastTermRef = useRef<string | null>(null)

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

      // Always advance by PAGE_SIZE for the next call
      offsetRef.current = offset + PAGE_SIZE

      if (isReset) {
        setItems(newItems)
        setHasMore(newItems.length === PAGE_SIZE)
      } else {
        // Filter duplicates and check if we got any new unique items
        setItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id))
          const unique = newItems.filter((item) => !existingIds.has(item.id))

          // If API returned full page but ALL were duplicates, stop paginating
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
    const query = deferredTerm || "top music"
    if (lastTermRef.current === null || query !== lastTermRef.current) {
      lastTermRef.current = query
      isFetchingRef.current = false
      fetchItems(deferredTerm, 0, true)
    }
  }, [deferredTerm, fetchItems])

  const loadMore = useCallback(() => {
    if (!isFetchingRef.current && hasMore) {
      fetchItems(deferredTerm, offsetRef.current, false)
    }
  }, [deferredTerm, hasMore, fetchItems])

  const handleClear = useCallback(() => {
    setSearchTerm("")
  }, [])

  const refetch = useCallback(() => {
    isFetchingRef.current = false
    fetchItems(deferredTerm, 0, true)
  }, [deferredTerm, fetchItems])

  return {
    searchTerm,
    setSearchTerm,
    handleClear,
    data: items,
    isLoading,
    isFetchingMore,
    isError,
    error,
    refetch,
    loadMore,
    hasMore,
  }
}
