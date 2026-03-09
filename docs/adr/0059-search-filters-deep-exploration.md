# ADR: Search Filters and Deep Exploration

## Context

The application needed to support advanced music discovery through filtering and detailed exploration of artists and albums.

## Decision

- **Search Filters**:
  - Implemented with URL-driven state sync to allow bookmarking and sharing search results.
  - Added country, media type, and explicit content options.
- **Deep Exploration Routes**:
  - Created `app/artist/[id]` and `app/album/[id]` as public routes.
  - Utilized the iTunes `/lookup` endpoint to fetch detailed data.
  - Implemented robust identification logic in `itunesArtistLookupAction` to handle edge cases where entity IDs might be mapped differently (e.g., fallback check for `artistId`).
- **Navigation Integration**:
  - Enhanced `CatalogCard` with clickable artist and album links using `artistId` and `collectionId`.
  - Integrated artist and album links into the Track Detail page.
- **UI Enhancements**:
  - Implemented a glassmorphic filter dropdown on the catalog page.
  - Used proxy high-res artwork for artists when specific images are unavailable.

## Consequences

- **Positive**: Improved navigation flow and deeper discovery of content. URL-synced search enables sharing.
- **Negative**: Increased complexity in `useCatalog` hook to handle multiple filter parameters.
