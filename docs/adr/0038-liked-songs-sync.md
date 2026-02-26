# ADR 0038: Bidirectional Liked Songs Sync and Playlist Track Removal

## Context

After deploying the playlist feature, three UX gaps were identified:

1. Logged-in users' liked songs were not reflected in the catalog — the heart indicators only relied on local `localStorage` state and were never hydrated from the server.
2. There was no mechanism to remove tracks from playlists (neither from the detail page nor from the add-to-playlist popover).
3. The "Add to Playlist" popover did not reflect tracks that were already in a playlist from a previous session, and toggling them off was not possible.

## Decision

### Server-side Sync on Page Load

- Created `useSyncLikedSongs` hook that runs once per authenticated session. It calls `getLikedSongsAction` and populates `useFavoritesStore` so that `FavoriteButton` hearts reflect database state immediately.
- Mounted via `GlobalSyncProvider` (a `"use client"` component rendering `null`) in the root `layout.tsx`, keeping the layout itself a server component.

### Bidirectional Favorite Toggle

- `FavoriteButton` now checks `useSession()`. For authenticated users, toggling a favorite calls `likeTrackAction(track)` or `unlikeTrackAction(trackId)` on the server.
- Both actions atomically find-or-create the "Liked Songs" playlist using `ON CONFLICT ... DO UPDATE`.
- On server failure, the optimistic local toggle is reverted.

### Playlist Track Removal

- Added `removeTrackFromPlaylistAction(playlistId, trackId)` for generic removal.
- `usePlaylistDetail` now exposes `removeTrack` with optimistic rollback via `onMutate`.
- `PlaylistDetailPage` shows a trash icon on hover for each track row.
- `AddToPlaylistPopover` toggles: clicking a checked playlist removes the track.

### Global Store Hydration

- `usePlaylists` fetches `getPlaylistTrackMapAction()` alongside the playlist list and seeds `usePlaylistStore` with all `playlistId → trackId[]` mappings, enabling accurate checkmarks in the popover across sessions.

## Consequences

- **Positive**: Favorites and playlist membership now accurately reflect server state. Offline-first behavior is preserved for unauthenticated users.
- **Negative**: Each page load triggers one additional server action for authenticated users (`getLikedSongsAction`). This is acceptable since it's a single lightweight query with results cached per session via `useRef`.
