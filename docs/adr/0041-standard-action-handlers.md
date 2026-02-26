# ADR 0041: Standardized Server Action Handlers

## Context and Problem Statement

Almost all server actions in `features/auth/api/auth-actions.ts` and `features/playlist/api/playlist-actions.ts` contained duplicated boilerplate `try...catch` blocks that artificially typecasted unknown errors into `{ message?: string }` payload expectations. This violated DRY, obscured generic errors (like database errors not mapping cleanly), and caused immense bloat inside business actions.

## Decision

We extracted the `try...catch` error normalization block into a reusable utility function `withActionHandler<T>(action, defaultError)` in `lib/utils/action-handler.ts`. Additionally, the return typing logic for `success`/`error` was lifted from individual feature scopes into a globally exported `ActionState<T>` type.

## Consequences

- **Positive**: Server actions no longer contain 10+ lines of identical error parsing boilerplate and are instead focused on resolving core functionality.
- **Positive**: Unknown errors map much cleanly to `defaultErrorMessage` parameters rather than generating chaotic undefined results to the client UI.
- **Negative**: Adds a closure layer (`() => Promise<T>`) over the actions, invoking a negligible micro-overhead in JS execution.
