"use server"

import { headers } from "next/headers"
import type { PoolClient } from "pg"

import { itunesLookupAction } from "@/features/catalog/api/catalog-actions"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { auth } from "@/lib/auth/auth"
import {
  type CreatePlaylistInput,
  CreatePlaylistSchema,
  type PlaylistActionState,
  type PlaylistDetailType,
  type PlaylistTrackType,
  type PlaylistType,
} from "../types/playlist-types"

/**
 * Retrieves the current authenticated user's ID from the Better Auth session.
 */
async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

/**
 * Opens a pg Pool for the duration of an action.
 */
async function getPool() {
  const { Pool } = await import("pg")
  const { env } = await import("@/env.mjs")
  return new Pool({
    connectionString: env.DATABASE_URL,
    max: 2,
    ssl: process.env.NODE_ENV === "production" ? true : { rejectUnauthorized: false },
  })
}

/**
 * Runs a database operation within a dedicated client connection
 * that has the session's current_user_id set for RLS policies.
 * Uses an explicit session-local transaction to ensure RLS context persistence.
 */
async function withAuthenticatedClient<T>(userId: string, operation: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = await getPool()
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    // Set RLS session context using parameterized set_config for safety
    await client.query("SELECT set_config('app.current_user_id', $1, true)", [userId])

    const result = await operation(client)

    await client.query("COMMIT")
    return result
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

/**
 * Fetches all playlists for the currently authenticated user.
 */
export async function getUserPlaylistsAction(): Promise<PlaylistActionState<PlaylistType[]>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const playlists = await withAuthenticatedClient(userId, async (client) => {
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

    return { success: true, data: playlists }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to fetch playlists" }
  }
}

/**
 * Fetches a single playlist with hydrated track metadata.
 * Database client is released before making the iTunes API network call.
 */
export async function getPlaylistDetailAction(id: string): Promise<PlaylistActionState<PlaylistDetailType | null>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
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

    if (!dbData) return { success: true, data: null }

    const { playlist, trackIds, addedAtMap } = dbData

    // Stage 2: Hydrate track metadata from the iTunes API (outside DB client)
    let tracks: PlaylistTrackType[] = []
    if (trackIds.length > 0) {
      const itunesResponse = await itunesLookupAction(trackIds)
      tracks = itunesResponse.results
        .map((t) => ({
          id: t.trackId,
          title: t.trackName,
          artist: t.artistName,
          album: t.collectionName,
          artworkUrl: t.artworkUrl100,
          previewUrl: t.previewUrl,
          genre: t.primaryGenreName,
          duration: t.trackTimeMillis,
          trackViewUrl: t.trackViewUrl,
          addedAt: addedAtMap[t.trackId] ?? new Date().toISOString(),
        }))
        // Ensure chronological order is preserved after API hydration
        .sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())
    }

    const detail: PlaylistDetailType = {
      id: playlist.id,
      userId: playlist.userId,
      name: playlist.name,
      description: playlist.description ?? null,
      isLiked: playlist.isLiked,
      trackCount: tracks.length,
      createdAt: String(playlist.createdAt),
      updatedAt: String(playlist.updatedAt),
      tracks,
    }

    return { success: true, data: detail }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to fetch playlist" }
  }
}

/**
 * Creates a new playlist for the authenticated user.
 */
export async function createPlaylistAction(data: CreatePlaylistInput): Promise<PlaylistActionState<PlaylistType>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  const parsed = CreatePlaylistSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map((e) => e.message).join(", ") }
  }
  const validatedData = parsed.data

  try {
    const playlist = await withAuthenticatedClient(userId, async (client) => {
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

    return { success: true, data: playlist }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to create playlist" }
  }
}

/**
 * Adds a single track to a playlist.
 */
export async function addTrackToPlaylistAction(
  playlistId: string,
  track: CatalogItemType
): Promise<PlaylistActionState<void>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    await withAuthenticatedClient(userId, async (client) => {
      // Verify playlist existence and ownership (via RLS)
      const ownerCheck = await client.query(`SELECT 1 FROM "playlist" WHERE "id" = $1 AND "userId" = $2`, [
        playlistId,
        userId,
      ])

      if (ownerCheck.rows.length === 0) {
        throw new Error("Playlist not found")
      }

      await client.query(
        `INSERT INTO "playlist_track" ("playlistId", "trackId", "addedAt")
         VALUES ($1, $2, $3)
         ON CONFLICT ("playlistId", "trackId") DO NOTHING`,
        [playlistId, track.id, new Date().toISOString()]
      )
    })

    return { success: true, data: undefined }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to add track to playlist" }
  }
}

/**
 * Syncs locally-stored liked songs into the user's "Liked Songs" playlist.
 * Processes tracks in chunks to stay under the PostgreSQL parameter limit.
 */
export async function syncLikedSongsAction(tracks: CatalogItemType[]): Promise<PlaylistActionState<void>> {
  if (tracks.length === 0) return { success: true, data: undefined }

  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
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

    return { success: true, data: undefined }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to sync liked songs" }
  }
}
