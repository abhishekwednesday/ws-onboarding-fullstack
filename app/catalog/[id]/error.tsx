"use client"

import { useEffect } from "react"

import { ErrorState } from "@/features/catalog/components/ErrorState"
import { type ErrorPagePropsType } from "@/features/catalog/types/catalog-types"

export default function Error({ error, reset }: ErrorPagePropsType) {
  useEffect(() => {
    console.error("Catalog track detail error:", error)
  }, [error])

  return <ErrorState message={error.message || "Failed to load track details. Please try again."} onRetry={reset} />
}
