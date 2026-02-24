"use client"

import * as React from "react"

import { CatalogList } from "./CatalogList"
import { EmptyState } from "./EmptyState"
import { ErrorState } from "./ErrorState"
import { LoadingState } from "./LoadingState"
import { SearchInput } from "./SearchInput"
import { useCatalog } from "../hooks/useCatalog"

/**
 * The main container component for the Music Catalog.
 * Manages the data and layout of the catalog view.
 */
export function CatalogPage() {
  const { data: items, isLoading, isError, error, refetch, searchTerm, setSearchTerm, handleClear } = useCatalog()

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

        {!isLoading && !isError && items && (
          <>{items.length > 0 ? <CatalogList items={items} /> : <EmptyState onReset={handleClear} />}</>
        )}
      </div>
    </div>
  )
}
