# ADR 0006: Setup API Client and React Query for MusicStream

## Context

The MusicStream application needs a robust, type-safe, and efficient way to fetch and manage data from the iTunes Search API.

## Decision

We decided to:

1. Use **TanStack Query (React Query)** for server state management (caching, loading states, error handling).
2. Use **Zod** for runtime schema validation of API responses.
3. Implement a centralized **iTunes API client** using the native `fetch` API.
4. Wrap the application in a **QueryProvider** to enable React Query across all components.

## Rationale

- **React Query**: Provides a powerful declarative API for data fetching, reducing boilerplate for managing loading, error, and stale states.
- **Zod**: Ensures the application only works with data that matches our expected types, providing safety and better debugging during development.
- **Native Fetch**: Modern browsers support `fetch` natively, and it's well-integrated with Next.js's caching and streaming features.

## Consequences

- Data fetching logic is decoupled from UI components.
- API responses are validated at the edge (the API client layer).
- Automatic caching and revalidation are enabled globally.
- Developers can use the TanStack Query DevTools for easy debugging in the browser.
