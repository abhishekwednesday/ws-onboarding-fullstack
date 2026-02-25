# ADR 0033 — Next.js Route Protection & Middleware

**Date:** 2026-02-25

## Context

With authentication fully integrated into the Next.js App Router via Better Auth (`features/auth` + Server Actions), we needed a global mechanism to protect sensitive routes. The `middleware.ts` pattern is standard for Next.js, executing on the Edge Runtime to evaluate requests before they reach the main React tree.

A critical limitation arose: Better Auth's `pg` adapter relies on Node.js-specific modules (like `net`, `tls`, `pg`) which are strictly incompatible with the Next.js Edge Runtime where standard Next middleware executes.

## Decision

### Next.js Edge Middleware Strategy

To protect routes rapidly at the edge without crashing due to Node.js imports:

1.  **Avoid Native Auth Evaluation in Middleware:** We cannot import `auth` (from `lib/auth.ts`) directly into `middleware.ts`.
2.  **Utilize `better-fetch`:** We installed `@better-fetch/fetch` (Better Auth's recommended fetch wrapper).
3.  **Local API Ping:** The middleware intercepts requests to protected routes (like `/playlists`) and makes a fast HTTP `GET` request to our own Serverless API endpoint (`/api/auth/get-session`), forwarding the user's incoming `cookie` header.

### Route Guarding

If the `/api/auth/get-session` returns `null` for a protected route, the middleware issues a `NextResponse.redirect` to `/login`. We explicitly bypassed API routes, static assets (`_next`), and images inside the Next.js `matcher` config to prevent redundant HTTP pings on internal Next.js requests.

### Protected UI Feature

Created a mock `/playlists` feature route (under `app/(protected)/playlists`) and integrated conditional navigation into `Navbar.tsx` based on the native `useSession` state.

## Consequences

- Next.js middleware correctly restricts unauthorized layout rendering entirely.
- Bypassed the Next.js Edge environment limitations by hitting a standard Node serverless route internally.
- There is a minor latency overhead on protected route navigation (hitting our own Next.js API first), but the caching layers mitigate it and ensure secure separation of concerns.
