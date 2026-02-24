"use client"

import * as React from "react"

import { CatalogList } from "./CatalogList"
import { EmptyState } from "./EmptyState"
import { ErrorState } from "./ErrorState"
import { CatalogCardSkeleton, LoadingState } from "./LoadingState"
import { SearchInput } from "./SearchInput"
import { useCatalog } from "../hooks/useCatalog"
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"

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
        <SearchInput value={searchTerm} onChange={setSearchTerm} onClear={handleClear} />
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
          </>
        )}
      </div>
    </div>
  )
}
