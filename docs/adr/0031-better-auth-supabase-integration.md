# ADR 0031 — Better Auth + Supabase Integration

**Date:** 2026-02-25

## Context

The project requires a robust authentication system. The choice of Better Auth with a Supabase (PostgreSQL) backend was selected to provide a modern, developer-friendly auth experience without vendor lock-in, while leveraging existing Supabase infrastructure.

## Decision

### Authentication Framework

We are using **Better Auth** due to its tight integration with Next.js App Router, typed client hooks, and flexible adapter system.

### Database Adapter

We are using the **PostgreSQL adapter** via the `pg` pool library. This allows us to connect directly to the Supabase Postgres instance.

- **Why?**: Avoids the overhead of a full ORM (like Prisma/Drizzle) if not already in use for the core app, keeping the dependency tree lean.
- **SSL**: `rejectUnauthorized: false` is enabled in the pool config _only for development/testing_ to allow initial connections to Supabase's managed Postgres environment. In **production**, certificate verification is strictly enforced to ensure secure database communication.

### Catch-all Route

Implemented at `app/api/auth/[...all]/route.ts` to handle all authentication lifecycle events (Sign In, Sign Up, Sign Out, Session verification).

### Security (Row-Level Security)

The core auth tables (`user`, `session`, `account`, `verification`) are created in the `public` schema.

- **Decision**: Explicitly enabled **RLS (Row-Level Security)** on all auth tables.
- **Reasoning**: By default, Supabase exposes all `public` tables via its PostgREST API. Enabling RLS without explicit policies ensures these tables are "deny-all" for any client-side Supabase SDK calls, preventing leakages. Auth is handled exclusively server-side by Better Auth.

## Consequences

- Direct Postgres access is required (Supabase `DATABASE_URL`).
- Auth tables must be manually created using the provided `docs/db/auth-schema.sql` (CLI introspection requires a live connection).
- Extra security layer via RLS ensures zero exposure through Supabase's auto-generated REST API.
