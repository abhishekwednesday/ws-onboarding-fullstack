# ADR 0015: Catalog Search Implementation

## Context

The Music Catalog needs a way for users to search for specific content from the iTunes library. To ensure a professional experience and reduce unnecessary API pressure, search needs to be debounced and integrated seamlessly with the existing layout.

## Decision

We decided to:

1. **Implement Debounced Search**: Use a 500ms debounce delay for search queries. This prevents high-frequency API calls while the user is typing but provides timely feedback.
2. **Dedicated Search Hook**: Create a `useCatalog` hook to centralize search state management (input, debounced value, clear action) and integrate with the existing `useCatalogQuery`.
3. **Controlled Search UI**: Create a `SearchInput` component using shadcn `Input` with a clear button and search icon for enhanced UX.
4. **Responsive Header Layout**: Update `CatalogPage` header to show the catalog title and search input side-by-side on larger screens.
5. **Clearable Search**: Allow users to clear their search and return to the default "top music" view with a single click.

## Rationale

- **Performance**: Debouncing is critical for external API integrations (iTunes) to prevent rate-limiting and improve perceived performance.
- **Separation of Concerns**: Moving search logic into a custom hook makes the `CatalogPage` component cleaner and the logic more testable.
- **UX Excellence**: Providing immediate visual feedback (loading skeleton) during search updates enhances the "premium" feel of the application.

## Consequences

- Search functionality is now available to users.
- Consistent loading transitions during search.
- Scalable search architecture for future filter/sort enhancements.
