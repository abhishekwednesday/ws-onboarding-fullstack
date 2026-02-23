# ADR 0005: Setup Layout Components for Music Service

## Context

The project is evolving into a Music Service ("MusicStream"). A consistent layout is required to provide a unified user experience across different pages (Home, Catalog, etc.).

## Decision

We decided to:

1. Implement a **Navbar** and **Footer** with Music Service branding.
2. Create a **BasePage** component as a structural wrapper that encapsulates the Navbar, Footer, and main content area.
3. Integrate **BasePage** into the root layout to ensure consistency across the entire application.

## Rationale

- **BasePage Pattern**: Promotes reusability and keeps the root layout clean. It allows us to easily add layout-specific logic or providers in one place if needed in the future.
- **Brand Consistency**: Centralizing layout components ensures that the "MusicStream" branding and navigation are consistent everywhere.
- **Flexibility**: The `BasePage` uses a flexbox column layout with `min-h-screen`, ensuring the footer always stays at the bottom of the page regardless of content length.

## Consequences

- All pages will automatically have the Navbar and Footer.
- The `main` content area is wrapped in a dedicated container within `BasePage`.
- Future layout changes (e.g., adding a sidebar) can be implemented centrally in `BasePage`.
