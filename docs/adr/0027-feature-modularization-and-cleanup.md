# ADR 0027: Feature Modularization and Code Quality (Phase 3)

## Context

The initial implementation of the Catalog feature, while functional, resulted in large components (e.g., `TrackDetailPage.tsx`) that combined multiple responsibilities like media playback, UI rendering, and state management. Furthermore, the codebase contained "AI slop"—overly verbose comments and redundant defensive checks that cluttered the logic.

## Decision

We decided to modularize the Catalog feature to follow the "Single Responsibility Principle" (SRP) and improve long-term maintainability.

### Key Changes:

- **Sub-component Extraction**: `TrackDetailPage.tsx` was broken down into focused sub-components:
  - `TrackDetailArtwork`: Handles high-res artwork and immersive blur background.
  - `TrackDetailInfo`: Displays track metadata and favorites toggle.
  - `TrackAudioPlayer`: Encapsulates audio state, progress, and controls.
  - `TrackDetailCompliance`: Manages iTunes branding and legal links.
- **Utility Extraction**: All formatting logic (durations, seconds) was moved to a shared `track-formatters.ts` utility file.
- **Code De-cluttering**: Removed redundant comments and simplified defensive logic to reflect a "clean code" standard.
- **Documentation**: Added JSDoc to all core hooks (`useCatalog`) and components to improve developer experience.

## Consequences

- **Improved Maintainability**: Changes to the audio player or artwork logic can now be made in isolation.
- **Enhanced Readability**: Components are smaller and their intent is clearer.
- **Better Testability**: Smaller components can be unit tested or storybooked more easily.
- **Cleaner API Surface**: Exposing only what is necessary (e.g., `debouncedSearchTerm` for layout sync) keeps the hooks lean.
