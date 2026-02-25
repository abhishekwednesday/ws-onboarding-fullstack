# ADR 0028 — PostHog Setup

**Date:** 2026-02-25

## Context

The project needs product analytics to understand user behaviour across catalog search, track selection, theme preference, and favourites. A feature flag and A/B experiment layer is also required for controlled rollouts.

## Decision

Integrate **PostHog** as the analytics and feature flag platform via `posthog-js`.

### Architecture

Three modules with single responsibilities:

| Module                                     | Responsibility                              |
| ------------------------------------------ | ------------------------------------------- |
| `lib/analytics/posthog-client.ts`          | Initialise and export the PostHog singleton |
| `lib/analytics/events.ts`                  | Typed product-event tracker functions       |
| `components/providers/PostHogProvider.tsx` | Init on mount; expose the React context     |

### Environment Configuration

Two optional client env vars validated via `@t3-oss/env-nextjs`:

- `NEXT_PUBLIC_POSTHOG_KEY` — project API key (optional)
- `NEXT_PUBLIC_POSTHOG_HOST` — ingestion host, defaults to `https://app.posthog.com`

When `NEXT_PUBLIC_POSTHOG_KEY` is absent (local dev without `.env.local`) `initPostHog` is a no-op; the app still renders and no errors are thrown.

### Tracker Function Pattern

Components **never** call `posthog.capture(...)` directly. All event emission goes through named functions in `events.ts`:

```ts
// ✅ Correct — intent-named, colocated with business logic
trackCatalogSearch(term)

// ❌ Incorrect — raw capture spread across components
posthog.capture("catalog_search", { ... })
```

This keeps event definitions in one place, makes renaming/payload changes trivial, and decouples components from the analytics SDK.

### PostHog Configuration

| Option              | Value               | Reason                                                                              |
| ------------------- | ------------------- | ----------------------------------------------------------------------------------- |
| `capture_pageview`  | `false`             | Next.js App Router handles navigation differently; manual tracking is more accurate |
| `capture_pageleave` | `true`              | Session duration signals                                                            |
| `person_profiles`   | `"identified_only"` | Privacy-first default                                                               |
| `debug`             | `true` in dev       | PostHog logs events to the console during local development                         |

## Consequences

- Analytics are completely inert in local dev without a key; no network calls, no console errors
- All event definitions live in one file — easy audit, easy rename
- `posthog-js/react` provides `useFeatureFlagEnabled` hooks used in subsequent branches
