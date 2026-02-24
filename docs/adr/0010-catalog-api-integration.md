# ADR 0010: Catalog API Integration Strategy

## Context

The MusicStream application requires a scalable and secure way to fetch data from the ITunes API and manage that data on the client side. We need to follow modern Next.js and React 19 patterns.

## Decision

We decided to:

1. **Use Server Actions as a Data Bridge**: Implement all ITunes API calls through Next.js Server Actions (`"use server"`). This ensures that API logic is decoupled from the client and provides a secure, type-safe interface.
2. **Leverage TanStack Query for State Management**: Use React Query (`useQuery`) to manage loading, error, and caching states on the client. This provides a robust "middle layer" between the raw server action and the UI components.
3. **Strict Data Flow & Structure**:
   - `features/catalog/components/CatalogPage.tsx` uses `useCatalogQuery`.
   - `features/catalog/hooks/useCatalogQuery.ts` (camelCase) invokes `itunesSearchAction`.
   - `actions/catalog/catalog-actions.ts` (Server Action) calls `searchItunes` from `lib/api/itunes.ts`.
   - Each feature contains sub-dirs: `components`, `hooks`, `types`.
4. **Declarative UI States**: Implement explicit loading (spinner) and error (retry) UI states in the `CatalogPage` to improve user experience.
5. **Caching & Revalidation**: Set a `staleTime` (5 minutes) in React Query to minimize redundant server requests.

## Rationale

- **Security**: Server Actions prevent exposing API implementation details or potential keys to the client.
- **Performance**: React Query's caching reduces network overhead and provides a snappier UI.
- **Maintainability**: The clear separation of concerns (Action -> Hook -> UI) makes the codebase easier to debug and test.
- **Consistency**: Following standard Next.js and React patterns ensures long-term sustainability and ease of onboarding.

## Consequences

- A standardized pattern for all future API integrations in the project.
- Improved error handling and loading feedback for users.
- A clean, type-safe data pipeline from server to client.
