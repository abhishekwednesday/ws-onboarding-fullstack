# ADR 0029 — PostHog Event Tracking

**Date:** 2026-02-25

## Context

With the PostHog infrastructure in place (ADR 0028), events need to be wired up at the right product layers. The challenge is placing tracking at business-intent boundaries without coupling UI components directly to the analytics SDK.

## Decision

### Call-site placement

| Event              | Tracker                | Location                                    | Rationale                                                       |
| ------------------ | ---------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| `catalog_search`   | `trackCatalogSearch`   | `useCatalog.ts` useEffect on `deferredTerm` | Fires after debounce settles — captures intent, not keystrokes  |
| `track_selected`   | `trackTrackSelected`   | `CatalogCard.tsx` `handleCardClick`         | Fires at the navigation decision point                          |
| `theme_toggled`    | `trackThemeToggled`    | `ModeToggle.tsx` item `onClick`             | Fires at the user's explicit preference action                  |
| `favorite_added`   | `trackFavoriteAdded`   | `FavoriteButton.tsx` `handleToggle`         | Fired inside `useTransition`, colocated with the store mutation |
| `favorite_removed` | `trackFavoriteRemoved` | `FavoriteButton.tsx` `handleToggle`         | Same as above                                                   |

### Layer discipline

Components do not import from `posthog-js` directly. All event emission goes through `lib/analytics/events.ts`. This means:

- Renaming or restructuring an event requires a change in exactly one file
- Components stay decoupled from the analytics infrastructure
- PostHog can be swapped for any other provider without touching UI code

## Consequences

- Five intent events are now captured on every meaningful user interaction
- Analytics call sites are stable: they live at hook/handler boundaries, not in render loops
- The unit test suite in `tests/unit/lib/analytics/events.test.ts` verifies event names, payloads, and PII sanitization
