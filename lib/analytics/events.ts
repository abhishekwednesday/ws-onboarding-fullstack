import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

import { posthogClient } from "./posthog-client"

/**
 * Tracks a catalog search event when the user submits a search term.
 */
export function trackCatalogSearch(term: string): void {
  posthogClient.capture("catalog_search", { search_term: term })
}

/**
 * Tracks a track selection event when the user opens a track detail page.
 */
export function trackTrackSelected(item: CatalogItemType): void {
  posthogClient.capture("track_selected", {
    track_id: item.id,
    title: item.title,
    artist: item.artist,
    genre: item.genre,
  })
}

/**
 * Tracks a theme change event when the user toggles the color scheme.
 */
export function trackThemeToggled(theme: string): void {
  posthogClient.capture("theme_toggled", { theme })
}

/**
 * Tracks a favorite addition event.
 */
export function trackFavoriteAdded(track: CatalogItemType): void {
  posthogClient.capture("favorite_added", {
    track_id: track.id,
    title: track.title,
    artist: track.artist,
  })
}

/**
 * Tracks a favorite removal event.
 */
export function trackFavoriteRemoved(track: CatalogItemType): void {
  posthogClient.capture("favorite_removed", {
    track_id: track.id,
    title: track.title,
    artist: track.artist,
  })
}
