# ADR 0056: Playwright E2E Test Fixes

## Context

After PR #52 introduced the playlists test suite (`playlists.spec.ts`), global setup, and CI PostgreSQL integration, the Playwright E2E tests began failing both locally and in CI. Two prior fix branches were attempted without success. Investigation revealed multiple layered root causes spanning dependency compatibility, browser-specific behavior, and Next.js App Router navigation semantics.

## Decision

We applied the following fixes:

### 1. Downgrade `@hookform/resolvers` (v5 → v3)

`@hookform/resolvers@5.2.2` unconditionally imports from `zod/v4/core` at module level. The project uses Zod v3 (`^3.24.4`), which has no `v4/` subpath export. This caused a module-not-found error that crashed the entire Next.js dev server, making all routes return 500 and failing all 45 tests. Downgrading to `^3.10.0` resolves the incompatibility with no API changes needed — `zodResolver()` is identical across v3 and v5.

### 2. React hydration race condition on controlled inputs

The login form uses react-hook-form with controlled inputs (`value` prop from form state). In Firefox and WebKit, Playwright's `fill()` could execute before React hydration attached the form's event handlers. When hydration completed, React re-rendered with the default empty values, overwriting the filled data. The fix wraps the email fill in a `toPass()` retry that verifies the value persisted after filling.

### 3. `waitForURL` glob matching query parameters

The original `waitForURL("**/playlists")` glob matched the login URL `/login?returnTo=/playlists` (the query parameter contains `/playlists`), causing a false-positive pass while the page was still on the login form.

### 4. Next.js App Router client-side navigation vs Playwright URL tracking

After successful login, Next.js performs a client-side navigation via `router.push("/playlists")`. This uses `history.pushState` internally, which does not fire a new `domcontentloaded` or `load` event. Both `waitForURL` and `toHaveURL` block on Playwright's internal navigation tracker waiting for the navigation to "finish," which never happens for pushState transitions. The fix replaces all URL-based assertions with content-based assertions — waiting for the `<h1>Playlists</h1>` heading to appear.

### 5. CSS `text-transform: uppercase` and cross-browser accessible names

The "Recommended for You" heading has `text-transform: uppercase` via Tailwind's `uppercase` class. Firefox and WebKit accessibility APIs expose the CSS-transformed text ("RECOMMENDED FOR YOU"), while Chromium exposes the DOM text ("Recommended for You"). Using a case-insensitive regex (`/recommended for you/i`) ensures the heading is found across all browsers.

### 6. DB connection timeout retries under parallel load

With `fullyParallel: true`, multiple browser workers hit the Supabase database simultaneously. The connection pool (`max: 5`, `connectionTimeoutMillis: 2000`) can become exhausted, causing transient "Connection terminated due to connection timeout" errors. The sign-in click is wrapped in a `toPass()` retry that re-clicks the button if the login failed due to a DB timeout.

## Status

Accepted

## Consequences

- **Pros**:

  - All 45 tests pass reliably across Chromium, Firefox, and WebKit.
  - Tests are resilient to transient DB connection issues under parallel load.
  - Login flow correctly handles Next.js App Router client-side navigation.
  - Cross-browser CSS accessibility differences are accounted for.

- **Cons**:
  - `@hookform/resolvers` is pinned to v3.x until the project upgrades to Zod v4.
  - The `toPass()` retry pattern adds complexity to the test setup, but is necessary for reliability against infrastructure-level flakiness.
