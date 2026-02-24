# ADR 0020: UI/UX Refresh & Catalog Search State Preservation

## Context

Several UX and visual issues were identified:

1. **CatalogCard** used a generic card-with-sections layout that didn't utilise the artwork well — artwork was a thumbnail in a separate header, not integrated with the card identity.
2. **TrackDetailPage** used a plain two-column layout with no atmospheric context around the track.
3. **Landing page** used inflated copy (fake stats, fake social proof, unimplemented "Artist Radio" feature) inconsistent with the project's honest, small-scale nature.
4. **Back navigation from detail page** lost all catalog search state — search results and scroll position reset to the default "top music" list.

## Decisions

### 1. CatalogCard — Artwork-Blend Aesthetic

Replace the `Card` component layout with a full-bleed square image. A CSS gradient (`from-black/80 via-black/20 to-transparent`) fades the bottom of the artwork into dark, and track info (title, artist, genre, badge) is overlaid directly on this gradient. No separate content/footer sections or play buttons (to avoid accidental downloads).

**Rationale**: Artworks are visually distinct — letting them fill the entire card and blend downward creates an immersive, album-cover feel consistent with music apps. Clicking the card navigates directly to the detail page for playback.

### 2. TrackDetailPage — Centered Music Player

Redesign the detail page from a left-right split to a **centered music-player aesthetic**.

- A full-viewport immersive blurred background is fixed behind the content.
- The artwork is centered with a color-matched glow that intensifies during playback.
- An **inline 30-second preview player** with a circular play/pause button and a progress bar (with scrub support).
- Track metadata is stacked cleanly below the artwork.

**Rationale**: Provides a more focused and immersive experience, avoiding empty space on large screens and mimicking modern music application layouts.

### 3. Red-tinted Theme & Immersive Backgrounds

Implement a custom **red-tinted color palette** for the entire site using Shadcn UI tokens (OKLCH).

- Light mode: White background with deep red accents and blush-tinted borders/secondary elements.
- Dark mode: Near-black background with a subtle red tint and vibrant red primary accents.
- **Grainient Background**: A full-viewport animated WebGL background (`Grainient`) is used on the landing page, with colors dynamically matching the light/dark theme (rose/blush for light, maroon/crimson for dark).

**Rationale**: Creates a unique visual identity that feels more "premium" and energetic than a standard grayscale theme.

### 4. State Preservation & Navigation

- **Search State**: `useCatalog` reads/writes the `searchTerm` to the `?q=` URL parameter.
- **Back Navigation**: The "Back to Catalog" link in `TrackDetailPage` uses `router.back()` instead of a hardcoded `href`.

**Rationale**: `router.back()` ensures that the exact previous URL (including search params and potentially scroll state) is restored, providing a seamless transition from detail back to search results.

## Consequences

- Catalog cards are simplified and no longer contain interactive play buttons that could confuse users or trigger downloads.
- The landing page uses glassmorphism and animated backgrounds to create a high-impact first impression.
- `useCatalog` requires a `<Suspense>` boundary in `app/catalog/page.tsx` due to `useSearchParams`.
