import {
  CatalogMediaType,
  ItunesSearchResponseSchema,
  type ItunesSearchResponseType,
  type SearchOptions,
} from "./schemas"

const ITUNES_BASE_URL = "https://itunes.apple.com"
export const ITUNES_PAGE_SIZE = 50

export async function searchItunes(
  term: string,
  options: Omit<SearchOptions, "term"> = {}
): Promise<ItunesSearchResponseType> {
  if (!term) {
    return { resultCount: 0, results: [] }
  }

  const limit = options.limit ?? ITUNES_PAGE_SIZE
  const offset = options.offset || 0

  const url = new URL("/search", ITUNES_BASE_URL)
  url.searchParams.set("term", term)

  if (options.media) url.searchParams.set("media", options.media)
  else url.searchParams.set("media", CatalogMediaType.MUSIC) // Backwards compatible default

  if (options.entity) url.searchParams.set("entity", options.entity)
  else if (!options.media || options.media === CatalogMediaType.MUSIC) {
    url.searchParams.set("entity", "song")
  }

  if (options.attribute) url.searchParams.set("attribute", options.attribute)
  if (options.country) url.searchParams.set("country", options.country)
  if (options.lang) url.searchParams.set("lang", options.lang)
  if (options.explicit) url.searchParams.set("explicit", options.explicit)

  url.searchParams.set("limit", limit.toString())
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

export async function lookupItunesTrack(id: number, entity: string = "song"): Promise<ItunesSearchResponseType> {
  const url = new URL("/lookup", ITUNES_BASE_URL)
  url.searchParams.set("id", String(id))
  url.searchParams.set("entity", entity)

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
export async function lookupItunes(ids: number[], entity: string = "song"): Promise<ItunesSearchResponseType> {
  if (ids.length === 0) return { resultCount: 0, results: [] }

  const url = new URL("/lookup", ITUNES_BASE_URL)
  url.searchParams.set("id", ids.join(","))
  url.searchParams.set("entity", entity)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`iTunes API lookup error: ${response.statusText}`)
  }

  const data = await response.json()
  return ItunesSearchResponseSchema.parse(data)
}
