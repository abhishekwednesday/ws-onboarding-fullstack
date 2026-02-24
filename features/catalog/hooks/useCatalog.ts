"use client"

import * as React from "react"

import { useCatalogQuery } from "./useCatalogQuery"

/**
 * Custom hook to manage catalog state, including search and debouncing.
 */
export function useCatalog() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedTerm, setDebouncedTerm] = React.useState("")

  // Debounce logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 500) // 500ms debounce delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Use the existing query hook with the debounced term
  // If debouncedTerm is empty, useCatalogQuery defaults to "top music"
  const query = useCatalogQuery(debouncedTerm || "top music")

  const handleClear = React.useCallback(() => {
    setSearchTerm("")
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    handleClear,
    ...query,
  }
}
