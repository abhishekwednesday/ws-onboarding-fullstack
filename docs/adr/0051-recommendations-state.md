# 51. Recommendations State Management

Date: 2026-02-27

## Context

We recently implemented the backend logic to generate recommended tracks based on a user's liked songs and playlists (`getRecommendedTracksAction`). We needed to integrate this server-side action with the React frontend to display the recommendations to the user. The primary considerations were caching, loading state management, error handling, and ensuring the data remains relatively fresh without unnecessarily spamming the API on every component remount.

## Decision

We decided to use React Query (`@tanstack/react-query`) via a custom hook named `useRecommendations`.

- **Custom Hook (`useRecommendations`):** This encapsulates the `useQuery` call, keeping the component layer clean and strictly focused on rendering.
- **Query Key:** `["recommendations"]`. This simple key makes it easy to manually invalidate the cache if needed (e.g., after the user likes a new song, though we are deferring aggressive invalidation for now to save API calls).
- **Stale Time (`staleTime: 1000 * 60 * 5`):** We set a 5-minute stale time. Recommendations are based on historical listening data which doesn't change second-to-second. Caching them for 5 minutes provides a snappy UX when navigating between pages (like Album/Artist views back to the Playlists view) while ensuring the user still gets fresh recommendations periodically.
- **Retry (`retry: false` in tests, default elsewhere):** We allow React Query's default exponential backoff retry behavior in production, but we explicitly disable retries in our unit tests to prevent artificial timeouts when verifying error states.

## Consequences

### Positive

- **Performance:** The 5-minute cache (`staleTime`) prevents redundant server-side executions and iTunes API queries during normal app navigation.
- **Developer Experience:** React Query abstracts away the complex state machine (isLoading, isError, data), reducing boilerplate in the UI components compared to `useEffect` and `useState`.
- **Separation of Concerns:** Components just call `const { recommendations, isLoading } = useRecommendations()` without needing to know _how_ the data is fetched or cached.

### Negative

- **Delayed Freshness:** If a user likes a new song, that song might not immediately influence their recommendations until the 5-minute cache expires or the query is manually invalidated. This is an acceptable tradeoff for the performance gains considering external API rate limits.
