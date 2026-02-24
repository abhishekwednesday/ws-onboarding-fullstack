# ADR 0020: UI/UX Refresh & Catalog Search State Preservation

## Context

Several UX and visual issues were identified:

1. **CatalogCard** used a generic card-with-sections layout that didn't utilise the artwork well — artwork was a thumbnail in a separate header, not integrated with the card identity.
2. **TrackDetailPage** used a plain two-column layout with no atmospheric context around the track.
3. **Landing page** used inflated copy (fake stats, fake social proof, unimplemented "Artist Radio" feature) inconsistent with the project's honest, small-scale nature.
4. **Back navigation from detail page** lost all catalog search state — search results and scroll position reset to the default "top music" list.

## Decisions

### 1. CatalogCard — Artwork-Blend Aesthetic

Replace the `Card` component layout with a full-bleed square image. A CSS gradient (`from-black/80 via-black/20 to-transparent`) fades the bottom of the artwork into dark, and track info (title, artist, genre, badge) is overlaid directly on this gradient. No separate content/footer sections.

**Rationale**: Artworks are visually distinct — letting them fill the entire card and blend downward creates an immersive, album-cover feel consistent with music apps. Removes unnecessary visual chrome.

### 2. TrackDetailPage — Blurred Hero

The track's artwork (blurred, dimmed, scaled) is placed as an absolutely positioned background layer behind the page header, creating an immersive atmospheric context. The foreground contains a compact artwork thumbnail + clean metadata column. No heavy card frames.

**Rationale**: Common pattern in music apps (Apple Music, Spotify track pages). Contextualises the detail view without adding UI complexity.

### 3. Landing Page — Minimal & Honest

Remove: stats section (70M+ tracks — not our data to claim), fake social proof ("10,000+ users"), unimplemented "Artist Radio" feature card, CTA banner. Rewrite tone to match the project's actual scale — a small personal music discovery tool.

Keep: one-sentence hero, primary CTA, two accurate feature cards (Search, Preview).

**Rationale**: Inflated copy erodes trust and looks corporate for a small project. Honest, direct copy is more appropriate.

### 4. Search State → URL Query Param (`?q=`)

`useCatalog` now reads the initial `searchTerm` from `useSearchParams().get("q")` and writes back via `router.replace("/catalog?q=...", { scroll: false })` on every `setSearchTerm` call.

When the user navigates to a detail page and presses Back, the browser restores the previous URL (`/catalog?q=bohemian`), the hook reads the `q` param, and React Query's cache serves the result instantly — no full re-fetch required in most cases.

`app/catalog/page.tsx` wraps `CatalogPage` in `<Suspense>` with a `LoadingState` fallback, as required by Next.js App Router when any client component uses `useSearchParams`.

**Rationale**: Encoding transient UI state in the URL is idiomatic web behaviour. It handles Back navigation, link sharing, and browser reload for free without any additional client-side state management.

## Consequences

- Catalog cards no longer have an accessible `<a>` badge link nested inside them — the badge `<a>` is still present with `stopPropagation` and the card navigation uses `router.push`. This was already the approach from ADR 0019.
- The landing page no longer advertises features or statistics not backed by the actual application.
- `useCatalog` requires a `<Suspense>` boundary — this is a one-time change to the route handler.
