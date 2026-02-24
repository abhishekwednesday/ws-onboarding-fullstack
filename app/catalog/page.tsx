import { Metadata } from "next"
import * as React from "react"
import { Suspense } from "react"

import { CatalogPage } from "@/features/catalog/components/CatalogPage"
import { LoadingState } from "@/features/catalog/components/LoadingState"

export const metadata: Metadata = {
  title: "Catalog - MusicStream",
  description: "Browse and discover music in our extensive catalog.",
}

/**
 * Route handler for /catalog.
 * Wraps CatalogPage in Suspense because it uses useSearchParams (App Router requirement).
 */
export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CatalogPage />
    </Suspense>
  )
}
