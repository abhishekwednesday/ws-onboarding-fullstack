# ADR 0039: Playlist Feature Unit Tests

## Context

To maintain confidence in correctness—especially around optimistic UI patterns and store hydration—unit tests were needed.

## Decision

Created four test suites covering the core non-UI logic:

| Test File                    | Subject                          | Tests |
| ---------------------------- | -------------------------------- | ----- |
| `usePlaylistStore.test.ts`   | Zustand ephemeral track store    | 13    |
| `useFavoritesStore.test.ts`  | Zustand persisted favorites      | 9     |
| `usePlaylists.test.tsx`      | Playlist list hook (react-query) | 4     |
| `usePlaylistDetail.test.tsx` | Playlist detail + mutations      | 7     |

### Testing Strategy

- **Stores** are tested by calling Zustand's `getState()` directly, wrapped in `act()` for React integration.
- **Hooks** use `renderHook` with a `QueryClientProvider` wrapper (`retry: false` for deterministic failures). Server actions are fully mocked via `vi.mock`.
- **Optimistic rollback** is verified by checking store state after simulated server failures.
- **Server actions** (`playlist-actions.ts`) are not unit-tested directly since they depend on `pg` pool connections and RLS context; they are validated via integration/E2E tests.
