# ADR 0004: Setup Next Themes

## Context

The project requires a consistent and user-friendly way to manage Light, Dark, and System themes. The requirements include persistence of user preference, a flicker-free loading experience, and a clean toggle UX.

## Decision

We decided to:

1. Integrate **next-themes** for theme management.
2. Use the **class-based strategy** for Tailwind CSS.
3. Wrap the root layout with a custom **ThemeProvider** component.
4. Add **suppressHydrationWarning** to the `<html>` tag to prevent hydration mismatches.
5. Implement a theme toggle using shadcn components.

## Rationale

- **Next-themes**: Handles theme persistence (localStorage) and prevents the flash of unstyled content (FOUC) by injecting the theme script before the app renders.
- **Tailwind CSS v4 Strategy**: Class-based theme switching is highly performant and flexible.
- **Clean Toggle UX**: Using shadcn's `DropdownMenu` provides a familiar and accessible interface for theme selection.
- **Hydration Warning**: The `suppressHydrationWarning` attribute is necessary because the theme script modifies the HTML tag before hydration, which would otherwise cause React to warn about a mismatch.

## Consequences

- The application now supports Light, Dark, and System themes.
- User theme preferences are persisted across sessions.
- Theme switching is reactive and applies immediately without page reload.
