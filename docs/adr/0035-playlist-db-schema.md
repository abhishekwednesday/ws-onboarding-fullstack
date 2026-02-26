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

Since Better Auth manages sessions in the Next.js layer (independent of Supabase Auth), native RLS `auth.uid()` is unavailable. To bridge this securely:

1.  **Dedicated Client Connections**: Every server action acquires a dedicated connection from the pool.
2.  **Explicit Transactions**: Operations are wrapped in `BEGIN/COMMIT/ROLLBACK` blocks.
3.  **Parameterized Session Setting**: We use `set_config('app.current_user_id', $1, true)` within the transaction to securely set the RLS context. This prevents SQL injection and ensures the context is isolated to the specific transaction.
4.  **Owner-Based Policies**: RLS policies on `playlist` and `playlist_track` enforce ownership checks using quoted camelCase identifiers (e.g., `"userId" = current_setting('app.current_user_id', true)`).

### Performance & Scalability

- **Optimized Client Release**: In complex flows like `getPlaylistDetailAction`, the database client is released immediately after fetching DB data, _before_ making external network calls (iTunes API). This prevents database connection starvation during I/O.
- **Atomic Liked Songs**: Uses `INSERT ... ON CONFLICT (...) WHERE (isLiked = TRUE) DO UPDATE` to atomically ensure a single "Liked Songs" playlist exists per user.
- **Chunked Batch Inserts**: Large playlists are inserted using multi-row `VALUES` clauses processed in chunks to stay within PostgreSQL's 65,535 parameter limit.

### Idempotent Deployment

The `docs/db/playlist-schema.sql` script is fully idempotent using `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`, and `DROP TRIGGER IF EXISTS`.

## Consequences

- The `pgcrypto` extension must be available in the target database.
- Connection acquisition overhead is minimized by a small pool and immediate release before external I/O.
- RLS provides a robust secondary layer of protection beneath the application's session validation.
