# 0048: Auth Redesign

## Context

The authentication pages (`LoginForm` and `RegisterForm`) needed to be brought up to the same aesthetic level as the rest of the application. The existing components utilized standard shadcn `Card` patterns that felt stark and disjointed from the premium, dark-themed, glassmorphic layout established in earlier redesigns.

## Decision

We applied the following visual and structural changes to the Auth flows:

1.  **Premium Glassmorphic Containers**: Replaced standard `@/components/ui/card` styling with our established `.glass-card` design token (`bg-background/40`, `border-border/40`, `backdrop-blur-2xl`).
2.  **Immersive Backgrounds (React Bits)**: Integrated the `Aurora` background component from React Bits (`@react-bits/Aurora-TS-TW`). We deployed the WebGL shader as a low-opacity (`30-40%`) background layer with a tweaked Teal-Blue-Violet color scheme (`["#2DD4BF", "#3B82F6", "#8B5CF6"]`), blending perfectly with the dark theme.
3.  **Breathtaking Inputs & Controls**: Increased the height of text inputs to `h-14` for a more spacious, tactile target area. Updated input backgrounds to be semi-transparent with a subtle `focus-visible:ring-primary/50` transition. Center-aligned the icons gracefully within the padded inputs.
4.  **Luxurious Typography**: Shifted header titles to `font-serif` and increased sizing (`text-3xl sm:text-4xl`) while heavily utilizing `tracking-tight` and `text-foreground`.
5.  **Interactive Buttons**: Upgraded primary submission buttons to match the larger `h-14` layout. Incorporated a hover scale transformation (`hover:scale-[1.02]`) and drop-shadow (`hover:shadow-primary/25`) to reinforce interaction confidence.

## Consequences

- **Consistent Aesthetics**: The sign-in and registration pages now reflect the same premium quality seen across the Catalog and Landing pages.
- **Enhanced Usability**: Larger touch targets on inputs and buttons reduce friction for mobile users and improve accessibility.
- **Automated Validation**: All E2E routing asserts (`auth-middleware.spec.ts`) and Vitest suites continue to pass seamlessly, proving that altering the structural HTML classes did not disrupt the React form states or server actions.
