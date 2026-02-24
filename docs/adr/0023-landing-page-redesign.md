# ADR 0023: Landing Page and Navigation Redesign

## Context

The initial landing page felt basic and didn't provide an "immersive" first impression. The navigation components (Navbar and Footer) also needed a refresh to match a more modern, minimal aesthetic. Specific goals included:

1. Creating a full-viewport hero section.
2. Using the `HeroGrainient` background in a more intentional way.
3. Implementing a functional and modern mobile navigation menu.
4. Standardizing code patterns like import ordering.

## Decisions

### 1. Immersive Hero Section — Full Viewport and Smooth Transitions

We redesigned the hero in `app/page.tsx` to fill the entire viewport (`min-h-[100svh]`).

- **Background**: The `HeroGrainient` is the primary visual anchor.
- **Transition**: To avoid a "hard" or "weird" transition to the content below, we used a smoother, longer transparent gradient fade (`line-gradient to bottom`).
- **Pacing**: Increased spacing and used a larger, bolder headline for better visual hierarchy.

**Rationale**: A full-viewport hero creates a much more premium feel and allows the animated background to set the tone for the entire app.

### 2. Navigation Refresh — Minimal and Functional

Both the `Navbar` and `Footer` were redesigned for minimalism.

- **Navbar**: Shifted to a floating-link style with glassmorphism (`backdrop-blur-xl`).
- **Mobile Navbar Refinement**: Implemented a high-end full-screen overlay with deep backdrop blur (`backdrop-blur-2xl`). Used bold, high-contrast typography and a structured layout with dedicated sections for navigation and appearance settings. Added animated active state indicators.
- **Footer**: Simplified to a single row (on desktop) with refined typography and reduced visual noise.

**Rationale**: Navigation should be functional but not distracting. Glassmorphism maintains the immersive feel by allowing the background colors to peek through.

### 3. Import Order Standardization

Applied a strict import ordering across the modified files:

1. **Node Internals** (if any)
2. **Third-party Imports** (React, Next.js, Lucide, etc.)
3. **Local Files** (@/components, etc.)

**Rationale**: Uniform import order improves code scanability and reduces merge conflicts.

### 4. Interactive UX — CTA and Animations

- **CTA**: Changed to a single primary "Browse the catalog" button with explicit `cursor-pointer` and scale animations on hover/active.
- **Scroll Hint**: Added an animated bouncing chevron at the bottom of the hero to nudge users to explore the features below.

**Rationale**: Clearer call-to-action and subtle micro-animations make the page feel "alive" and responsive to user interaction.

## Consequences

- **Improved Branding**: The site feels more premium and intentional.
- **Better Mobile UX**: The new mobile menu provides a much better navigation experience on small screens.
- **Code Consistency**: Standardized import order and component patterns.
