# ADR 0057: Code Quality Cleanup

## Context

A full three-agent audit (Vibe Code Cleanup, Project Audit & Refactor, AI Slop Removal) was run across the codebase after the recommendations and playlist features were completed. The audit identified a cluster of issues spanning security boundaries, naming convention violations, slop patterns introduced during AI-assisted sessions, and missing Next.js App Router conventions.

The issues grouped into five distinct categories:

### 1. Missing `server-only` guards

`lib/db/pool.ts`, `lib/auth/auth.ts`, and `features/playlist/api/playlist-utils.ts` are server-only modules (DB pool, auth config, session utilities) but had no `import 'server-only'` declaration. Without it, Next.js cannot statically prevent these modules from being accidentally bundled into the client, which would expose DB credentials, auth secrets, and connection logic to the browser.

### 2. Direct `process.env` access outside `env.mjs`

`lib/auth/auth-client.ts` accessed `process.env.NEXT_PUBLIC_BETTER_AUTH_URL` directly, bypassing the project's validated `env.mjs` wrapper. The project enforces all environment variable access through `@t3-oss/env-nextjs` to catch misconfiguration at build time. Raw `process.env` access defeats this contract.

### 3. Raw `<img>` tags and a non-semantic interactive element

Three `<img>` tags for the iTunes badge existed in `CatalogCard.tsx` and `TrackDetailCompliance.tsx`, bypassing Next.js image optimisation (lazy loading, format negotiation, CDN caching). Additionally, one of the badge instances was wrapped in a `<span onClick>` — a non-semantic interactive element that is inaccessible to keyboard and assistive technology users.

### 4. Naming convention violations

The project convention requires the `Type` suffix on all type and interface declarations. Several types introduced during recent feature work were missing it:

- `LoginFormData` / `RegisterFormData` → `LoginFormDataType` / `RegisterFormDataType`
- `CreatePlaylistInput` → `CreatePlaylistInputType`
- `PlaylistState` → `PlaylistStateType`
- `PlaylistItemProps` → `PlaylistItemPropsType`
- `UsePlaylistDetailOptions` → `UsePlaylistDetailOptionsType`
- `CacheEntry` → `CacheEntryType`
- `UseInfiniteScrollProps` → `UseInfiniteScrollPropsType`
- `PageProps` in `[playlistId]/page.tsx` → `PagePropsType`

### 5. AI slop patterns

Two patterns introduced during AI-assisted sessions were identified:

- **Obvious comments** in `LoginForm.tsx` and `RegisterForm.tsx`: `// Server action login hook wrapper` and `// Server action register hook wrapper` — both stated what the immediately following line already made clear.
- **Pointless wrapper function** in `usePlaylists.ts`: `createPlaylist` was a one-liner that only called `createPlaylistMutation.mutateAsync(data)` and returned the result, adding an extra call frame and a JSDoc comment to describe something that needed no description.

### 6. Missing Next.js route segment files

No `loading.tsx`, `error.tsx`, or `not-found.tsx` files existed in any route segment. The App Router uses these files to stream granular loading shells, catch errors at the segment boundary, and render typed 404 pages — without them, a thrown error or slow data fetch falls all the way up to the root layout.

## Decision

All identified issues were fixed on branch `chore/ONB-7-code-quality-cleanup`:

1. Added `import 'server-only'` to `lib/db/pool.ts`, `lib/auth/auth.ts`, and `features/playlist/api/playlist-utils.ts`. Installed the `server-only` package.

2. Replaced `process.env.NEXT_PUBLIC_BETTER_AUTH_URL` in `lib/auth/auth-client.ts` with `env.NEXT_PUBLIC_BETTER_AUTH_URL` from `@/env.mjs`.

3. Replaced all three `<img>` tags with `next/image` components with explicit `width` and `height` props. Replaced the `<span onClick>` disabled badge with a `<button disabled>` for semantic correctness.

4. Renamed all eight types and interfaces to include the `Type` suffix, and updated every import site across the codebase to match.

5. Removed the two obvious comments from the auth form components. Collapsed the `createPlaylist` wrapper in `usePlaylists.ts` to a direct assignment: `createPlaylist: createPlaylistMutation.mutateAsync`.

6. Added `loading.tsx`, `error.tsx`, and `not-found.tsx` to all four dynamic route segments:

   - `app/catalog/`
   - `app/catalog/[id]/`
   - `app/(protected)/playlists/`
   - `app/(protected)/playlists/[playlistId]/`

   Each file reuses existing skeleton and error state components from the relevant feature, keeping the loading and error UI consistent with what the components themselves render.

## Consequences

- **Security**: `server-only` guards prevent DB and auth modules from ever being bundled into the client, even if a future import accidentally crosses the server/client boundary. The `env.mjs` contract is fully enforced across all files.

- **Performance**: iTunes badge images now go through Next.js image optimisation (lazy loading, format conversion, CDN). Route segments have streaming-compatible loading shells, so slow data fetches no longer block the full page render.

- **Accessibility**: The disabled iTunes badge is now a `<button disabled>` — it is reachable by keyboard, announced correctly by screen readers, and its disabled state is communicated via the HTML `disabled` attribute rather than CSS alone.

- **Correctness**: Broken `error.tsx` and `not-found.tsx` boundaries mean uncaught server errors and missing resources now render a scoped, recoverable UI instead of crashing the root layout.

- **Maintainability**: Consistent `Type` suffix across all type declarations removes the ambiguity between value identifiers and type identifiers. The naming convention is now uniformly enforced across all three features. Removing the slop wrapper and obvious comments reduces noise in code review and keeps the signal-to-noise ratio high.

- **No breaking changes**: All renames were applied at every import site in the same commit. The build passes cleanly with zero TypeScript errors.
