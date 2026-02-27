"use server"

import { itunesSearchAction } from "@/features/catalog/api/catalog-actions"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { getLikedSongsAction } from "@/features/playlist/api/playlist-sync"
import { getAuthenticatedUserId, withAuthenticatedClient } from "@/features/playlist/api/playlist-utils"
import { type ActionState, withActionHandler } from "@/lib/utils/action-handler"

const FALLBACK_TERMS = ["pop", "rock"] as const

/**
 * Fetches recommended tracks based on the user's liked songs and playlists.
 */
export async function getRecommendedTracksAction(): Promise<ActionState<CatalogItemType[]>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    // 1. Get liked songs as seed data
    const likedRes = await getLikedSongsAction()
    if (!likedRes.success) {
      throw new Error(likedRes.error ?? "Failed to fetch liked songs")
    }
    const likedSongs = likedRes.data

    // 2. Query recent tracks added to custom playlists to filter out from recommendations
    const playlistTracks = await withAuthenticatedClient(userId, async (client) => {
      const result = await client.query(
        `SELECT pt."trackId" 
         FROM "playlist" p
         JOIN "playlist_track" pt ON pt."playlistId" = p."id"
         WHERE p."userId" = $1 AND p."isLiked" = FALSE
         ORDER BY pt."addedAt" DESC
         LIMIT 50`,
        [userId]
      )
      return result.rows.map((row) => row.trackId)
    })

    // 3. Aggregate artist names and genres for search terms
    const termFrequencies = new Map<string, number>()

    const addTerm = (term?: string, weight: number = 1) => {
      if (!term) return
      const normalized = term.toLowerCase().trim()
      if (!normalized) return
      termFrequencies.set(normalized, (termFrequencies.get(normalized) || 0) + weight)
    }

    // Weight artists more heavily than genres
    likedSongs.forEach((track) => {
      addTerm(track.artist, 2)
      addTerm(track.genre, 1)
    })

    let topTerms = Array.from(termFrequencies.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
      .map((entry) => entry[0])

    // Fallback terms if user has no liked songs
    if (topTerms.length === 0) {
      topTerms = [...FALLBACK_TERMS]
    }

    // Pick 3 random terms from the top 10 choices to ensure variety
    const selectedTerms: string[] = []
    const availableTerms = topTerms.slice(0, 10)
    for (let i = 0; i < Math.min(3, availableTerms.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableTerms.length)
      const extracted = availableTerms.splice(randomIndex, 1)[0]
      if (extracted) {
        selectedTerms.push(extracted)
      }
    }

    const recommendations: CatalogItemType[] = []
    const seenIds = new Set<number>()

    // Filter out liked songs and recent playlist tracks
    for (const t of likedSongs) {
      seenIds.add(t.id)
    }
    for (const id of playlistTracks) {
      seenIds.add(id)
    }

    // 4. Search iTunes for these terms in parallel
    const searchResults = await Promise.allSettled(
      selectedTerms.filter((term) => !!term).map((term) => itunesSearchAction(term, 0))
    )
    for (const settled of searchResults) {
      if (settled.status === "rejected") {
        console.error("Failed to fetch recommendations for a term", settled.reason)
        continue
      }
      for (const item of settled.value.items) {
        if (!seenIds.has(item.id)) {
          recommendations.push(item)
          seenIds.add(item.id)
        }
      }
    }

    // 5. Shuffle and return top 15 results
    const shuffled = recommendations.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 15)
  }, "Failed to fetch recommended tracks")
}
