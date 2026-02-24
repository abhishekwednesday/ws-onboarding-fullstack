# ADR 0011: Catalog UX States Strategy

## Context

A high-quality music application needs to handle various asynchronous states (loading, no results, errors) gracefully to provide a premium user experience and prevent layout shifts.

## Decision

We decided to:

1. **Implement Skeleton Loading**: Use shadcn `Skeleton` components in `LoadingState.tsx` to mimic the actual `CatalogCard` layout. This minimizes Visual Layout Shift (CLS) and provides immediate feedback.
2. **Dedicated Empty State**: Create a specialized `EmptyState.tsx` component that distinguishes between "no results" and "no search yet" (though currently used for no results). It includes an icon and a clear call to action.
3. **Structured Error Handling**: Use `ErrorState.tsx` to handle API failures with a consistent UI, providing helpful error messages and a "Try Again" functionality.
4. **Modular UX Components**: Separate these concerns into independent components within the `features/catalog/components/` directory for maximum reusability.
5. **Declarative Integration**: Update `CatalogPage` to conditionally render these states based on the React Query status.

## Rationale

- **User Perception**: Skeletons feel faster than traditional spinners by showing the structure of the data before it arrives.
- **Clarity**: High-quality icons and descriptions in empty/error states reduce user frustration.
- **Maintainability**: Centralizing these UI patterns makes it easier to update the "look and feel" across the entire feature.

## Consequences

- Consistent entry and failure experiences for the music catalog.
- Improved performance metrics (specifically CLS).
- A reusable pattern for other features requiring complex async states.
