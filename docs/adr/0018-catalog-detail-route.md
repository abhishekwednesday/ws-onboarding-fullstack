# ADR 0018: Catalog Track Detail Route

## Context

The Music Catalog currently only provides a list view (`/catalog`). To support a richer user journey, we need an individual track detail page reachable at `/catalog/[id]`. This is the first iteration — the goal is to establish the route structure and layout with zero API dependencies so it can be built upon incrementally.

## Decision

We decided to:

1. **Use the Next.js App Router dynamic segment** `app/catalog/[id]/page.tsx` with `params.id` as the track identifier.
2. **Use static mock data** (`MOCK_CATALOG_ITEMS` from `catalog-types.ts`) as the data source. No API fetch is performed in this iteration — the route is a static layout exercise.
3. **Use `notFound()`** from `next/navigation` for unrecognised IDs, producing a proper 404 rather than an empty or broken page.
4. **Export `generateStaticParams`** for the 4 mock items, enabling Next.js to pre-render the detail pages at build time.
5. **Keep the page component a Server Component (RSC)** — no `"use client"` directive. The `TrackDetailPage` feature component is also purely presentational.
6. **Upscale artwork** from the iTunes 100×100 thumbnail to 600×600 using the same URL-replacement pattern already used in `CatalogCard`.
7. **Maintain iTunes compliance** — the "Preview provided courtesy of iTunes" text and "Listen on Apple Music" badge are present on the detail page.

## Rationale

- **Incremental delivery**: Establishing the route and layout first decouples visual work from API integration, which can be added in a follow-up ticket.
- **Static params**: `generateStaticParams` with mock data means the pages are pre-rendered during the build — zero runtime overhead and instant navigation for the known tracks.
- **No duplication**: Reusing `MOCK_CATALOG_ITEMS` and `CatalogItemType` avoids introducing a separate type or fixture for the detail page.

## Consequences

- The detail route exists and is navigable but only covers the 4 mock tracks. Real tracks will return 404 until the API integration ticket is completed.
- A follow-up ADR will document the decision to fetch live data from the iTunes API and replace the mock lookup.
