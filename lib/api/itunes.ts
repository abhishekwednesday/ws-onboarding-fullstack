import { type ItunesSearchResponse, ItunesSearchResponseSchema } from "./schemas"

const ITUNES_BASE_URL = "https://itunes.apple.com"

export async function searchItunes(term: string): Promise<ItunesSearchResponse> {
  if (!term) {
    return { resultCount: 0, results: [] }
  }

  const url = new URL("/search", ITUNES_BASE_URL)
  url.searchParams.set("term", term)
  url.searchParams.set("media", "music")
  url.searchParams.set("entity", "song")
  url.searchParams.set("limit", "50")

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.statusText}`)
  }

  const data = await response.json()

  // Validate and parse the response using Zod
  return ItunesSearchResponseSchema.parse(data)
}
