# ADR 0035 — Playlist Feature: Database Schema & Secure Access

**Date:** 2026-02-26

## Context

The ONB-4 playlist feature requires persistent storage for user-created playlists and track references. The implementation must ensure strict access control (RLS), performant batch operations, and data integrity.

## Decision

### Native UUID Types

Both `playlist` and `playlist_track` tables use the native `UUID` type for primary keys, with `gen_random_uuid()` as the default generator. This provides non-sequential, globally unique identifiers that are more efficient than `TEXT` for indexing and storage in PostgreSQL.

### Store Track ID Only — Hydrate from iTunes API

`playlist_track` stores only the iTunes `trackId` (integer) and `addedAt` timestamp. Metadata is hydrated at read-time via `itunesLookupAction`. This ensures track data (titles, artwork) never becomes stale in our database.

### Secure, Transaction-Safe RLS Session Context

Since Better Auth manages sessions in the Next.js layer (independent of Supabase Auth), native RLS `auth.uid()` is unavailable. To bridge this:

1.  **Dedicated Client Connections**: Every server action uses `pool.connect()` to acquire a dedicated connection.
2.  **Parameterized Session Setting**: We use `set_config('app.current_user_id', $1, true)` within the connection to securely set the RLS context for that specific transaction/connection. This prevents SQL injection and ensures the context is tied only to the current request.
3.  **Owner-Based Policies**: RLS policies on `playlist` and `playlist_track` enforce `userId = current_setting('app.current_user_id')`.

### Performance & Atomicity

- **Atomic Liked Songs**: Uses `INSERT ... ON CONFLICT (...) WHERE (isLiked = TRUE) DO UPDATE` to atomically ensure a single "Liked Songs" playlist exists per user, even under concurrent login requests.
- **Chunked Batch Inserts**: Large playlists (e.g., during initial sync) are inserted using multi-row `VALUES` clauses, processed in chunks stay within PostgreSQL's 65,535 parameter limit.

### Idempotent Deployment

The `docs/db/playlist-schema.sql` script is designed to be re-runnable, using `CREATE TABLE IF NOT EXISTS`, `DO` blocks for policy existence checks, and `DROP TRIGGER IF EXISTS` for trigger maintenance.

## Consequences

- The `pgcrypto` extension must be available in the target database.
- Every database interaction incurred a connection acquisition overhead, mitigated by a small connection pool (`max: 2`).
- Playlist track ordering is maintained by an explicit `sort` on `addedAt` in the application layer after iTunes API hydration.
