# ADR 0024: Cleanup of Orphan Files

## Context

During the initial project analysis for the ONB-3 refactoring phase, several orphan files and hacky patterns were identified. `lp-items.tsx` was found to be a large, unused file residing in the root directory, containing over 400 lines of inlined SVGs and static data that was no longer referenced by any part of the application.

## Decisions

### 1. Removal of `lp-items.tsx`

We decided to permanently remove `lp-items.tsx` to reduce codebase noise and prevent potential confusion for future developers.

**Rationale**:

- The file was not imported or used anywhere in the current implementation.
- It contained excessive "AI slop" in the form of massive inlined SVGs that bloated the repository without purpose.
- Removing it aligns with the goal of "zero tech debt" and maintaining a clean, maintainable directory structure.

## Consequences

- **Reduced Codebase Size**: Removing 400+ lines of unused code.
- **Cleaner Root Directory**: One less orphan file in the root.
- **No Regression**: Verified that all unit and E2E tests pass after removal.
