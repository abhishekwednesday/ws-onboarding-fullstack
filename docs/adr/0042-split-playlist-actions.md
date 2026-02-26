# 0042: Split Playlist Actions into Domain Modules

## Status

Accepted

## Context

The `features/playlist/api/playlist-actions.ts` file had become a "God File." At over 500 lines of code, it encompassed multiple disparate responsibilities: fetching lists of playlists, aggressively hydrating detailed playlists from both PostgreSQL and the iTunes API, handling creating/adding/removing mutations, and synchronizing user "Liked Songs" states.

This violated the Single Responsibility Principle (SRP), making the file exceptionally difficult to read, maintain, and test. Merges involving the playlists feature routinely caused conflicts in this shared monolith.

## Decision

We have split `playlist-actions.ts` into several smaller, purpose-driven modules based on domain boundaries:

1.  **`playlist-queries.ts`**: Contains all read operations (`getUserPlaylistsAction`, `getPlaylistDetailAction`, `getPlaylistTrackMapAction`).
2.  **`playlist-mutations.ts`**: Contains all write/modification operations (`createPlaylistAction`, `addTrackToPlaylistAction`, `removeTrackFromPlaylistAction`).
3.  **`playlist-sync.ts`**: Dedicated strictly to the complex logic of synchronizing bidirectional liked songs states (`syncLikedSongsAction`, `getLikedSongsAction`, `likeTrackAction`, `unlikeTrackAction`).
4.  **`playlist-utils.ts`**: Houses shared private helpers, specifically `getAuthenticatedUserId`.

The `withAuthenticatedClient` database injection helper remains in `features/playlist/api/playlist-utils.ts` alongside `getAuthenticatedUserId`. While it is conceptually generic infrastructure, it is currently only consumed by playlist modules, so co-locating it here avoids a premature abstraction. If other features begin requiring RLS-scoped client connections, it should be promoted to `lib/db/`.

All `usePlaylists` and `usePlaylistDetail` React Query hooks, and their corresponding vitest mock tests, have been updated to import from these specific `.api/*` files instead of the single monolith.

## Consequences

- **Improved Readability**: Files are significantly shorter and focused on a single concern.
- **Reduced Merge Conflicts**: Concurrent work on read logic vs. sync logic will no longer conflict.
- **Easier Testing**: Granular mocks are now slightly easier to manage and comprehend within unit test files.
- **File Proliferation**: We now have 4 files where there was previously 1, requiring developers to know which module houses which specific action. This is mitigated by precise naming conventions.
