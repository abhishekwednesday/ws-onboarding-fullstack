# ADR 0016: Infinite Scroll Implementation

## Context

To enhance the user experience in the Music Catalog, we need to allow users to browse more than the initial 50 results. Pagination should be seamless and integrated with the search functionality.

## Decision

We decided to:

1. **Implement Infinite Scroll**: Use `IntersectionObserver` via a custom `useInfiniteScroll` hook with ref-based callbacks to prevent stale closure issues and avoid triggering during in-flight fetches.
2. **Offset-Based Pagination**: Utilize the iTunes API's `offset` parameter with a stable ref-based counter that always advances by `PAGE_SIZE`, independent of the filtered item count.
3. **Duplicate Detection & Termination**: When a full page of results from the API contains zero unique items (all duplicates), automatically set `hasMore = false` to stop further pagination. This handles the iTunes API's behavior of recycling results beyond its dataset limit.
4. **Stale Fetch Protection**: Use an incrementing `fetchId` to discard results from superseded requests (e.g., when search term changes mid-fetch).
5. **Skeleton Loading**: Display skeleton cards matching the catalog grid layout during incremental loads for visual consistency.

## Rationale

- **UX Consistency**: Infinite scroll provides a modern, high-engagement feel compared to traditional pagination buttons.
- **Robustness**: Calculating offsets based on `items.length` prevents errors if the `page` state and current list size get out of sync.
- **Performance**: `AbortController` ensures we don't process or display stale search results, saving bandwidth and CPU.

## Consequences

- Users can now browse much larger sets of music results seamlessly.
- The `useCatalog` hook is now more feature-rich but remains clean due to the separation of concerns.
- Potential duplicate key errors are handled gracefully at the data layer.
