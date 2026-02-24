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
 * Loading state component for the catalog grid.
 * Renders a grid of square skeleton cards matching the new artwork-blend layout.
 */
export function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <CatalogCardSkeleton key={i} />
      ))}
    </div>
  )
}
