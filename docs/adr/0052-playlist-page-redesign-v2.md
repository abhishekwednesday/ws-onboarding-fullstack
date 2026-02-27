# 0052: Playlist Page Redesign v2

Date: 2026-02-27

## Context

After the initial playlist UI redesign (ADR-0049) and the introduction of the RecommendationCarousel (ADR-0050/0051), the playlists page suffered from several UX issues:

1. **Playlist cards** used large gradient placeholder banners with small icons, wasting vertical space and pushing actual content below the fold.
2. **Redundant headings** — the page title "Your Playlists" plus a section header "Your Collection" created visual noise without adding information.
3. **Recommendation carousel** displayed a visible horizontal scrollbar that looked rough, especially on Windows/Linux where scrollbars are more prominent.
4. The overall page felt over-decorated with ambient glows, oversized serif headings, and competing visual hierarchies.

Additionally, a `"use server"` file (`features/catalog/api/recommendations.ts`) was exporting a non-async constant (`FALLBACK_TERMS`), which violated Next.js's server action constraints and caused a runtime error.

## Decision

### Server action fix

Removed the `export` keyword from `FALLBACK_TERMS` in `recommendations.ts` so the `"use server"` file only exports async functions, as required by Next.js. Updated the unit test to inline the expected values instead of importing the constant.

### Page layout (`playlists/page.tsx`)

Stripped the page back to a clean vertical flow:

- Single-line header with title ("Playlists") and "Create Playlist" button inline.
- Removed the ambient glow blob, subtitle, and the redundant "Your Collection" section header.
- Reduced section gaps for a tighter, more cohesive layout.

### Recommendation carousel (`RecommendationCarousel.tsx`)

- Replaced the visible scrollbar with a `no-scrollbar` CSS utility (hides scrollbar across all browsers while preserving touch/mouse scroll).
- Added symmetrical left and right fade-edge gradients to hint at scrollable overflow.
- Downgraded the section heading from a large serif `h2` to a small uppercase label so it doesn't compete with the page title.

### Playlist cards (`PlaylistGrid.tsx`)

Redesigned as text-forward cards instead of artwork-placeholder cards:

- Compact icon tile (Heart for Liked Songs, ListMusic for custom) with title and description beside it.
- Track count and last-updated date shown in a metadata row at the bottom.
- 3-column grid layout instead of 4, giving each card more readable width.
- No more empty gradient banners.

### Global CSS (`styles/tailwind.css`)

Added `no-scrollbar` utility class to hide scrollbars while preserving scroll functionality.

## Consequences

### Positive

- **Content density**: Playlist cards are significantly more compact, letting users see their full collection without scrolling past decorative filler.
- **Visual hierarchy**: A single page title with a quiet section label for recommendations creates a clear reading order.
- **Cross-platform polish**: Hidden scrollbar removes the jarring native scrollbar rendering differences across OS/browser combinations.
- **Server stability**: The `"use server"` export fix resolves the runtime crash on the recommendations endpoint.

### Negative

- **Hidden scrollbar**: Some users may not realize the recommendation row is scrollable without the visible scrollbar. The fade edges partially mitigate this, but it may still reduce discoverability on non-touch devices.
- **Reduced visual flair**: The playlist cards are now utilitarian compared to the glassmorphic cards elsewhere (catalog, landing). This is a deliberate density tradeoff but may feel less premium.
