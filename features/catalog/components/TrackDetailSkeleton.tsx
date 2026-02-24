import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton loader for the /catalog/[id] detail page.
 * Matches the compact side-by-side layout: small artwork thumbnail on the left,
 * stacked metadata lines on the right, and a play button stub.
 */
export function TrackDetailSkeleton() {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
      {/* Artwork thumbnail */}
      <Skeleton className="mx-auto aspect-square w-56 shrink-0 rounded-2xl md:mx-0 md:w-72" />

      {/* Metadata */}
      <div className="flex flex-col justify-center space-y-5 pt-2">
        {/* Genre pill */}
        <Skeleton className="h-5 w-16 rounded-full" />

        {/* Title, artist, album */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Duration */}
        <Skeleton className="h-4 w-14" />

        {/* Play button stub */}
        <Skeleton className="h-11 w-36 rounded-full" />

        {/* iTunes badge stub */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}
