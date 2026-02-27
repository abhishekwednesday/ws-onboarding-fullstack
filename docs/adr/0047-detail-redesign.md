# 0047: Track Detail Redesign with ElevenLabs UI

## Context

The `TrackDetailPage` needed a significant aesthetic overhaul to feel like a modern, standalone, immersive audio player rather than a simple data table. The user provided feedback that the initial layout could be "more better" and suggested integrating the `@elevenlabs/ui` component for the audio player.

## Decision

We redesigned the track detail components with the following changes:

1.  **ElevenLabs UI Integration**: Installed `@elevenlabs/ui` and `@elevenlabs/cli` to inject the `AudioPlayer` component. We abstracted the core HTML5 `<audio>` player element from `TrackAudioPlayer` and replaced it with a premium, fully-featured ElevenLabs provider (`AudioPlayerProvider`).
2.  **Unconstrained Player Layout**: Instead of locking the player into a small dark pill, we expanded it to full width under the track info. We increased the size of the play button significantly (`h-20 w-20`), added beautiful drop-shadows, and implemented a glow layer that toggles opacity based on the `isPlaying` state. We stretched the `AudioPlayerProgress` bar horizontally to give the user precise control scrub access.
3.  **Immersive Artwork**: Reduced the maximum width of the artwork to `max-w-[400px]` to stop it from dominating vertical real estate. We increased border rounding to `rounded-2xl`, added a stark `shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]` shadow, and softened the background `blur` layer so the page feels atmospheric without washing out the foreground text.
4.  **Premium Typography**: Centralized the text alignment in `TrackDetailInfo`. We upgraded the track title to `font-serif text-4xl sm:text-5xl` for maximum impact and restyled the AI summary banner into a sleek glass pill badge (`✨ AI Summary Coming Soon`).

## Consequences

- **Visual Excellence**: The track detail page now feels like a premium iOS/Spotify-tier experience rather than a generic CRUD detail view.
- **Maintainability**: Offloading audio-state management to the ElevenLabs provider context simplifies our components while providing a more robust progress bar mechanism.
- **Compatibility**: All core Playwright E2E and Unit Tests remained green, ensuring basic functionality asserting was not broken by the aesthetic overhaul.
