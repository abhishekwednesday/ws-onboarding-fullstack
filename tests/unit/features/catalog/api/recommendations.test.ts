import { beforeEach, describe, expect, it, vi } from "vitest"

import * as catalogActions from "@/features/catalog/api/catalog-actions"
import { _clearRecommendationCache } from "@/features/catalog/api/recommendation-cache"
import { getRecommendedTracksAction } from "@/features/catalog/api/recommendations"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import * as playlistSync from "@/features/playlist/api/playlist-sync"
import * as playlistUtils from "@/features/playlist/api/playlist-utils"

// Mock the dependencies
vi.mock("@/features/catalog/api/catalog-actions")
vi.mock("@/features/playlist/api/playlist-sync")
vi.mock("@/features/playlist/api/playlist-utils")
vi.mock("@/lib/db/pool")
vi.mock("@/lib/auth/auth")
vi.mock("@/env.mjs", () => ({ env: {} }))

describe("getRecommendedTracksAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    _clearRecommendationCache()
  })

  it("should return unauthorized if user is not authenticated", async () => {
    vi.mocked(playlistUtils.getAuthenticatedUserId).mockResolvedValue(null)
    const result = await getRecommendedTracksAction()
    expect(result).toEqual({ success: false, error: "Unauthorized" })
  })

  it("should fetch recommendations based on liked songs and playlists, filtering out existing tracks", async () => {
    vi.mocked(playlistUtils.getAuthenticatedUserId).mockResolvedValue("test-user-id")

    // Mock liked songs with genres and artists
    vi.mocked(playlistSync.getLikedSongsAction).mockResolvedValue({
      success: true,
      data: [
        { id: 101, title: "L1", artist: "Artist A", genre: "Pop" } as unknown as CatalogItemType,
        { id: 102, title: "L2", artist: "Artist B", genre: "Rock" } as unknown as CatalogItemType,
      ],
    })

    // Mock playlist tracks DB query
    const mockClient = {
      query: vi.fn().mockResolvedValue({ rows: [{ trackId: 201 }] }),
    }
    vi.mocked(playlistUtils.withAuthenticatedClient).mockImplementation(async (userId, cb) => {
      // @ts-expect-error Types for mock db client
      return cb(mockClient)
    })

    // Mock iTunes search results
    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValue({
      items: [
        { id: 301, title: "R1", artist: "Artist A", genre: "Pop" } as unknown as CatalogItemType, // New recommendation
        { id: 101, title: "L1", artist: "Artist A", genre: "Pop" } as unknown as CatalogItemType, // Already liked, should be filtered
        { id: 201, title: "P1", artist: "Artist C", genre: "Rock" } as unknown as CatalogItemType, // Already in playlist, should be filtered
      ],
      nextOffset: null,
      totalCount: 3,
    })

    const result = await getRecommendedTracksAction()

    // Verify successful action
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe(301)
      expect(result.data.find((t) => t.id === 101)).toBeUndefined()
      expect(result.data.find((t) => t.id === 201)).toBeUndefined()

      // iTunes should be called (at least once for the top terms)
      expect(catalogActions.itunesSearchAction).toHaveBeenCalled()

      // DB query should be executed for playlist tracks
      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('JOIN "playlist_track"'), ["test-user-id"])
    }
  })

  it("should use fallback terms when no liked songs or playlists exist", async () => {
    vi.mocked(playlistUtils.getAuthenticatedUserId).mockResolvedValue("test-user-id")

    // Empty liked songs
    vi.mocked(playlistSync.getLikedSongsAction).mockResolvedValue({
      success: true,
      data: [],
    })

    // Empty playlist tracks
    const mockClient = {
      query: vi.fn().mockResolvedValue({ rows: [] }),
    }
    vi.mocked(playlistUtils.withAuthenticatedClient).mockImplementation(async (userId, cb) => {
      // @ts-expect-error Types for mock db client
      return cb(mockClient)
    })

    // Return dummy items from search
    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValue({
      items: [{ id: 401, title: "F1", artist: "Fallback Artist" } as unknown as CatalogItemType],
      nextOffset: null,
      totalCount: 1,
    })

    const result = await getRecommendedTracksAction()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.length).toBeGreaterThan(0)
      // Check that itunesSearchAction was called with one of the fallback terms
      expect(catalogActions.itunesSearchAction).toHaveBeenCalled()
      const searchCall = vi.mocked(catalogActions.itunesSearchAction).mock.calls[0]?.[0] as string
      expect(["pop", "rock"].includes(searchCall)).toBe(true)
    }
  })
})
