# 0044: Premium UI Design System Foundations

## Context

The previous design was functional but lacked a cohesive, modern, and premium aesthetic. As part of Phase 2 of the refactoring and redesign plan, the application requires a robust foundation that supports advanced text styling, ambient backgrounds, and glassmorphism. It was also determined that a permanent dark-mode orientation provides a richer media experience for a music catalog.

## Decision

We have updated `styles/tailwind.css` mapping Tailwind variables to a new color palette:

1.  **Permanent Dark Theme**: Set the default `--background` to a deep charcoal/navy (`oklch(0.12 0.01 250)`) with `--foreground` as pure white. The system now defaults to a rich dark ambient mode rather than needing explicit `.dark` class wrappers.
2.  **Electric Accent Palette**: Primary actions and focus rings now utilize a vibrant electric cyan/blue (`oklch(0.7 0.15 200)`) against the dark background for high contrast and modern "tech" appeal.
3.  **Glassmorphism Utilities**: Added new utility classes (`.glass`, `.glass-card`) directly to the base stylesheet. These leverage `backdrop-blur` and translucent background/border overrides to create frosted glass effects instantly across UI components.
4.  **Premium Typography**: Added `.text-gradient` and `.text-gradient-primary` classes to support elegant typographic headers. Configured `Outfit` for modern, geometric sans-serif body copy and `Playfair Display` for high-impact, premium serif headings.

## Consequences

- **Aesthetic Upgrade**: Developers can instantly apply `.glass-card` rather than repeating 5-6 tailwind utility classes for every container.
- **Forced Dark Mode**: Light mode styles are effectively replaced by this dominant dark palette. If light mode is later re-introduced, it will require adding explicit `.light` variant overrides.
- **Dependency on Next/Font**: The application relies on these specific fonts (`Outfit`, `Playfair Display`) being loaded via `next/font` in the root layout.
