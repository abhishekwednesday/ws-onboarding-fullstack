# 0049: Playlist UI Redesign

## Context

As part of `ONB-5` (Aesthetic and UI Polish), the Playlists interface—including `PlaylistsPage`, `PlaylistGrid`, and `PlaylistDetailPage`—required a design overhaul. The previous interface utilized generic borders, basic background colors, and unrefined typography, which contrasted sharply with our new premium glassmorphic system established in the Catalog and Auth flows.

Our goal was to apply consistent design tokens and high-fidelity visuals across the entire playlist management experience.

## Decision

We applied the following visual and structural changes to the Playlists feature:

1.  **Immersive Headers**: Upgraded header typography across `PlaylistsPage` and `PlaylistDetailPage` to use `font-serif`, larger scaling (`text-4xl` up to `text-7xl`), and tighter letter spacing (`tracking-tight`).
2.  **Ambient Glo**: Introduced a subtle `.blur-[120px]` radial gradient behind the `PlaylistsPage` header to create contextual depth.
3.  **Premium Grid Cards** (`PlaylistGrid`): Replaced blocky standard cards with `.glass-card`. Increased hover shadow elevation, refined border colors, and softened the inner artwork placeholder gradients for a polished feel.
4.  **Glassmorphic Track List** (`PlaylistDetailPage`): Encased the track listing in a unified `.glass-card` container with heavy blur effects. Replaced row borders with a subtle line separator (`border-border/10`) and implemented an elegant `.hover:bg-white/5` row highlighting effect.
5.  **Elevated Controls**: Upgraded the Play All and Add Track buttons to use substantial sizing (`h-16`), refined paddings, and satisfying `.hover:scale-[1.02]` interactions.

## Consequences

- **Consistency**: The playlists section now perfectly aligns with the premium visual aesthetics established in the catalog and landing pages.
- **Interaction Fidelity**: Increased padding and hover states dramatically improve hit areas and perceived responsiveness for users interacting with lists and grids.
- **Maintainability**: Centralized `.glass-card` adoption prevents duplicate bespoke CSS and simplifies future theme adjustments.
