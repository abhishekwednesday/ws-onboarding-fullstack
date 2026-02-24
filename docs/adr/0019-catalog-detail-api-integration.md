# ADR 0019: Catalog Detail Page API Integration

## Context

Following ADR 0018 (static detail route), we need to connect `/catalog/[id]` to live data. The iTunes API provides a `/lookup?id={trackId}` endpoint that returns the same response shape as the search endpoint, making integration straightforward. The page must also work on hard refresh with no dependency on the catalog list's in-memory state.

## Decision

We decided to:

1. **Add `lookupItunesTrack(id)` to the API client** (`lib/api/itunes.ts`): uses `/lookup?id={id}&entity=song`, validates with the existing `ItunesSearchResponseSchema`, and throws a descriptive error when `resultCount === 0`.

2. **Introduce a dedicated server action** `itunesLookupAction(id)` (`actions/catalog/catalog-detail-actions.ts`): wraps the lookup, maps the result through `mapItunesTrackToCatalogItem`, and surfaces a user-friendly error — consistent with `itunesSearchAction`.

3. **Use a standalone React Query `useQuery` hook** `useTrackDetail(id)` with `queryKey: ["track", id]` — completely separate from the list's `["catalog", query]` key. This ensures:

   - The detail page re-fetches independently on mount and page refresh.
   - Navigating back to the list does not invalidate or depend on detail cache.
   - No shared state between list and detail.

4. **Convert `TrackDetailPage` to a Client Component** (`"use client"`) to consume the hook, rendering three states: `TrackDetailSkeleton` → success layout → `ErrorState` with retry.

5. **Create a dedicated `TrackDetailSkeleton`**: a 2-column skeleton (artwork block + metadata stubs) that mirrors the detail layout — not the catalog grid's `LoadingState`.

6. **Navigate from cards via `useRouter.push`** (not a `<Link>` wrapper): wrapping `CatalogCard` in `<Link>` would create nested `<a>` elements (the iTunes badge is also an `<a>`), violating HTML validity and breaking accessibility tooling. `router.push` is called on `onClick`/`onKeyDown`, keeping the badge's own `stopPropagation` intact.

7. **Mock `next/navigation` and `next/link` globally in `vitest.setup.ts`**: `useRouter` requires the Next.js app router to be mounted, which is not available in jsdom. A global mock surfaces a stub router to all tests, avoiding boilerplate per-file mocking.

## Rationale

- **Independence**: `queryKey: ["track", id]` guarantees the detail query is self-contained — refreshing `/catalog/5` always fetches from the network, not from the list cache.
- **Consistency**: The server action pattern mirrors the existing search action, keeping the data-fetching layer uniform.
- **HTML validity**: Avoiding nested `<a>` elements prevents hydration warnings, screen-reader issues, and browser inconsistencies.
- **Dedicated skeleton**: A detail-specific skeleton accurately communicates the layout users will see, rather than showing an unrelated grid of cards.

## Consequences

- `/catalog/{id}` now shows live data from iTunes for any valid track ID, not just the 4 mock entries.
- Invalid / non-existent IDs surface a retryable `ErrorState` instead of a 404.
- The `vitest.setup.ts` global mock applies to all current and future tests, eliminating the need to mock `next/navigation` per test file.
- `generateStaticParams` was removed — the page is now fully dynamic (SSR-on-demand).
