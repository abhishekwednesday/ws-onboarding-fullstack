"use server"

import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { type ActionState, withActionHandler } from "@/lib/utils/action-handler"
import { getAuthenticatedUserId, verifyPlaylistOwner, withAuthenticatedClient } from "./playlist-utils"
import { type CreatePlaylistInput, CreatePlaylistSchema, type PlaylistType } from "../types/playlist-types"

/**
 * Creates a new playlist for the authenticated user.
 */
export async function createPlaylistAction(data: CreatePlaylistInput): Promise<ActionState<PlaylistType>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  const parsed = CreatePlaylistSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map((e) => e.message).join(", ") }
  }
  const validatedData = parsed.data

  return withActionHandler(async () => {
    return withAuthenticatedClient(userId, async (client) => {
      const now = new Date().toISOString()
      const result = await client.query(
        `INSERT INTO "playlist" ("userId", "name", "description", "isLiked", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, FALSE, $4, $5)
         RETURNING *`,
        [userId, validatedData.name, validatedData.description ?? null, now, now]
      )

      const row = result.rows[0]
      return {
        id: row.id,
        userId: row.userId,
        name: row.name,
        description: row.description ?? null,
        isLiked: row.isLiked,
        trackCount: 0,
        createdAt: String(row.createdAt),
        updatedAt: String(row.updatedAt),
      } as PlaylistType
    })
  }, "Failed to create playlist")
}

/**
 * Adds a single track to a playlist.
 */
export async function addTrackToPlaylistAction(playlistId: string, track: CatalogItemType): Promise<ActionState<void>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    await withAuthenticatedClient(userId, async (client) => {
      await verifyPlaylistOwner(client, playlistId, userId)
      await client.query(
        `INSERT INTO "playlist_track" ("playlistId", "trackId", "addedAt")
         VALUES ($1, $2, $3)
         ON CONFLICT ("playlistId", "trackId") DO NOTHING`,
        [playlistId, track.id, new Date().toISOString()]
      )
    })
  }, "Failed to add track to playlist")
}

/**
 * Removes a single track from a playlist.
 */
export async function removeTrackFromPlaylistAction(playlistId: string, trackId: number): Promise<ActionState<void>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  return withActionHandler(async () => {
    await withAuthenticatedClient(userId, async (client) => {
      await verifyPlaylistOwner(client, playlistId, userId)
      await client.query(`DELETE FROM "playlist_track" WHERE "playlistId" = $1 AND "trackId" = $2`, [
        playlistId,
        trackId,
      ])
    })
  }, "Failed to remove track from playlist")
}
