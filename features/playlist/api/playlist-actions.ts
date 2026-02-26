"use server"

import { headers } from "next/headers"
import { randomUUID } from "crypto"

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

  const pool = await createPool()
  try {
    const result = await pool.query(
      `SELECT p.*,
              (SELECT COUNT(*) FROM "playlist_track" pt WHERE pt."playlistId" = p."id")::int AS "trackcount"
       FROM "playlist" p
       WHERE p."userId" = $1
       ORDER BY p."isLiked" DESC, p."createdAt" DESC`,
      [userId]
    )

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
  } finally {
    await pool.end()
  }
}

/**
 * Fetches a single playlist with its full track list.
 * Track IDs are fetched from the database, then hydrated with
 * metadata from the iTunes API via itunesLookupAction.
 * The resulting track array is sorted by addedAt ASC to preserve
 * the original insertion order regardless of iTunes API response order.
 */
export async function getPlaylistDetailAction(id: string): Promise<PlaylistActionState<PlaylistDetailType | null>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  const pool = await createPool()
  try {
    const playlistResult = await pool.query(`SELECT * FROM "playlist" WHERE "id" = $1 AND "userId" = $2`, [id, userId])

    if (playlistResult.rows.length === 0) {
      return { success: true, data: null }
    }

    const trackRows = await pool.query<{ trackId: number; addedAt: string }>(
      `SELECT "trackId", "addedAt" FROM "playlist_track" WHERE "playlistId" = $1 ORDER BY "addedAt" ASC`,
      [id]
    )

    const row = playlistResult.rows[0]
    const trackIds = trackRows.rows.map((t) => t.trackId)
    const addedAtMap = Object.fromEntries(trackRows.rows.map((t) => [t.trackId, String(t.addedAt)]))

    // Hydrate track metadata from the iTunes API
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
        // Re-sort by addedAt ASC since iTunes API does not preserve insertion order
        .sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())
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
  } finally {
    await pool.end()
  }
}

/**
 * Creates a new playlist for the authenticated user.
 * Validates input at runtime using the CreatePlaylistSchema before any DB access.
 */
export async function createPlaylistAction(data: CreatePlaylistInput): Promise<PlaylistActionState<PlaylistType>> {
  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  const parsed = CreatePlaylistSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map((e) => e.message).join(", ") }
  }
  const validatedData = parsed.data

  const pool = await createPool()
  try {
    const id = randomUUID()
    const now = new Date().toISOString()

    await pool.query(
      `INSERT INTO "playlist" ("id", "userId", "name", "description", "isLiked", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, FALSE, $5, $6)`,
      [id, userId, validatedData.name, validatedData.description ?? null, now, now]
    )

    return {
      success: true,
      data: {
        id,
        userId,
        name: validatedData.name,
        description: validatedData.description ?? null,
        isLiked: false,
        trackCount: 0,
        createdAt: now,
        updatedAt: now,
      },
    }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to create playlist" }
  } finally {
    await pool.end()
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

  const pool = await createPool()
  try {
    const ownerCheck = await pool.query(`SELECT 1 FROM "playlist" WHERE "id" = $1 AND "userId" = $2`, [
      playlistId,
      userId,
    ])

    if (ownerCheck.rows.length === 0) {
      return { success: false, error: "Playlist not found" }
    }

    await pool.query(
      `INSERT INTO "playlist_track" ("id", "playlistId", "trackId", "addedAt")
       VALUES ($1, $2, $3, $4)
       ON CONFLICT ("playlistId", "trackId") DO NOTHING`,
      [randomUUID(), playlistId, track.id, new Date().toISOString()]
    )

    return { success: true, data: undefined }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to add track to playlist" }
  } finally {
    await pool.end()
  }
}

/**
 * Syncs locally-stored liked songs into the user's "Liked Songs" playlist.
 * Creates the "Liked Songs" playlist if it doesn't exist yet.
 * Merges new track IDs — idempotent, safe to call on every login.
 * Uses a single batched INSERT to avoid N+1 queries.
 */
export async function syncLikedSongsAction(tracks: CatalogItemType[]): Promise<PlaylistActionState<void>> {
  if (tracks.length === 0) return { success: true, data: undefined }

  const userId = await getAuthenticatedUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  const pool = await createPool()
  try {
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

    // Batch insert tracks using a multi-row VALUES clause to prevent N+1 queries
    // SQL: INSERT INTO ... VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ...
    const queryParts: string[] = []
    const params: (string | number)[] = []

    tracks.forEach((track, index) => {
      const offset = index * 4
      queryParts.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`)
      params.push(randomUUID(), playlistId, track.id, now)
    })

    const query = `
      INSERT INTO "playlist_track" ("id", "playlistId", "trackId", "addedAt")
      VALUES ${queryParts.join(", ")}
      ON CONFLICT ("playlistId", "trackId") DO NOTHING
    `

    await pool.query(query, params)

    return { success: true, data: undefined }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error?.message ?? "Failed to sync liked songs" }
  } finally {
    await pool.end()
  }
}
