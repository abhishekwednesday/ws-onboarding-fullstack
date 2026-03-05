"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { AddToPlaylistButton } from "@/features/playlist/components/AddToPlaylistButton"
import { trackTrackSelected } from "@/lib/analytics/events"
import { FavoriteButton } from "./FavoriteButton"
import { type CatalogCardPropsType } from "../types/catalog-types"

/**
 * Individual card component for a music track in the catalog.
 * Displays artwork, title, artist, and genre with a link to details.
 */
export function CatalogCard({ item }: CatalogCardPropsType) {
  const router = useRouter()

  const handleCardClick = () => {
    trackTrackSelected(item)
    router.push(`/catalog/${item.id}`)
  }

  const highResArtwork = item.artworkUrl?.replace("100x100bb.jpg", "400x400bb.jpg")
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault()
      }
      handleCardClick()
    }
  }

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="glass-card group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${item.title}`}
      data-testid="catalog-card"
    >
      {/* Artwork Section */}
      <div className="relative aspect-square w-full overflow-hidden">
        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-100 transition-all duration-300 sm:translate-x-4 sm:opacity-0 sm:group-focus-within:translate-x-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
          <FavoriteButton track={item} className="bg-background/40 hover:bg-background/80 shadow-md backdrop-blur-md" />
          <AddToPlaylistButton
            track={item}
            iconOnly
            className="bg-background/40 hover:bg-background/80 shadow-md backdrop-blur-md"
          />
        </div>

        {highResArtwork ? (
          <img
            src={highResArtwork}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="bg-muted absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium">No Artwork</span>
          </div>
        )}

        {/* Inner gradient overlay for artwork base depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-1">
          <p className="text-foreground group-hover:text-primary line-clamp-1 font-serif text-lg font-bold tracking-tight transition-colors">
            {item.title}
          </p>
          <p className="text-muted-foreground line-clamp-1 text-sm font-medium">{item.artist}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="border-border/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors">
            {item.genre || "Music"}
          </span>
          {item.trackViewUrl && item.trackViewUrl.startsWith("https://") ? (
            <a
              href={item.trackViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBadgeClick}
              aria-label="Listen on Apple Music"
              className="opacity-50 transition-opacity hover:opacity-100"
            >
              <img src="/images/branding/itunes-badge.png" alt="Listen on Apple Music" className="h-5 w-auto" />
            </a>
          ) : item.trackViewUrl ? (
            <span
              onClick={handleBadgeClick}
              aria-label="Listen on Apple Music"
              className="opacity-50 transition-opacity hover:opacity-100 cursor-not-allowed"
            >
              <img src="/images/branding/itunes-badge.png" alt="Listen on Apple Music" className="h-5 w-auto" />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
