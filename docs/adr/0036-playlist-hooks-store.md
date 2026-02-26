# ADR 0036 — Playlist Hooks & Client-Side State Management

**Date:** 2026-02-26

## Context

The playlist feature requires React hooks to bridge server actions with the UI, as well as a client-side state management strategy for optimistic feedback and authentication integration.

## Decision

### Data Fetching with TanStack Query

We use `useQuery` and `useMutation` (from `@tanstack/react-query`) to manage the asynchronous state of playlists.

- **`usePlaylists`**: Manages the collection of user playlists. It handles automatic re-validation when a new playlist is created.
- **`usePlaylistDetail`**: Handles fetching a single playlist with its tracks. It invalidates both the specific playlist query and the general playlists list on successful track addition.

### Optimistic UI State with Zustand (vs React useOptimistic)

While TanStack Query handles the "source of truth", we use a dedicated Zustand store (`usePlaylistStore`) for ephemeral, optimistic UI state.

- **True Optimistic Updates**: The architecture incorporates a `onMutate`/`onError`/`onSettled` pattern. When a track is added, we snapshot the state, update the UI immediately via Zustand (`markTrackAsAdded`), and roll back using `removeTrackFromPlaylist` if the server request fails.
- **Global Coordination**: Unlike the `useOptimistic` hook, which is scoped to a specific component tree or form, Zustand allows us to coordinate state across disparate parts of the application (e.g., updating a search result card from a sidebar action).
- **Persistence & SSR**: The store is client-side only and ephemeral, which suits "added" indicators that should reset on session end or be refreshed by TanStack Query's cache.

### Authentication & Liked Songs Sync

To ensure a seamless transition from guest to logged-in user:

1.  **Sync on Login/Register**: The `useAuth` hook is updated to call `syncLikedSongsAction` immediately upon successful authentication.
2.  **Redirect Strategy**: Successful login/registration now redirects to `/playlists` by default to drive users toward the new feature.
3.  **Local Storage Migration**: Any songs "liked" (stored in `useFavoritesStore` via localStorage) while the user was logged out are pushed to the database's "Liked Songs" playlist.

## Consequences

- Components must now handle the `isLoading` and `isError` states returned by the hooks.
- Using `useTransition` in hooks provides a smoother navigation experience by allowing React to interrupt rendering if a higher-priority update occurs.
- The `usePlaylistStore` is ephemeral and reset on page reload, relying on TanStack Query to eventually fetch the persisted state.
