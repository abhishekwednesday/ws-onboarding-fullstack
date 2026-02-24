"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { type CatalogItemType } from "../types/catalog-types"

interface CatalogCardPropsType {
  item: CatalogItemType
}

export function CatalogCard({ item }: CatalogCardPropsType) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/catalog/${item.id}`)
  }

  const highResArtwork = item.artworkUrl?.replace("100x100bb.jpg", "400x400bb.jpg")

  return (
    <div
      className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`View details for ${item.title}`}
      data-testid="catalog-card"
    >
      {/* Artwork */}
      {highResArtwork ? (
        <img
          src={highResArtwork}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="bg-muted absolute inset-0 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">No Artwork</span>
        </div>
      )}

      {/* Gradient overlay — artwork blends into dark at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Track info overlaid on the gradient */}
      <div className="absolute right-0 bottom-0 left-0 space-y-0.5 p-4">
        <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>
        <p className="line-clamp-1 text-xs text-white/70">{item.artist}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/80 uppercase backdrop-blur-sm">
            {item.genre || "Music"}
          </span>
          {item.trackViewUrl && (
            <a
              href={item.trackViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Listen on Apple Music"
              className="text-white/50 transition-colors hover:text-white/90"
            >
              <img
                src="/images/branding/itunes-badge.png"
                alt="Listen on Apple Music"
                className="h-5 w-auto opacity-70 transition-opacity hover:opacity-100"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
