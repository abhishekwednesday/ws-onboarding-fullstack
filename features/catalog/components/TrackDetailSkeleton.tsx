import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton loader for the /catalog/[id] detail page.
 * Matches the 2-column layout: large artwork block on the left,
 * stacked metadata lines on the right.
 */
export function TrackDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
      {/* Artwork placeholder */}
      <Skeleton className="aspect-square w-full rounded-xl" />

      {/* Metadata placeholders */}
      <div className="flex flex-col justify-center space-y-6">
        {/* Genre pill */}
        <Skeleton className="h-5 w-16 rounded-full" />

        {/* Title */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-2/5" />
        </div>

        {/* Duration */}
        <Skeleton className="h-4 w-16" />

        <hr className="border-border" />

        {/* iTunes badge area */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  )
}
