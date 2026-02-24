"use server"

import { type CatalogItemType, mapItunesTrackToCatalogItem } from "@/features/catalog/types/catalog-types"
import { lookupItunesTrack } from "@/lib/api/itunes"

/**
 * Server action to look up a single iTunes track by its numeric ID.
 * Independent of catalog list state — safe to call on page refresh.
 *
 * @param id The iTunes trackId.
 * @returns A promise that resolves to the mapped CatalogItemType.
 * @throws A user-friendly error if the lookup fails or the track is not found.
 */
export async function itunesLookupAction(id: number): Promise<CatalogItemType> {
  try {
    const response = await lookupItunesTrack(id)
    const track = response.results[0]
    if (!track) {
      throw new Error(`Track with id ${id} not found`)
    }
    return mapItunesTrackToCatalogItem(track)
  } catch (error) {
    console.error("iTunes Lookup Server Action Error:", error)
    throw new Error("Failed to load track details. Please try again.")
  }
}
