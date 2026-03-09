"use server"

import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { mapItunesItemToCatalogItem } from "@/features/catalog/utils/mappers"
import { ITUNES_PAGE_SIZE, lookupItunes, lookupItunesTrack, searchItunes } from "@/lib/api/itunes"
import { type ItunesSearchResponseType } from "@/lib/api/schemas"

/**
 * Server action to search the iTunes API.
 * This provides a secure and standardized way for the client to fetch music data.
 *
 * @param term The search term (artist, track, or album name).
 * @param offset The offset for pagination.
 * @returns A promise that resolves to the itunes search response.
 */
export async function itunesSearchAction(
  term: string,
  offset: number = 0
): Promise<{ items: CatalogItemType[]; nextOffset: number | null; totalCount: number }> {
  try {
    const response = await searchItunes(term, { offset })
    const items = response.results
      .map((item) => mapItunesItemToCatalogItem(item))
      .filter((i): i is CatalogItemType => i !== null)

    return {
      items,
      nextOffset: response.resultCount === ITUNES_PAGE_SIZE ? offset + ITUNES_PAGE_SIZE : null,
      totalCount: response.resultCount,
    }
  } catch (error) {
    console.error("ITunes Search Server Action Error:", error)
    throw new Error("Failed to fetch data from ITunes API.")
  }
}

/**
 * Server action to look up tracks by ID.
 *
 * @param ids Array of iTunes track IDs.
 * @returns A promise that resolves to the itunes response.
 */
export async function itunesLookupAction(ids: number[]): Promise<ItunesSearchResponseType> {
  if (ids.length === 0) return { resultCount: 0, results: [] }
  try {
    return await lookupItunes(ids)
  } catch (error) {
    console.error("ITunes Lookup Server Action Error:", error)
    throw new Error("Failed to lookup tracks from ITunes API.")
  }
}

/**
 * Server action to look up a single track by ID.
 * Maps result to CatalogItemType.
 */
export async function itunesLookupSingleAction(id: number): Promise<CatalogItemType> {
  try {
    const response = await lookupItunesTrack(id)
    const track = response.results[0]
    if (!track) throw new Error(`Track with id ${id} not found`)
    const mapped = mapItunesItemToCatalogItem(track)
    if (!mapped) throw new Error(`Track with id ${id} could not be mapped`)
    return mapped
  } catch (error) {
    console.error("ITunes Single Lookup Error:", error)
    if (error instanceof Error && error.message.includes("not found")) {
      throw error
    }
    throw new Error("Failed to load track details. Please try again.")
  }
}
