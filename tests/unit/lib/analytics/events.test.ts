import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("posthog-js", () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
  },
}))

vi.mock("@/env.mjs", () => ({
  env: {
    NEXT_PUBLIC_POSTHOG_KEY: "phc_test_key",
    NEXT_PUBLIC_POSTHOG_HOST: "https://app.posthog.com",
  },
}))

import posthog from "posthog-js"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import {
  trackCatalogSearch,
  trackFavoriteAdded,
  trackFavoriteRemoved,
  trackThemeToggled,
  trackTrackSelected,
} from "@/lib/analytics/events"

const MOCK_TRACK: CatalogItemType = {
  id: 1,
  title: "Bohemian Rhapsody",
  artist: "Queen",
  genre: "Rock",
}

describe("analytics events", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("trackCatalogSearch", () => {
    it("captures catalog_search with sanitized term", () => {
      trackCatalogSearch("rock music")
      expect(posthog.capture).toHaveBeenCalledWith("catalog_search", { search_term: "rock music" })
    })

    it("redacts email addresses before capture", () => {
      trackCatalogSearch("find user@example.com")
      expect(posthog.capture).toHaveBeenCalledWith("catalog_search", {
        search_term: "find [email]",
      })
    })

    it("redacts phone numbers before capture", () => {
      trackCatalogSearch("call 555-867-5309")
      expect(posthog.capture).toHaveBeenCalledWith("catalog_search", {
        search_term: "call [phone]",
      })
    })
  })

  describe("trackTrackSelected", () => {
    it("captures track_selected with track metadata", () => {
      trackTrackSelected(MOCK_TRACK)
      expect(posthog.capture).toHaveBeenCalledWith("track_selected", {
        track_id: 1,
        title: "Bohemian Rhapsody",
        artist: "Queen",
        genre: "Rock",
      })
    })
  })

  describe("trackThemeToggled", () => {
    it.each(["light", "dark", "system"] as const)("captures theme_toggled for '%s'", (theme) => {
      trackThemeToggled(theme)
      expect(posthog.capture).toHaveBeenCalledWith("theme_toggled", { theme })
    })

    it("emits 'unknown' for invalid theme values", () => {
      // @ts-expect-error — intentionally testing runtime guard with an invalid value
      trackThemeToggled("invalid-theme")
      expect(posthog.capture).toHaveBeenCalledWith("theme_toggled", { theme: "unknown" })
    })
  })

  describe("trackFavoriteAdded", () => {
    it("captures favorite_added with track metadata", () => {
      trackFavoriteAdded(MOCK_TRACK)
      expect(posthog.capture).toHaveBeenCalledWith("favorite_added", {
        track_id: 1,
        title: "Bohemian Rhapsody",
        artist: "Queen",
      })
    })
  })

  describe("trackFavoriteRemoved", () => {
    it("captures favorite_removed with track metadata", () => {
      trackFavoriteRemoved(MOCK_TRACK)
      expect(posthog.capture).toHaveBeenCalledWith("favorite_removed", {
        track_id: 1,
        title: "Bohemian Rhapsody",
        artist: "Queen",
      })
    })
  })
})
