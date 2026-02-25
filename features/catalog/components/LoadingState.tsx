import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton for a single catalog card — matches the new artwork-blend square design.
 */
export function CatalogCardSkeleton() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
      <Skeleton className="absolute inset-0 h-full w-full" />
      {/* Simulated overlay strip at the bottom */}
      <div className="absolute right-0 bottom-0 left-0 space-y-1.5 p-4">
        <Skeleton className="h-3.5 w-2/3 bg-white/20" />
        <Skeleton className="h-3 w-1/2 bg-white/15" />
      </div>
    </div>
  )
}

/**
 * Skeleton for a single catalog row — matches CatalogGridVariantB.
 */
export function CatalogRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-2 py-3">
      <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
    </div>
  )
}

/**
 * Loading state component for the catalog grid.
 * Renders a grid of square skeleton cards matching the new artwork-blend layout.
 */
export function LoadingState({ isNewLayout = false }: { isNewLayout?: boolean }) {
  if (isNewLayout) {
    return (
      <div className="flex flex-col divide-y">
        {Array.from({ length: 10 }).map((_, i) => (
          <CatalogRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <CatalogCardSkeleton key={i} />
      ))}
    </div>
  )
}
