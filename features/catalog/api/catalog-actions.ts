"use server"

import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { mapItunesItemToCatalogItem } from "@/features/catalog/utils/mappers"
import { ITUNES_PAGE_SIZE, lookupItunes, lookupItunesTrack, searchItunes } from "@/lib/api/itunes"
import { type ItunesSearchResponseType, type SearchOptions } from "@/lib/api/schemas"

/**
 * Server action to search the iTunes API.
 * This provides a secure and standardized way for the client to fetch music data.
 *
 * @param term The search term (artist, track, or album name).
 * @param options Additional search options (offset, country, media, explicit).
 * @returns A promise that resolves to the itunes search response.
 */
export async function itunesSearchAction(
  term: string,
  options: Omit<SearchOptions, "term"> = {}
): Promise<{ items: CatalogItemType[]; nextOffset: number | null; totalCount: number }> {
  try {
    const response = await searchItunes(term, options)
    const items = response.results
      .map((item) => mapItunesItemToCatalogItem(item))
      .filter((i): i is CatalogItemType => i !== null)

    const limit = options.limit ?? ITUNES_PAGE_SIZE
    const offset = options.offset ?? 0

    return {
      items,
      nextOffset: response.resultCount === limit ? offset + limit : null,
      totalCount: response.resultCount,
    }
  } catch (error) {
    console.error("ITunes Search Server Action Error:", error)
    throw new Error("Failed to fetch data from ITunes API.")
  }
}

/**
 * Server action to look up an artist and their albums.
 *
 * @param artistId The iTunes artist identifier.
 * @returns A promise that resolves to the artist info and albums.
 */
export async function itunesArtistLookupAction(
  artistId: number
): Promise<{ artist: CatalogItemType; albums: CatalogItemType[] }> {
  try {
    // lookup with entity=album will return the artist and their albums
    const response = await lookupItunes([artistId], "album")
    const results = response.results
      .map((item) => mapItunesItemToCatalogItem(item))
      .filter((i): i is CatalogItemType => i !== null)

    const artist = results.find((r) => r.id === artistId)
    const albums = results.filter((r) => r.id !== artistId)

    if (!artist) {
      throw new Error(`Artist with id ${artistId} not found`)
    }

    return { artist, albums }
  } catch (error) {
    console.error("ITunes Artist Lookup Error:", error)
    throw new Error("Failed to load artist details. Please try again.")
  }
}

/**
 * Server action to look up an album and its tracks.
 *
 * @param collectionId The iTunes collection identifier.
 * @returns A promise that resolves to the album info and items.
 */
export async function itunesAlbumLookupAction(
  collectionId: number
): Promise<{ album: CatalogItemType; items: CatalogItemType[] }> {
  try {
    // lookup with entity=song will return the album and its tracks
    const response = await lookupItunes([collectionId], "song")
    const results = response.results
      .map((item) => mapItunesItemToCatalogItem(item))
      .filter((i): i is CatalogItemType => i !== null)

    const album = results.find((r) => r.id === collectionId)
    const items = results.filter((r) => r.id !== collectionId)

    if (!album) {
      throw new Error(`Album with id ${collectionId} not found`)
    }

    return { album, items }
  } catch (error) {
    console.error("ITunes Album Lookup Error:", error)
    throw new Error("Failed to load album details. Please try again.")
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
