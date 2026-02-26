# ADR 0040: Global Database Pool Singleton

## Context and Problem Statement

The application connects to a PostgreSQL database using `pg.Pool`. Initially, a new `Pool` instance was being instantiated for `betterAuth` in `lib/auth/auth.ts` and incredibly, a new `Pool` on _every single request_ inside `features/playlist/api/playlist-actions.ts`.

Instantiating a new db pool on every server action causes connection exhaustion rapidly. Standard backend best practices dictate using a singleton pool instance for database access.

## Decision

We decided to extract database pool initialization code into a new module `lib/db/pool.ts` which exports a single, globally cached `pg.Pool` instance (using `globalThis`). We will inject this singleton instance into both `better-auth` configuration and any server action querying the database via the `pg` driver.

## Consequences

- **Positive:** Improved stability, eliminated DB connection exhaustion bugs that were crashing actions with "too many clients" errors.
- **Positive:** Reduces connection latency overhead on subsequent requests.
