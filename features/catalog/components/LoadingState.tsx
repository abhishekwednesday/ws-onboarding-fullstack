import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton for a single catalog card — matches the artwork-blend grid design (Variant A).
 */
export function CatalogCardSkeleton() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
      <Skeleton className="absolute inset-0 h-full w-full" />
      {/* Simulated overlay strip at the bottom */}
      <div className="absolute right-0 bottom-0 left-0 space-y-1.5 p-4">
        <Skeleton className="bg-muted h-3.5 w-2/3" />
        <Skeleton className="bg-muted h-3 w-1/2" />
      </div>
    </div>
  )
}

/**
 * Skeleton for a single catalog row — matches CatalogGridVariantB (Variant B).
 */
export function CatalogRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-2 py-3">
      <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
      {/* Genre stub - hidden on mobile like the real component */}
      <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
      {/* Favorite button stub */}
      <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
    </div>
  )
}

/**
 * Loading state component for the catalog.
 * Renders a list/grid of skeletons matching the active layout variant.
 */
export function LoadingState({ isNewLayout = false, count = 10 }: { isNewLayout?: boolean; count?: number }) {
  if (isNewLayout) {
    return (
      <div className="flex flex-col divide-y">
        {Array.from({ length: count }).map((_, i) => (
          <CatalogRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <CatalogCardSkeleton key={i} />
      ))}
    </div>
  )
}
