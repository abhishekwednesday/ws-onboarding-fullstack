import * as React from "react"

import { FavoriteButton } from "./FavoriteButton"
import { type CatalogItemType } from "../types/catalog-types"

interface CatalogGridVariantBPropsType {
  items: CatalogItemType[]
}

/**
 * Variant B of the catalog layout: a horizontal row list optimised for scannability.
 * Used in the `new-catalog-layout` A/B experiment as the treatment condition.
 */
export function CatalogGridVariantB({ items }: CatalogGridVariantBPropsType) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <p className="text-muted-foreground text-lg">No tracks found in the catalog.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y" data-testid="catalog-variant-b">
      {items.map((item) => {
        const highResArtwork = item.artworkUrl?.replace("100x100bb.jpg", "400x400bb.jpg")

        return (
          <div key={item.id} className="hover:bg-muted/50 flex items-center gap-4 px-2 py-3 transition-colors">
            {highResArtwork ? (
              <img src={highResArtwork} alt={item.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="bg-muted h-12 w-12 shrink-0 rounded-lg" />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <p className="text-muted-foreground truncate text-xs">{item.artist}</p>
            </div>

            {item.genre && (
              <span className="text-muted-foreground hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase sm:inline">
                {item.genre}
              </span>
            )}

            <FavoriteButton track={item} iconOnly />
          </div>
        )
      })}
    </div>
  )
}
