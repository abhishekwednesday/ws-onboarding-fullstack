# ADR 0035 — Playlist Feature: Database Schema

**Date:** 2026-02-26

## Context

The ONB-4 playlist feature requires persistent storage for user-created playlists and the IDs of tracks within them. A new standalone schema file was needed alongside the existing `docs/db/auth-schema.sql`.

## Decision

### Separate Schema File

Playlist tables live in a new `docs/db/playlist-schema.sql` — not appended to `auth-schema.sql`. Auth and playlist are distinct concerns; mixing them would reduce clarity and make it harder to apply schema changes independently.

### Store Track ID Only — Hydrate from iTunes API

`playlist_track` stores only the iTunes `trackId` (integer) and `addedAt` timestamp — no denormalised metadata. Full track details (title, artist, artwork, etc.) are fetched at read time from the iTunes API using the existing `itunesLookupAction`, which already supports batch-lookups by ID.

**Why:** Duplicating metadata into the database would create a stale-data problem (artwork URLs, titles change on iTunes), increase row size unnecessarily, and add complexity to writes. Since the iTunes API is already used throughout the catalog feature and supports batch IDs, fetching at read time is the right tradeoff for a list of tracks that will typically be in the tens, not thousands.

### Table Design

- **`playlist`**: One row per user playlist. `isLiked` boolean flags the system-managed "Liked Songs" playlist — application logic enforces at most one per user.
- **`playlist_track`**: `(playlistId, trackId)` with a `UNIQUE` constraint that enables idempotent inserts via `ON CONFLICT DO NOTHING`.

### Playlist ID

Playlist IDs are random UUIDs generated server-side (`crypto.randomUUID()`) at creation — enabling shareable, non-sequential, unguessable `/playlists/[uuid]` URLs.

### RLS Approach

RLS is enabled on both tables as a safeguard against accidental PostgREST exposure. Since all data access flows through Next.js Server Actions (never directly from a Supabase client), `auth.uid()` is unavailable (Better Auth manages sessions, not Supabase Auth). Every query is manually scoped with `WHERE "userId" = $userId` derived from the validated Better Auth session inside the action. This is consistent with the existing auth tables.

### Server Actions

All actions live in `features/playlist/api/playlist-actions.ts` following the `auth-actions.ts` pattern — `"use server"`, session validation at the top, `{ success, data | error }` return shape. The `pg` Pool is instantiated inside each action via dynamic `import("pg")` to avoid importing Node.js-only modules at module scope (which would conflict with the Next.js Edge Runtime used in `middleware.ts`).

## Consequences

- `docs/db/playlist-schema.sql` must be applied to Supabase before the playlist feature can be used (analogous to `auth-schema.sql`).
- Playlist detail page makes an iTunes API call proportional to the number of saved tracks — acceptable given typical playlist sizes.
- `ON CONFLICT DO NOTHING` makes liked-songs sync safe to call on every login with zero duplicates.
