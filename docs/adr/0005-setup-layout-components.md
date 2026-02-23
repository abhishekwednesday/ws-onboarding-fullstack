# ADR 0005: Setup Layout Components for Music Service

## Status

Accepted

## Context

The project is evolving into a Music Service ("MusicStream"). A consistent, premium layout is required to provide a unified user experience across different pages. We need a flexible centering strategy that isn't strictly tied to Tailwind's default `container` class to allow for more granular control over padding and widths.

## Decision

We decided to:

1. Implement a **Navbar** and **Footer** with MusicStream branding.
2. Create a **BasePage** component as a structural wrapper that encapsulates the Navbar, Footer, and main content area.
3. Replace the utility-based `container` class with a custom centering strategy using `mx-auto max-w-7xl` and consistent horizontal padding (`px-4 sm:px-6 lg:px-8`) within the layout components.
4. Integrate **BasePage** into the root layout to ensure consistency across the entire application.

## Rationale

- **BasePage Pattern**: Promotes reusability and keeps the root layout clean. It allows us to easily add layout-specific logic or providers in one place if needed in the future.
- **Custom Centering vs. Container**: Removing the `container` class avoids the constraints of a fixed-breakpoint grid and allows us to apply global padding consistently across the shell (Navbar/Footer) and the main content, ensuring perfect horizontal alignment.
- **Brand Consistency**: Centralizing layout components ensures that the "MusicStream" branding and navigation are consistent everywhere.
- **Flexibility**: The `BasePage` uses a flexbox column layout with `min-h-screen`, ensuring the footer always stays at the bottom of the page regardless of content length.

## Consequences

- All pages will automatically have the Navbar and Footer.
- The `main` content area is wrapped in a dedicated max-width container within `BasePage`.
- Future layout changes (e.g., adding a sidebar) can be implemented centrally in `BasePage`.
- Styling is more predictable as the centering and padding are handled at the layout level.
