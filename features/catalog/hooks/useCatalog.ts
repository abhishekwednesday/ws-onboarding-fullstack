"use client"

import * as React from "react"
import { useCallback, useDeferredValue, useState } from "react"

import { useCatalogQuery } from "./useCatalogQuery"

export function useCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  // useDeferredValue provides a way to defer updating a part of the UI
  const deferredTerm = useDeferredValue(searchTerm)

  const query = useCatalogQuery(deferredTerm || "top music")

  const handleClear = useCallback(() => {
    setSearchTerm("")
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    handleClear,
    ...query,
  }
}
