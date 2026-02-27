# 0045: Layout Redesign

## Context

As part of Phase 2 (UI Redesign), the core navigational components (`Navbar.tsx`, `Footer.tsx`, and the shell `BasePage.tsx`) needed to be completely overhauled to support the new dark, premium, glassmorphic aesthetic developed in the design system initialization.

Previously, `Navbar.tsx` duplicated its navigation links completely across the DOM for mobile and desktop views. The design lacked structural hierarchy and did not utilize the new typography tokens.

## Decision

We redesigned the layout wrappers with the following implementations:

1.  **Glassmorphic Navigation**: Switched `Navbar.tsx` to utilize `backdrop-blur-2xl` and semi-transparent backgrounds with subtle borders to give the illusion of a floating, frosted glass header.
2.  **DRY Mobile/Desktop Routing**: Condensed the routing logic into a single array (`links`) mapped iteratively in the desktop and mobile menus, eliminating DOM string duplication while conditionally injecting protected routes (like Playlists) for authenticated users.
3.  **Refined Typography Constraints**: Injected `.font-serif` (`Playfair Display`) into the logo brand marks to elevate the aesthetic.
4.  **Immersive Footer**: Added a subtle fading primary gradient to the bottom of the viewport behind the `Footer.tsx` and tightened tracking/casing on copyright lines for a minimal, cinematic close to the page.
5.  **BasePage Padding adjustments**: Shifted the flex layout constraints to ensure content always remains highly visible without crunching against the sticky `glass` Navbar.

## Consequences

- **Maintainability**: Adding new top-level routes is now as simple as adding an object to the `links` array.
- **Performance**: Reducing DOM size slightly assists with React hydration speed.
- **Visual Consistency**: Every interior page wrapped by `BasePage` will now automatically inherit the framing of the new Navigation and Footer, making the implementation of downstream views easier.
