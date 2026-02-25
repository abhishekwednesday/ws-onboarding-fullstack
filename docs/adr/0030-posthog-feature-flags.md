# ADR 0030 — PostHog Feature Flags & A/B Experiment

**Date:** 2026-02-25

## Context

The project needs a mechanism to ship features to subsets of users and run controlled experiments without permanent code branches. Two flags were introduced: one driving a catalog layout experiment, one gating an upcoming AI summaries feature.

## Decision

### Abstraction layer

Components never call `useFeatureFlagEnabled` directly. They go through `useFeatureFlag` from `lib/feature-flags/flags.ts`:

```ts
// ✅ Correct — constant + abstracted hook
const isEnabled = useFeatureFlag(FLAG_NEW_CATALOG_LAYOUT)

// ❌ Incorrect — couples component to PostHog API
const isEnabled = useFeatureFlagEnabled("new-catalog-layout")
```

### Flags defined

| Constant                  | Key                  | Purpose                                     |
| ------------------------- | -------------------- | ------------------------------------------- |
| `FLAG_NEW_CATALOG_LAYOUT` | `new-catalog-layout` | A/B experiment — catalog grid vs row layout |
| `FLAG_AI_SUMMARIES`       | `ai-summaries`       | AI-generated track summary rollout          |

### Graceful fallback

`useFeatureFlag` returns `false` when PostHog has not resolved the flag (network delay, missing key, strict-mode re-mount). The safe default is always the existing behaviour — no feature is accidentally exposed.

### Flag design intent

Flags are **temporary experiments**, not permanent feature switches. Once an experiment concludes and a variant wins, the losing branch is deleted and the flag removed entirely.

---

## A/B Experiment: `new-catalog-layout`

### Hypothesis

> A scannable row layout reduces time-to-click by making track title, artist, and genre readable without hovering, increasing `track_selected` events per session.

### Variants

|                | Variant A (control)           | Variant B (treatment) |
| -------------- | ----------------------------- | --------------------- |
| **Component**  | `CatalogList` → `CatalogCard` | `CatalogGridVariantB` |
| **Layout**     | Square artwork grid           | Horizontal row list   |
| **Flag value** | `false` (default)             | `true`                |

## Consequences

- Zero runtime errors if PostHog is unavailable
- Flag renames require a change in exactly one file (`flags.ts`)
- Both experiment variants are fully functional — no dead code
