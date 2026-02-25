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
    - **Favorites Short-circuiting**: A new `shouldShowFavoritesOnly` toggle is returned. When active, it short-circuits the main catalog data and returns the client-side favorite items instead.
    - **Query Disabling**: The `useInfiniteQuery` is explicitly disabled (`enabled: !shouldShowFavoritesOnly`) when viewing favorites to prevent unnecessary background fetches and potential layout shifts.
    - **Error Masking**: While in favorites mode, any stale errors or error states from the main catalog query are masked to provide a clean UI.
2.  **Standardizing API Actions**: Refactored `itunesSearchAction` to return a standardized payload (`items`, `nextOffset`, `totalCount`) tailored for React Query's `getNextPageParam`.
3.  **Feature-Specific API Relocation**: Moved server actions from the global `actions/` directory to `features/catalog/api/` to improve modularity and feature isolation.
4.  **Implementing React 19 `useTransition`**: Used `useTransition` in the `setSearchTerm` handler to allow the UI to remain responsive during high-priority search input updates while the URL and query update in the background.

## Consequences

- **Performance**: Reduced network traffic by pausing background fetches during favorites exploration.
- **Testability**: Tests using `QueryClientProvider` must account for the toggle state and its impact on data availability.
- **Modularity**: Server actions are now strictly separated from UI state, returning consistent metadata for pagination across all consumers.
- **Pros**:
  - Automatic caching and staletime management.
  - Simplified hook logic (removed manual refs and fetch IDs).
  - Improved UX with smoother search transitions.
  - Better project structure with feature-grouped actions.
- **Cons**:
  - Requires wrapping tests in `QueryClientProvider`.
  - Slight increase in initial setup complexity.
