import * as React from "react"

import { type CatalogItemType } from "./catalog-types"
import { CatalogCard } from "./CatalogCard"

interface CatalogListPropsType {
  items: CatalogItemType[]
}

/**
 * A grid component that renders a list of music items.
 */
export function CatalogList({ items }: CatalogListPropsType) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <p className="text-muted-foreground text-lg">No tracks found in the catalog.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <CatalogCard key={item.id} item={item} />
      ))}
    </div>
  )
}
