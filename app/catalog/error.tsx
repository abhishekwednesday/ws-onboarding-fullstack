"use client"

import { useEffect } from "react"

import { ErrorState } from "@/features/catalog/components/ErrorState"
import { type ErrorPagePropsType } from "@/features/catalog/types/catalog-types"

export default function Error({ error, reset }: ErrorPagePropsType) {
  useEffect(() => {
    console.error("Catalog error:", error)
  }, [error])

  return <ErrorState message={error.message || "Failed to load the catalog. Please try again."} onRetry={reset} />
}
