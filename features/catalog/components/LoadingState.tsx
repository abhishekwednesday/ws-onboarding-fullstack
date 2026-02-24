import * as React from "react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * A skeleton component that mimics the CatalogCard layout.
 */
export function CatalogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="aspect-square w-full" />
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-3 w-10" />
      </CardFooter>
    </Card>
  )
}

/**
 * Loading state component for the catalog grid.
 * Renders a grid of skeletons to maintain layout consistency.
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
