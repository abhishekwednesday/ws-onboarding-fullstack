import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton loader for the /catalog/[id] detail page.
 * Matches the centred music-player layout:
 *   - Square artwork block at the top
 *   - Track title / artist / album stubs
 *   - Progress bar stub
 *   - Large circular play button stub
 *   - iTunes compliance stub
 */
export function TrackDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      {/* Artwork */}
      <Skeleton className="aspect-square w-full rounded-3xl" />

      {/* Track info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-2/5" />
          </div>
          <Skeleton className="mt-1 h-5 w-16 shrink-0 rounded-full" />
        </div>
        <Skeleton className="h-3 w-14" />
      </div>

      {/* Progress bar + timestamps */}
      <div className="space-y-1">
        <Skeleton className="h-1.5 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Circular play button */}
      <div className="flex justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>

      {/* iTunes compliance */}
      <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-4">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}
