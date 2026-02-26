# ADR 0037: Playlist Pages and UI Refinements

## Status

Accepted

## Context

Following the implementation of playlist hooks and stores, we needed to build the user-facing pages and ensure a high-quality UX for adding and navigating songs. This combines the requirements for playlist management and catalog integration.

## Decision

We have implemented a consolidated UI architecture:

1.  **Dynamic Routing & Pages**:
    - Used Next.js dynamic routes `app/(protected)/playlists/[playlistId]/page.tsx` for individual playlists.
    - Implemented `PlaylistGrid` and `CreatePlaylistDialog` for the main listing page.
2.  **Add to Playlist (Catalog Integration)**:
    - Integrated `AddToPlaylistButton` (+) into both `CatalogCard` (Grid) and `CatalogGridVariantB` (Row) layouts.
    - Used a `Popover` approach for the addition flow to keep the user in context while selecting a playlist.
    - Leveraged `usePlaylistStore` for immediate optimistic feedback (checkmarks) on tracks already present in a playlist.
3.  **UX Hardening**:
    - Tracks in the playlist detail view are now clickable, linking back to the `CatalogDetailPage`.
    - Added hover effects, play icons, and loading skeletons to ensure a premium feel matching the rest of the app.
4.  **Component Architecture**:
    - Maintained a one-way dependency from `features/catalog` to `features/playlist` for the "+" button.
    - Selective store subscriptions in hooks to minimize re-renders.

## Consequences

- **Positive**: Seamless interaction model between search, discovery, and curation. Highly responsive feedback via optimistic state.
- **Negative**: Increased complexity in catalog components to safely render playlist actions only for authenticated users.
