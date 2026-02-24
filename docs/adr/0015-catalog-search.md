# ADR 0015: Catalog Search Implementation

## Context

The Music Catalog needs a way for users to search for specific content from the iTunes library. To ensure a professional experience and reduce unnecessary API pressure, search needs to be debounced and integrated seamlessly with the existing layout.

## Decision

We decided to:

1. **Implement Idiomatic Search Debouncing**: Use React 19's `useDeferredValue` to handle search queries. This allows the UI to remain responsive by deferring the data fetching process while the user is actively typing.
2. **Dedicated Search Hook**: Create a `useCatalog` hook to centralize search state management and integrate with the existing `useCatalogQuery` via the deferred value.
3. **Controlled Search UI**: Create a `SearchInput` component using shadcn `Input` with a clear button and search icon for enhanced UX.
4. **Responsive Header Layout**: Update `CatalogPage` header to show the catalog title and search input side-by-side on larger screens.
5. **Clearable Search**: Allow users to clear their search and return to the default "top music" view with a single click.

## Rationale

- **Performance**: `useDeferredValue` is superior to `setTimeout` for search because it integrates with React's concurrent rendering, prioritizing user input and avoiding excessive re-renders.
- **Separation of Concerns**: Moving search logic into a custom hook makes the `CatalogPage` component cleaner and the logic more testable.
- **UX Excellence**: Deferring the update provides a natural, smooth transition between search states without the "stutter" often found in manual debouncing.

## Consequences

- Search functionality is now available to users.
- Consistent loading transitions during search.
- Scalable search architecture for future filter/sort enhancements.
