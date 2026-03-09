"use client"

import { Heart } from "lucide-react"
import * as React from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FLAG_NEW_CATALOG_LAYOUT, useFeatureFlag } from "@/lib/feature-flags/flags"
import { cn } from "@/lib/utils"
import { CatalogGridVariantB } from "./CatalogGridVariantB"
import { CatalogList } from "./CatalogList"
import { EmptyState } from "./EmptyState"
import { ErrorState } from "./ErrorState"
import { LoadingState } from "./LoadingState"
import { SearchInput } from "./SearchInput"
import { useCatalog } from "../hooks/useCatalog"
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"

/**
 * Main catalog page component.
 * Displays a searchable list of music tracks with infinite scrolling and a favorites toggle.
 */
export function CatalogPage() {
  const [isMounted, setIsMounted] = React.useState(false)
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
    isSearchPending,
    shouldShowFavoritesOnly,
    toggleShowFavoritesOnly,
    debouncedSearchTerm,
  } = useCatalog()

  const flagEnabled = useFeatureFlag(FLAG_NEW_CATALOG_LAYOUT)
  const isNewLayout = isMounted && flagEnabled

  // Ensure we scroll to top when toggling views or searching
  // Also handle mount state for hydration safety
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [shouldShowFavoritesOnly, debouncedSearchTerm])

  const { sentinelRef } = useInfiniteScroll({
    onIntersect: loadMore,
    enabled: !isLoading && !isFetchingMore && hasMore,
  })

  return (
    <div className="space-y-8 py-10">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-2">
          <h1 className="text-foreground font-serif text-4xl font-bold tracking-tight sm:text-5xl">Music Catalog</h1>
          <p className="text-muted-foreground max-w-[500px] text-base leading-relaxed">
            Discover and explore millions of tracks and artists from the iTunes library.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput value={searchTerm} onChange={setSearchTerm} onClear={handleClear} isPending={isSearchPending} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleShowFavoritesOnly}
                  className={cn(
                    "group flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300",
                    shouldShowFavoritesOnly
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                      : "bg-background/40 text-muted-foreground hover:bg-background hover:text-foreground border-border/50 backdrop-blur-md hover:shadow-sm"
                  )}
                  aria-label={shouldShowFavoritesOnly ? "Show all tracks" : "Show favorites only"}
                >
                  <Heart
                    className={cn(
                      "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                      shouldShowFavoritesOnly && "fill-current"
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>{shouldShowFavoritesOnly ? "Showing Favorites" : "Show Favorites Only"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="border-border/40 border-t pt-10">
        {isLoading && <LoadingState isNewLayout={isNewLayout} />}

        {isError && (
          <ErrorState message={(error as Error)?.message || "Please try again later."} onRetry={() => refetch()} />
        )}

        {!isLoading && !isError && (
          <>
            {items.length > 0 ? (
              <div className="space-y-6">
                {isNewLayout ? <CatalogGridVariantB items={items} /> : <CatalogList items={items} />}

                {isFetchingMore && <LoadingState isNewLayout={isNewLayout} count={5} />}

                <div ref={sentinelRef} className="flex justify-center py-4">
                  {!hasMore && (
                    <p className="text-muted-foreground text-sm font-medium">You've reached the end of the catalog.</p>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState onReset={handleClear} />
            )}

            <div className="border-border/40 flex flex-col items-center gap-2 border-t pt-8">
              <p className="text-muted-foreground/40 text-xs italic">Data provided courtesy of iTunes</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
