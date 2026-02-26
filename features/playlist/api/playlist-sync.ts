"use server"

import { itunesLookupAction } from "@/features/catalog/api/catalog-actions"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { type ActionState, withActionHandler } from "@/lib/utils/action-handler"
import { getAuthenticatedUserId, withAuthenticatedClient } from "./playlist-utils"

/**
 * Syncs locally-stored liked songs into the user's "Liked Songs" playlist.
 * Processes tracks in chunks to stay under the PostgreSQL parameter limit.
 */
export async function syncLikedSongsAction(tracks: CatalogItemType[]): Promise<ActionState<void>> {
  if (tracks.length === 0) return { success: true, data: undefined }

  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    await withAuthenticatedClient(userId, async (client) => {
      const now = new Date().toISOString()

      // Atomic find-or-create for Liked Songs playlist
      // Uses ON CONFLICT ON userId WHERE isLiked = true to handle racing inserts
      const playlistResult = await client.query(
        `INSERT INTO "playlist" ("userId", "name", "isLiked", "createdAt", "updatedAt")
         VALUES ($1, 'Liked Songs', TRUE, $2, $3)
         ON CONFLICT ("userId") WHERE ("isLiked" = TRUE) 
         DO UPDATE SET "updatedAt" = EXCLUDED."updatedAt"
         RETURNING "id"`,
        [userId, now, now]
      )
      const playlistId = playlistResult.rows[0].id

      // Chunk tracks to stay within PostgreSQL parameter limits (65535 total, 3 per row)
      const MAX_TRACKS_PER_BATCH = Math.floor(65535 / 3)
      for (let i = 0; i < tracks.length; i += MAX_TRACKS_PER_BATCH) {
        const chunk = tracks.slice(i, i + MAX_TRACKS_PER_BATCH)
        const queryParts: string[] = []
        const params: (string | number)[] = []

        chunk.forEach((track, index) => {
          const offset = index * 3
          queryParts.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`)
          params.push(playlistId, track.id, now)
        })

        const query = `
          INSERT INTO "playlist_track" ("playlistId", "trackId", "addedAt")
          VALUES ${queryParts.join(", ")}
          ON CONFLICT ("playlistId", "trackId") DO NOTHING
        `
        await client.query(query, params)
      }
    })
  }, "Failed to sync liked songs")
}

/**
 * Fetches all tracks in the user's "Liked Songs" playlist.
 * Used for hydrating the client-side favorites store upon login.
 */
export async function getLikedSongsAction(): Promise<ActionState<CatalogItemType[]>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    const trackIds = await withAuthenticatedClient(userId, async (client) => {
      const result = await client.query(
        `SELECT pt."trackId"
         FROM "playlist" p
         JOIN "playlist_track" pt ON pt."playlistId" = p."id"
         WHERE p."userId" = $1 AND p."isLiked" = TRUE`,
        [userId]
      )
      return result.rows.map((row) => row.trackId)
    })

    if (trackIds.length === 0) return []

    const itunesResponse = await itunesLookupAction(trackIds)
    return itunesResponse.results.map((t) => ({
      id: t.trackId,
      title: t.trackName,
      artist: t.artistName,
      album: t.collectionName,
      artworkUrl: t.artworkUrl100,
      previewUrl: t.previewUrl,
      genre: t.primaryGenreName,
      duration: t.trackTimeMillis,
      trackViewUrl: t.trackViewUrl,
    })) as CatalogItemType[]
  }, "Failed to fetch liked songs")
}

/**
 * Adds a single track to the user's "Liked Songs" playlist.
 * Atomically finds or creates the playlist.
 */
export async function likeTrackAction(track: CatalogItemType): Promise<ActionState<void>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    await withAuthenticatedClient(userId, async (client) => {
      const now = new Date().toISOString()

      // Atomic find-or-create for Liked Songs playlist
      const playlistResult = await client.query(
        `INSERT INTO "playlist" ("userId", "name", "isLiked", "createdAt", "updatedAt")
         VALUES ($1, 'Liked Songs', TRUE, $2, $3)
         ON CONFLICT ("userId") WHERE ("isLiked" = TRUE)
         DO UPDATE SET "updatedAt" = EXCLUDED."updatedAt"
         RETURNING "id"`,
        [userId, now, now]
      )
      const playlistId = playlistResult.rows[0].id

      await client.query(
        `INSERT INTO "playlist_track" ("playlistId", "trackId", "addedAt")
         VALUES ($1, $2, $3)
         ON CONFLICT ("playlistId", "trackId") DO NOTHING`,
        [playlistId, track.id, now]
      )
    })
  }, "Failed to like track")
}

/**
 * Removes a single track from the user's "Liked Songs" playlist.
 */
export async function unlikeTrackAction(trackId: number): Promise<ActionState<void>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    await withAuthenticatedClient(userId, async (client) => {
      // Find the Liked Songs playlist
      const playlistResult = await client.query(
        `SELECT "id" FROM "playlist" WHERE "userId" = $1 AND "isLiked" = TRUE`,
        [userId]
      )

      if (playlistResult.rows.length === 0) return

      const playlistId = playlistResult.rows[0].id
      await client.query(`DELETE FROM "playlist_track" WHERE "playlistId" = $1 AND "trackId" = $2`, [
        playlistId,
        trackId,
      ])
    })
  }, "Failed to unlike track")
}
