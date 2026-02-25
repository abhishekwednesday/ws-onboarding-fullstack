# ADR 0025: Naming Standards and Directory Cleanup

## Context

To improve codebase consistency and maintainability as part of the ONB-3 refactoring, we needed to establish clear naming conventions for directories, files, variables, and event handlers. Additionally, redundant legacy components were identified for removal.

## Decisions

### 1. Directory and File Naming Conventions

We adopted the following standards:

- **Directories**: Always use **kebab-case** (e.g., `components/layout`, `features/catalog`).
- **Component Files**: Use **PascalCase** (e.g., `CatalogCard.tsx`, `Navbar.tsx`).
- **Hook Files**: Use **camelCase** (e.g., `useCatalog.ts`).
- **Regular utility/action/type files**: Use **kebab-case** (e.g., `catalog-types.ts`, `catalog-actions.ts`).

### 2. Variable and Event Handler Naming

- **Boolean State Variables**: Must be prefixed with **is**, **has**, or **should** (e.g., `shouldShowFavoritesOnly`, `isLoading`, `hasMore`).
- **Event Handler Functions**: Must be prefixed with **handle** (e.g., `handleToggleFavorites`, `handleInputChange`).

### 3. Type Standardization

- All custom types and interfaces must be suffixed with **Type** (e.g., `CatalogItemType`, `FavoritesStateType`) and organized into feature-specific `types/` directories.

### 4. Removal of Legacy Components

Deleted `components/Button` and `components/Tooltip` as they were unused legacy components, superseded by Shadcn UI equivalents in `components/ui`.

## Consequences

- **Atomic Refactoring**: Renaming types required simultaneous updates to all dependent components and hooks to maintain a valid build.
- **Improved Scannability**: Standardized prefixes make the intent of variables and functions immediately clear.
- **Cleaner Architecture**: Reduced codebase noise by removing orphan directories and centralizing types.
