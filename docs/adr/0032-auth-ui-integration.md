# ADR 0032 — Auth UI Feature Architecture

**Date:** 2026-02-25

## Context

With the Better Auth server infrastructure in place across the application, we required a cohesive approach to integrating user-facing authentication (Login, Register, User Menus). The codebase is moving towards a feature-driven architecture to keep related logic encapsulated.

## Decision

### Feature-Driven Directory Structure

We placed all authentication-related UI and logic inside `features/auth/` rather than scattering components across global `components/` or `lib/` folders.

- **Server Actions:** `features/auth/api/auth-actions.ts` handles the execution of `signInEmail`, `signUpEmail`, and `signOut` on the server. By utilizing the `nextCookies` plugin in Better Auth, these Server Actions can successfully persist session cookies to the client.
- **Hooks (Client-side wrappers):** `features/auth/hooks/useAuth.ts` wraps the Server Actions in React `useTransition`. This enables unified loading states (`isPending`) without manual boolean toggles across multiple components.
- **Components:** `LoginForm.tsx`, `RegisterForm.tsx`, and `UserMenu.tsx` maintain the application's dark aesthetic using Shadcn UI.
- **Types:** Validation schemas dynamically exported from `features/auth/types/auth-types.ts` using `zod`.

### State Synchronization Strategy

Since Better Auth's `useSession()` client hook automatically caches user state based on direct SDK calls, bypassing the client SDK with Next.js Server Actions causes a disjointed UX where the cookie is set, but the client cache remains unaware until a reload.

- **Decision:** After a successful Server Action (Login/Register/Logout), the `useAuth` hook deliberately performs a hard navigation (`window.location.href = redirectTo`) rather than a soft Next.js router push.
- **Reasoning:** A full page reload guarantees the updated session cookie is sent to the server on the subsequent request, inherently forcing `better-auth/react` to re-fetch and serialize the new authenticated state. This resolves the synchronization issue with minimal bridging overhead.

## Consequences

- Clear separation of concerns mapping UI interactions directly to secure Server Actions.
- Required a hard reload strategy to bridge server-side mutative actions with client-side cached stores.
- Auth code is highly modularized and easily portable as a single generic "feature".
