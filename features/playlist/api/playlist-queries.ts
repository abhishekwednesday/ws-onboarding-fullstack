"use server"

import { itunesLookupAction } from "@/features/catalog/api/catalog-actions"
import { mapItunesItemToCatalogItem } from "@/features/catalog/utils/mappers"
import { type ActionState, withActionHandler } from "@/lib/utils/action-handler"
import { getAuthenticatedUserId, withAuthenticatedClient } from "./playlist-utils"
import { type PlaylistDetailType, type PlaylistTrackType, type PlaylistType } from "../types/playlist-types"

/**
 * Fetches all playlists for the currently authenticated user.
 */
export async function getUserPlaylistsAction(): Promise<ActionState<PlaylistType[]>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    return withAuthenticatedClient(userId, async (client) => {
      const result = await client.query(
        `SELECT p.*,
                (SELECT COUNT(*) FROM "playlist_track" pt WHERE pt."playlistId" = p."id")::int AS "trackcount"
         FROM "playlist" p
         WHERE p."userId" = $1
         ORDER BY p."isLiked" DESC, p."createdAt" DESC`,
        [userId]
      )

      return result.rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        name: row.name,
        description: row.description ?? null,
        isLiked: row.isLiked,
        trackCount: row.trackcount,
        createdAt: String(row.createdAt),
        updatedAt: String(row.updatedAt),
      })) as PlaylistType[]
    })
  }, "Failed to fetch playlists")
}

/**
 * Fetches a single playlist with hydrated track metadata.
 * Database client is released before making the iTunes API network call.
 */
export async function getPlaylistDetailAction(id: string): Promise<ActionState<PlaylistDetailType | null>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    // Stage 1: Fetch all necessary data from DB and release client
    const dbData = await withAuthenticatedClient(userId, async (client) => {
      const playlistResult = await client.query(`SELECT * FROM "playlist" WHERE "id" = $1 AND "userId" = $2`, [
        id,
        userId,
      ])

      if (playlistResult.rows.length === 0) return null

      const trackRows = await client.query(
        `SELECT "trackId", "addedAt" FROM "playlist_track" WHERE "playlistId" = $1 ORDER BY "addedAt" ASC`,
        [id]
      )

      return {
        playlist: playlistResult.rows[0],
        trackIds: trackRows.rows.map((t: { trackId: number }) => t.trackId),
        addedAtMap: Object.fromEntries(
          trackRows.rows.map((t: { trackId: number; addedAt: string }) => [t.trackId, String(t.addedAt)])
        ),
      }
    })

    if (!dbData) return null

    const { playlist, trackIds, addedAtMap } = dbData

    // Stage 2: Hydrate track metadata from the iTunes API (outside DB client)
    let tracks: PlaylistTrackType[] = []
    if (trackIds.length > 0) {
      const itunesResponse = await itunesLookupAction(trackIds)
      tracks = itunesResponse.results
        .map((t) => {
          const mapped = mapItunesItemToCatalogItem(t)
          if (!mapped) return null
          return {
            ...mapped,
            addedAt: addedAtMap[mapped.id] ?? new Date().toISOString(),
          } as PlaylistTrackType
        })
        .filter((t): t is PlaylistTrackType => t !== null)
        // Ensure chronological order is preserved after API hydration
        .sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())
    }

    return {
      id: playlist.id,
      userId: playlist.userId,
      name: playlist.name,
      description: playlist.description ?? null,
      isLiked: playlist.isLiked,
      trackCount: tracks.length,
      createdAt: String(playlist.createdAt),
      updatedAt: String(playlist.updatedAt),
      tracks,
    } as PlaylistDetailType
  }, "Failed to fetch playlist")
}

/**
 * Fetches a map of playlistId to an array of trackIds for the authenticated user.
 * This is used to hydrate local stores for global UI indicators.
 */
export async function getPlaylistTrackMapAction(): Promise<ActionState<Record<string, number[]>>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    return withAuthenticatedClient(userId, async (client) => {
      // Join playlist to playlist_track to only get tracks for the user's playlists
      const result = await client.query(
        `SELECT p."id" as "playlistId", pt."trackId"
         FROM "playlist" p
         JOIN "playlist_track" pt ON pt."playlistId" = p."id"
         WHERE p."userId" = $1`,
        [userId]
      )

      const map: Record<string, number[]> = {}
      for (const row of result.rows) {
        const pId = row.playlistId
        if (!map[pId]) {
          map[pId] = []
        }
        map[pId].push(row.trackId)
      }
      return map
    })
  }, "Failed to fetch playlist track map")
}
