# ADR 0026: Modernize Data Fetching with React Query

## Status

Accepted

## Context

The previous implementation of the `useCatalog` hook relied on manual `useState`/`useEffect` patterns, which led to:

- Complex state management for pagination and search IDs.
- Lack of caching and deduplication.
- Potential race conditions during rapid typing.
- Mixed responsibilities in the hook.

## Decision

We modernized the catalog feature by:

1.  **Introducing TanStack Query**: Replaced raw fetches in `useCatalog` with `useInfiniteQuery`.
2.  **Standardizing API Actions**: Refactored `itunesSearchAction` to return a standardized payload (`items`, `nextOffset`, `totalCount`) tailored for React Query's `getNextPageParam`.
3.  **Feature-Specific API Relocation**: Moved server actions from the global `actions/` directory to `features/catalog/api/` to improve modularity and feature isolation.
4.  **Implementing React 19 `useTransition`**: Used `useTransition` in the `setSearchTerm` handler to allow the UI to remain responsive during high-priority search input updates while the URL and query update in the background.

## Consequences

- **Pros**:
  - Automatic caching and staletime management.
  - Simplified hook logic (removed manual refs and fetch IDs).
  - Improved UX with smoother search transitions.
  - Better project structure with feature-grouped actions.
- **Cons**:
  - Requires wrapping tests in `QueryClientProvider`.
  - Slight increase in initial setup complexity.
