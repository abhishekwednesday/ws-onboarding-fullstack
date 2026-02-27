# 50. Recommendations API Architecture

Date: 2026-02-27

## Context

The application needed a "Recommended Tracks" feature to showcase new, relevant music to users based on their listening preferences. A major constraint is that the upstream music data source (the iTunes API) does not have a native "recommendation" or "discover weekly" endpoint. We needed a way to generate dynamic, user-specific recommendations using only the existing search and lookup endpoints.

Additionally, to ensure a fresh user experience, we needed to ensure that recommended tracks were not songs the user had already liked or recently added to a playlist.

## Decision

We decided to implement a custom aggregation and filtering engine on the backend using a new Next.js Server Action (`getRecommendedTracksAction`).

The flow operates as follows:

1. **Fetch User Context:** Retrieve the user's "Liked Songs" and tracks recently added to custom playlists.
2. **Aggregate Preferences:** Extract `artistName` and `primaryGenreName` from the liked songs, weighing artists heavier than genres, to build a map of the user's top musical terms.
3. **Select Search Seeds:** Randomly select three terms from the user's top ten most frequent terms. This ensures recommendations are relevant but also varied across different sessions. If a user has no listening history, fallback terms (e.g., "pop", "rock") are used.
4. **Fetch External Data:** Query the `itunesSearchAction` function using the selected seeds.
5. **Filter and Deduplicate:** Iterate through the iTunes results and filter out any tracks whose IDs are already present in the user's "Liked Songs" or recent playlists.
6. **Shuffle and Return:** Randomly shuffle the remaining tracks and return a subset (15 tracks) to the client.

## Consequences

### Positive

- **No Additional External API Dependencies:** We provide a recommendation experience without needing a 3rd-party recommendation engine (like Spotify's API).
- **Data Privacy:** All aggregation logic happens on the server. The client simply receives a list of recommended tracks.
- **Freshness:** Randomly selecting seeds from the top 10 choices ensures the recommendations change, preventing the UI from becoming stale.
- **High Reusability:** The `getRecommendedTracksAction` is entirely modular and can be consumed by any client-side hook or component.

### Negative

- **Performance:** Generating recommendations requires an initial database query to fetch the user's history, followed by up to 3 separate REST calls to the iTunes Search API. While executed concurrently where possible, this is slower than a single native recommendation endpoint.
- **Relevance Limitations:** Relying on simple keyword searches (artist names and genres) against the iTunes API is not as mathematically robust as collaborative filtering or machine-learning-based audio analysis. There may be occasional irrelevant results.
