# 0046: Catalog Redesign

## Context

Catalog required a cohesive aesthetic overhaul to match the new dark mode, glassmorphic layout system. We had two existing catalog grid variants (`CatalogList` and `CatalogGridVariantB`) and a `SearchInput` component that needed to be modernized.

## Decision

We redesigned the catalog components with the following changes:

1.  **Search Input Modernization**: Rebuilt `SearchInput.tsx` to use the new `.bg-background/40`, `.backdrop-blur-md`, and larger padding with rounded corners.
2.  **CatalogCard (Grid A)**: Transitioned from a standard box to a `.glass-card` styling. Moved the text information _below_ the artwork rather than overlaying it natively to allow the typography to shine on its own.
3.  **CatalogGridVariantB (List Row)**: Refined the list view to feel luxurious by introducing a gap between rows (rather than standard division lines) and utilizing `.glass-card`.
4.  **Hover States**: Implemented highly responsive hover micro-interactions, such as buttons sliding in on hover and images scaling slightly within their masks to provide an immersive browsing experience.
5.  **Typography**: Shifted primary headers and titles to `font-serif` to align with the branding guidelines.
6.  **Favorite Toggle button**: Resized and redesigned the heart toggle button in the `CatalogPage` to match the glassmorphic, rounded-2xl styles.

## Consequences

- **Visual Consistency**: The catalog now perfectly matches the premium look set by the Landing and Layout redesigns.
- **Usability**: The search input and catalog list rows feel significantly more responsive due to focus-within-ring animations and layout padding expansions.
- **Compatibility**: All Playwright E2E and Unit Tests remain green, confirming that the redesign successfully updated the aesthetic without removing critical interactive elements or attributes used for assertions.
