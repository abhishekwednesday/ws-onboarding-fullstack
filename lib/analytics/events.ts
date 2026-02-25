import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

import { posthogClient } from "./posthog-client"

/** Valid theme values emitted by the theme toggle. */
type ThemeValueType = "light" | "dark" | "system"

const ALLOWED_THEMES: ReadonlySet<string> = new Set(["light", "dark", "system"])

/** Redacts email addresses, phone numbers, and numeric IDs from a search term. */
function sanitizeSearchTerm(term: string): string {
  return term
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email]")
    .replace(/(?<!\w)\+?[\d][\d\s\-().]{6,}/g, "[phone]")
    .trim()
}

/**
 * Tracks a catalog search event when the user submits a search term.
 * The term is sanitized before capture to prevent PII leakage.
 */
export function trackCatalogSearch(term: string): void {
  posthogClient.capture("catalog_search", { search_term: sanitizeSearchTerm(term) })
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
 * Only the canonical theme values (`light`, `dark`, `system`) are emitted.
 */
export function trackThemeToggled(theme: ThemeValueType): void {
  const safeTheme = ALLOWED_THEMES.has(theme) ? theme : "unknown"
  posthogClient.capture("theme_toggled", { theme: safeTheme })
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

/**
 * Tracks a pageview event on App Router navigations.
 */
export function trackPageView(currentUrl: string): void {
  posthogClient.capture("$pageview", { $current_url: currentUrl })
}
