"use server"

import { headers } from "next/headers"
import { randomUUID } from "crypto"

import { itunesLookupAction } from "@/features/catalog/api/catalog-actions"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { auth } from "@/lib/auth/auth"
import {
  type CreatePlaylistInput,
  type PlaylistActionState,
  type PlaylistDetailType,
  type PlaylistTrackType,
  type PlaylistType,
} from "../types/playlist-types"

/**
 * Retrieves the current authenticated user's ID from the Better Auth session.
 * Returns null if the session is missing or invalid.
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
 * Instantiated inline to avoid importing Node.js modules at module scope,
 * which would conflict with the Next.js Edge Runtime used in middleware.ts.
 */
async function createPool() {
  const { Pool } = await import("pg")
  const { env } = await import("@/env.mjs")
  return new Pool({
    connectionString: env.DATABASE_URL,
    max: 2,
    ssl: process.env.NODE_ENV === "production" ? true : { rejectUnauthorized: false },
  })
}

/**
 * Fetches all playlists for the currently authenticated user,
 * including a trackCount derived from a subquery.
 */
export async function getUserPlaylistsAction(): Promise<PlaylistActionState<PlaylistType[]>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const pool = await createPool()

    const result = await pool.query(
      `SELECT p.*,
              (SELECT COUNT(*) FROM "playlist_track" pt WHERE pt."playlistId" = p."id")::int AS "trackcount"
       FROM "playlist" p
       WHERE p."userId" = $1
       ORDER BY p."isLiked" DESC, p."createdAt" DESC`,
      [userId]
    )

    await pool.end()

    const playlists: PlaylistType[] = result.rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      name: row.name,
      description: row.description ?? null,
      isLiked: row.isLiked,
      trackCount: row.trackcount,
      createdAt: String(row.createdAt),
      updatedAt: String(row.updatedAt),
    }))

    return { success: true, data: playlists }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to fetch playlists" }
  }
}

/**
 * Fetches a single playlist with its full track list.
 * Track IDs are fetched from the database, then hydrated with
 * metadata from the iTunes API via itunesLookupAction.
 */
export async function getPlaylistDetailAction(id: string): Promise<PlaylistActionState<PlaylistDetailType | null>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const pool = await createPool()

    const playlistResult = await pool.query(`SELECT * FROM "playlist" WHERE "id" = $1 AND "userId" = $2`, [id, userId])

    if (playlistResult.rows.length === 0) {
      await pool.end()
      return { success: true, data: null }
    }

    const trackRows = await pool.query<{ trackId: number; addedAt: string }>(
      `SELECT "trackId", "addedAt" FROM "playlist_track" WHERE "playlistId" = $1 ORDER BY "addedAt" ASC`,
      [id]
    )

    await pool.end()

    const row = playlistResult.rows[0]
    const trackIds = trackRows.rows.map((t) => t.trackId)
    const addedAtMap = Object.fromEntries(trackRows.rows.map((t) => [t.trackId, String(t.addedAt)]))

    // Hydrate track metadata from the iTunes API
    let tracks: PlaylistTrackType[] = []
    if (trackIds.length > 0) {
      const itunesResponse = await itunesLookupAction(trackIds)
      tracks = itunesResponse.results.map((t) => ({
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
    }

    const detail: PlaylistDetailType = {
      id: row.id,
      userId: row.userId,
      name: row.name,
      description: row.description ?? null,
      isLiked: row.isLiked,
      trackCount: tracks.length,
      createdAt: String(row.createdAt),
      updatedAt: String(row.updatedAt),
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

  try {
    const pool = await createPool()
    const id = randomUUID()
    const now = new Date().toISOString()

    await pool.query(
      `INSERT INTO "playlist" ("id", "userId", "name", "description", "isLiked", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, FALSE, $5, $6)`,
      [id, userId, data.name, data.description ?? null, now, now]
    )

    await pool.end()

    return {
      success: true,
      data: {
        id,
        userId,
        name: data.name,
        description: data.description ?? null,
        isLiked: false,
        trackCount: 0,
        createdAt: now,
        updatedAt: now,
      },
    }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to create playlist" }
  }
}

/**
 * Adds a single track to a playlist (stores trackId only).
 * Requires that the playlist belongs to the authenticated user.
 * Idempotent — silently ignores duplicate additions via ON CONFLICT DO NOTHING.
 */
export async function addTrackToPlaylistAction(
  playlistId: string,
  track: CatalogItemType
): Promise<PlaylistActionState<void>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const pool = await createPool()

    const ownerCheck = await pool.query(`SELECT 1 FROM "playlist" WHERE "id" = $1 AND "userId" = $2`, [
      playlistId,
      userId,
    ])

    if (ownerCheck.rows.length === 0) {
      await pool.end()
      return { success: false, error: "Playlist not found" }
    }

    await pool.query(
      `INSERT INTO "playlist_track" ("id", "playlistId", "trackId", "addedAt")
       VALUES ($1, $2, $3, $4)
       ON CONFLICT ("playlistId", "trackId") DO NOTHING`,
      [randomUUID(), playlistId, track.id, new Date().toISOString()]
    )

    await pool.end()
    return { success: true, data: undefined }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to add track to playlist" }
  }
}

/**
 * Syncs locally-stored liked songs into the user's "Liked Songs" playlist.
 * Creates the "Liked Songs" playlist if it doesn't exist yet.
 * Merges new track IDs — idempotent, safe to call on every login.
 */
export async function syncLikedSongsAction(tracks: CatalogItemType[]): Promise<PlaylistActionState<void>> {
  if (tracks.length === 0) return { success: true, data: undefined }

  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const pool = await createPool()
    const now = new Date().toISOString()

    // Find or create the "Liked Songs" playlist
    let playlistId: string
    const existing = await pool.query(`SELECT "id" FROM "playlist" WHERE "userId" = $1 AND "isLiked" = TRUE LIMIT 1`, [
      userId,
    ])

    if (existing.rows.length > 0) {
      playlistId = existing.rows[0].id
    } else {
      playlistId = randomUUID()
      await pool.query(
        `INSERT INTO "playlist" ("id", "userId", "name", "isLiked", "createdAt", "updatedAt")
         VALUES ($1, $2, 'Liked Songs', TRUE, $3, $4)`,
        [playlistId, userId, now, now]
      )
    }

    // Merge track IDs — ON CONFLICT DO NOTHING ensures idempotency
    for (const track of tracks) {
      await pool.query(
        `INSERT INTO "playlist_track" ("id", "playlistId", "trackId", "addedAt")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("playlistId", "trackId") DO NOTHING`,
        [randomUUID(), playlistId, track.id, now]
      )
    }

    await pool.end()
    return { success: true, data: undefined }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to sync liked songs" }
  }
}
