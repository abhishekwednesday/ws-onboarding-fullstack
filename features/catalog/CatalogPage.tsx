import * as React from "react"

import { MOCK_CATALOG_ITEMS } from "./catalog-types"
import { CatalogList } from "./CatalogList"

/**
 * The main container component for the Music Catalog.
 * Manages the data and layout of the catalog view.
 */
export function CatalogPage() {
  return (
    <div className="space-y-8 py-10">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Music Catalog</h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          Discover and explore millions of tracks, albums, and artists from the iTunes library. Start your musical
          journey today.
        </p>
      </div>

      <div className="border-t pt-10">
        <CatalogList items={MOCK_CATALOG_ITEMS} />
      </div>
    </div>
  )
}
