# 0043: Clean Orphans and Mixed Concerns

## Context

1.  **Dead/Orphan Code**: `features/catalog/hooks/useCatalogQuery.ts` was an unused file that completely overlapped with `features/catalog/hooks/useCatalog.ts`.
2.  **Improper Colocation**: `track-formatters.ts` provided generic time formatting functions but was located specifically within the `catalog` domain, meaning other features had to import utilities out of `catalog`.
3.  **Mixed Concerns in Types**: `features/catalog/types/catalog-types.ts` arbitrarily mixed TypeScript interfaces/types, a data mapper function (`mapItunesTrackToCatalogItem`), and static mock data (`MOCK_CATALOG_ITEMS`).

## Decision

1.  **Removed Orphans**: Deleted `useCatalogQuery.ts`.
2.  **Relocated Utilities**: Moved `track-formatters.ts` out of `features/catalog/utils/` and into `lib/utils/track-formatters.ts` because time-formatting is a global application concern. Path aliases were updated globally.
3.  **Separated Data from Types**: Extracted `MOCK_CATALOG_ITEMS` out of the types file and placed it in its own domain-specific utility file `features/catalog/utils/mock-data.ts`. Updated Storybook files and tests to point to this new location.

## Consequences

- **Cleaner Type Definitions**: Type files now contain only TypeScript type definitions and Zod schemas.
- **Reduced Bundle Confusion**: Storybook or testing files that import mock data no longer inadvertently import unrelated production mappers or types.
- **Logical Colocation**: Global utilities live in `/lib`, feature-specific utilities live in their respective `/features/.../utils`.
