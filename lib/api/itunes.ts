import { ItunesSearchResponseSchema, type ItunesSearchResponseType } from "./schemas"

const ITUNES_BASE_URL = "https://itunes.apple.com"
export const ITUNES_PAGE_SIZE = 50

export async function searchItunes(term: string, offset: number = 0): Promise<ItunesSearchResponseType> {
  if (!term) {
    return { resultCount: 0, results: [] }
  }

  const url = new URL("/search", ITUNES_BASE_URL)
  url.searchParams.set("term", term)
  url.searchParams.set("media", "music")
  url.searchParams.set("entity", "song")
  url.searchParams.set("limit", ITUNES_PAGE_SIZE.toString())
  if (offset > 0) {
    url.searchParams.set("offset", offset.toString())
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.statusText}`)
  }

  const data = await response.json()

  // Validate and parse the response using Zod
  return ItunesSearchResponseSchema.parse(data)
}

export async function lookupItunesTrack(id: number): Promise<ItunesSearchResponseType> {
  const url = new URL("/lookup", ITUNES_BASE_URL)
  url.searchParams.set("id", String(id))
  url.searchParams.set("entity", "song")

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.statusText}`)
  }

  const data = await response.json()
  const parsed = ItunesSearchResponseSchema.parse(data)

  if (parsed.resultCount === 0) {
    throw new Error(`Track with id ${id} not found`)
  }

  return parsed
}

/**
 * Fetches specific tracks by their iTunes IDs.
 */
export async function lookupItunes(ids: number[]): Promise<ItunesSearchResponseType> {
  if (ids.length === 0) return { resultCount: 0, results: [] }

  const url = new URL("/lookup", ITUNES_BASE_URL)
  url.searchParams.set("id", ids.join(","))
  url.searchParams.set("entity", "song")

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`iTunes API lookup error: ${response.statusText}`)
  }

  const data = await response.json()
  return ItunesSearchResponseSchema.parse(data)
}
