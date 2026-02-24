"use client"

import { Heart } from "lucide-react"
import * as React from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CatalogList } from "./CatalogList"
import { EmptyState } from "./EmptyState"
import { ErrorState } from "./ErrorState"
import { CatalogCardSkeleton, LoadingState } from "./LoadingState"
import { SearchInput } from "./SearchInput"
import { useCatalog } from "../hooks/useCatalog"
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"

/**
 * Catalog page inner component.
 * Must be rendered inside a <Suspense> boundary because useCatalog
 * uses useSearchParams (required by App Router).
 */
export function CatalogPage() {
  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    handleClear,
    loadMore,
    hasMore,
    isFetchingMore,
    showFavoritesOnly,
    setShowFavoritesOnly,
  } = useCatalog()

  const { sentinelRef } = useInfiniteScroll({
    onIntersect: loadMore,
    enabled: !isLoading && !isFetchingMore && hasMore,
  })

  return (
    <div className="space-y-8 py-10">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Music Catalog</h1>
          <p className="text-muted-foreground max-w-[500px] text-sm">
            Discover and explore millions of tracks and artists from the iTunes library.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput value={searchTerm} onChange={setSearchTerm} onClear={handleClear} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                    showFavoritesOnly
                      ? "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-900/20"
                      : "bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground border-gray-300 backdrop-blur-sm"
                  )}
                  aria-label={showFavoritesOnly ? "Show all tracks" : "Show favorites only"}
                >
                  <Heart className={cn("h-5 w-5", showFavoritesOnly && "fill-current")} />
                </button>
              </TooltipTrigger>
              <TooltipContent>{showFavoritesOnly ? "Showing Favorites" : "Show Favorites Only"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="border-t pt-10">
        {isLoading && <LoadingState />}

        {isError && (
          <ErrorState message={(error as Error)?.message || "Please try again later."} onRetry={() => refetch()} />
        )}

        {!isLoading && !isError && (
          <>
            {items.length > 0 ? (
              <div className="space-y-6">
                <CatalogList items={items} />

                {isFetchingMore && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <CatalogCardSkeleton key={`skeleton-${i}`} />
                    ))}
                  </div>
                )}

                <div ref={sentinelRef} className="flex justify-center py-4">
                  {!hasMore && (
                    <p className="text-muted-foreground text-sm font-medium">You've reached the end of the catalog.</p>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState onReset={handleClear} />
            )}

            <div className="flex flex-col items-center gap-2 border-t pt-8">
              <p className="text-muted-foreground/40 text-xs italic">Data provided courtesy of iTunes</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
