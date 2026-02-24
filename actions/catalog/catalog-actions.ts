"use server"

import { searchItunes } from "@/lib/api/itunes"
import { type ItunesSearchResponseType } from "@/lib/api/schemas"

/**
 * Server action to search the iTunes API.
 * This provides a secure and standardized way for the client to fetch music data.
 *
 * @param term The search term (artist, track, or album name).
 * @returns A promise that resolves to the itunes search response.
 */
export async function itunesSearchAction(term: string): Promise<ItunesSearchResponseType> {
  try {
    return await searchItunes(term)
  } catch (error) {
    console.error("ITunes Search Server Action Error:", error)
    throw new Error("Failed to fetch data from ITunes API.")
  }
}
