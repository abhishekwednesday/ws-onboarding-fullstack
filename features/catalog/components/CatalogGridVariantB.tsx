"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AddToPlaylistButton } from "@/features/playlist/components/AddToPlaylistButton"
import { trackTrackSelected } from "@/lib/analytics/events"
import { FavoriteButton } from "./FavoriteButton"
import { type CatalogItemType } from "../types/catalog-types"

/**
 * Variant B of the catalog layout: a horizontal row list optimized for scannability.
 * Redesigned with a premium glass list aesthetic.
 */
export function CatalogGridVariantB({ items }: { items: CatalogItemType[] }) {
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <p className="text-muted-foreground text-lg">No tracks found in the catalog.</p>
      </div>
    )
  }

  const handleRowClick = (item: CatalogItemType) => {
    trackTrackSelected(item)
    router.push(`/catalog/${item.id}`)
  }

  const handleRowKeyDown = (e: React.KeyboardEvent, item: CatalogItemType) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.key === " ") e.preventDefault()
      handleRowClick(item)
    }
  }

  return (
    <div className="flex flex-col gap-3" data-testid="catalog-variant-b">
      {items.map((item) => {
        const thumbnailUrl = item.artworkUrl?.replace("100x100bb.jpg", "120x120bb.jpg")

        return (
          <div
            key={item.id}
            className="glass-card group flex cursor-pointer items-center gap-5 p-3 transition-all duration-300 hover:translate-x-1 hover:shadow-md"
            onClick={() => handleRowClick(item)}
            onKeyDown={(e) => handleRowKeyDown(e, item)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${item.title}`}
            data-testid="catalog-card"
          >
            {/* Artwork Thumbnail */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-sm">
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <span className="text-muted-foreground text-[10px]">No Art</span>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p className="text-foreground group-hover:text-primary truncate font-serif text-lg font-bold tracking-tight transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-muted-foreground truncate text-sm font-medium">{item.artist}</p>
                {item.genre && (
                  <span className="text-muted-foreground border-border/50 group-hover:border-primary/30 hidden items-center rounded-full border px-2 py-px text-[9px] font-bold tracking-widest uppercase transition-colors sm:inline-flex">
                    {item.genre}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex items-center gap-2 pr-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:opacity-100"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                  e.stopPropagation()
                }
              }}
            >
              <AddToPlaylistButton
                track={item}
                iconOnly
                className="bg-background/50 hover:bg-background h-9 w-9 shadow-sm transition-all hover:scale-105"
              />
              <FavoriteButton
                track={item}
                iconOnly
                className="bg-background/50 hover:bg-background h-9 w-9 shadow-sm transition-all hover:scale-105"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
