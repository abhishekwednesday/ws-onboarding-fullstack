"use client"

import { useEffect } from "react"

import { ErrorState } from "@/features/catalog/components/ErrorState"

interface ErrorPagePropsType {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPagePropsType) {
  useEffect(() => {
    console.error("Catalog track detail error:", error)
  }, [error])

  return <ErrorState message={error.message || "Failed to load track details. Please try again."} onRetry={reset} />
}
