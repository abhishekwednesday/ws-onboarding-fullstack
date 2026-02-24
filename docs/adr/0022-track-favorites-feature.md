# ADR 0022: Track Favorites Feature

## Context

Users need a way to mark their favorite tracks so they can quickly access them later without re-searching. This requires:

1. Persistent storage that survives page reloads.
2. Immediate UI feedback (Optimistic UI) to avoid feeling "slow" due to network or store latency.
3. A consolidated API approach for track lookups.
4. Clean architectural separation of types.

## Decisions

### 1. State Management — Zustand with Persistence

We use **Zustand** to manage the favorites state.

- The store uses the `persist` middleware to automatically synchronize favorites to `localStorage` under the key `music-stream-favorites`.
- Favorites are stored as a `Record<number, CatalogItemType>`, allowing $O(1)$ lookups by track ID.

**Rationale**: Zustand provides a lightweight, performant way to manage global state without the boilerplate of Redux. Persistence ensures a seamless experience across sessions.

### 2. UI Pattern — Optimistic Updates

The `FavoriteButton` uses React's `useOptimistic` hook combined with `useTransition`.

- When a user clicks the heart, the UI state (filled/empty) updates **instantly**.
- The actual store update happens in a background transition.

**Rationale**: Music apps expect zero-latency interaction for basic actions like "liking" a song. Optimistic updates provide this "snappy" feel regardless of store/local storage speed.

### 3. API Consolidation — Unified Lookup Action

We consolidated all iTunes track lookup logic into `actions/catalog/catalog-actions.ts`.

- `itunesLookupAction(ids: number[])`: Handles batch lookups for the "Favorites Only" view.
- `itunesLookupSingleAction(id: number)`: Standardized wrapper for single track detail fetching.
- Removed the redundant `catalog-detail-actions.ts`.

**Rationale**: Centralizing API logic reduces code duplication and ensures consistent error handling and track-to-item mapping across the application.

### 4. Type Architecture — Centralized Definition

All domain types and interface definitions for the catalog feature (including `FavoritesState`, `FavoriteButtonProps`, etc.) were moved to `features/catalog/types/catalog-types.ts`.

- Components and stores exclusively import types from this centralized file.

**Rationale**: Adheres to the user's architectural preference for keeping type definitions separate from UI logic and state implementation, improving codebase discoverability and maintainability.

## Consequences

- **Improved UX**: Users get instant feedback and persistent favorites.
- **Maintainability**: Centralized types and consolidated actions reduce "dark corners" in the codebase.
