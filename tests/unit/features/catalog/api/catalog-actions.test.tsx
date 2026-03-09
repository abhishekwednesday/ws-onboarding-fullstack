import { describe, expect, it, vi } from "vitest"
import {
  itunesAlbumLookupAction,
  itunesArtistLookupAction,
  itunesLookupAction,
  itunesSearchAction,
} from "@/features/catalog/api/catalog-actions"
import * as itunesApi from "@/lib/api/itunes"
import { type ItunesSearchResponseType } from "@/lib/api/schemas"

vi.mock("@/lib/api/itunes", () => ({
  searchItunes: vi.fn(),
  lookupItunes: vi.fn(),
  lookupItunesTrack: vi.fn(),
  ITUNES_PAGE_SIZE: 50,
}))

describe("itunesSearchAction server action", () => {
  it("should call searchItunes and return mapped data on success", async () => {
    const mockResponse: ItunesSearchResponseType = {
      resultCount: 1,
      results: [
        {
          trackId: 123,
          artistName: "Queen",
          trackName: "Bohemian Rhapsody",
          collectionName: "A Night at the Opera",
          artworkUrl100: "http://example.com/art.jpg",
          previewUrl: "http://example.com/preview.mp3",
          primaryGenreName: "Rock",
          trackTimeMillis: 300000,
          trackViewUrl: "http://example.com/view",
        },
      ],
    }
    vi.mocked(itunesApi.searchItunes).mockResolvedValueOnce(mockResponse)

    const result = await itunesSearchAction("Queen")
    expect(result.items.length).toBe(1)
    expect(result.items[0]!.id).toBe(123)
    expect(result.nextOffset).toBe(null)
    expect(result.totalCount).toBe(1)
    expect(itunesApi.searchItunes).toHaveBeenCalledWith("Queen", {})
  })

  it("should return correct nextOffset for a full page", async () => {
    const mockFullPage: ItunesSearchResponseType = {
      resultCount: 50,
      results: Array.from({ length: 50 }).map((_, i) => ({
        trackId: i,
        artistName: "Artist",
        trackName: `Song ${i}`,
        collectionName: "Album",
        artworkUrl100: "",
        previewUrl: "",
        primaryGenreName: "Genre",
        trackTimeMillis: 0,
        trackViewUrl: "",
      })),
    }
    vi.mocked(itunesApi.searchItunes).mockResolvedValueOnce(mockFullPage)

    const result = await itunesSearchAction("test", { offset: 0 })
    expect(result.items.length).toBe(50)
    expect(result.nextOffset).toBe(50)
    expect(itunesApi.searchItunes).toHaveBeenCalledWith("test", { offset: 0 })
  })

  it("should handle non-zero offsets correctly", async () => {
    const mockPage2: ItunesSearchResponseType = {
      resultCount: 50,
      results: Array.from({ length: 50 }).map((_, i) => ({
        trackId: i + 50,
        artistName: "Artist",
        trackName: `Song ${i + 50}`,
        collectionName: "Album",
        artworkUrl100: "",
        previewUrl: "",
        primaryGenreName: "Genre",
        trackTimeMillis: 0,
        trackViewUrl: "",
      })),
    }
    vi.mocked(itunesApi.searchItunes).mockResolvedValueOnce(mockPage2)

    const result = await itunesSearchAction("test", { offset: 50 })
    expect(result.items.length).toBe(50)
    expect(result.nextOffset).toBe(100)
    expect(itunesApi.searchItunes).toHaveBeenCalledWith("test", { offset: 50 })
  })

  it("should throw a user-friendly error if the API call fails", async () => {
    vi.mocked(itunesApi.searchItunes).mockRejectedValueOnce(new Error("API Down"))

    await expect(itunesSearchAction("Queen")).rejects.toThrow("Failed to fetch data from ITunes API.")
  })

  describe("itunesAlbumLookupAction", () => {
    it("should return album and tracks on success", async () => {
      const mockResponse: ItunesSearchResponseType = {
        resultCount: 2,
        results: [
          {
            wrapperType: "collection",
            collectionId: 456,
            artistName: "Queen",
            collectionName: "A Night at the Opera",
            artworkUrl100: "http://example.com/art.jpg",
          },
          {
            wrapperType: "track",
            trackId: 123,
            artistName: "Queen",
            trackName: "Bohemian Rhapsody",
            collectionId: 456,
            trackTimeMillis: 300000,
          },
        ],
      }
      vi.mocked(itunesApi.lookupItunes).mockResolvedValueOnce(mockResponse)

      const result = await itunesAlbumLookupAction(456)
      expect(result.album.id).toBe(456)
      expect(result.items.length).toBe(1)
      expect(result.items[0]!.id).toBe(123)
      expect(itunesApi.lookupItunes).toHaveBeenCalledWith([456], "song")
    })

    it("should throw error if album not found", async () => {
      vi.mocked(itunesApi.lookupItunes).mockResolvedValueOnce({
        resultCount: 0,
        results: [],
      })

      await expect(itunesAlbumLookupAction(999)).rejects.toThrow("Album with id 999 not found")
    })

    it("should throw user-friendly error if API rejects", async () => {
      vi.mocked(itunesApi.lookupItunes).mockRejectedValueOnce(new Error("Network Error"))

      await expect(itunesAlbumLookupAction(456)).rejects.toThrow("Failed to load album details. Please try again.")
    })
  })

  describe("itunesArtistLookupAction", () => {
    it("should return artist and albums on success", async () => {
      const mockResponse: ItunesSearchResponseType = {
        resultCount: 2,
        results: [
          {
            wrapperType: "artist",
            artistId: 789,
            artistName: "Queen",
            primaryGenreName: "Rock",
          },
          {
            wrapperType: "collection",
            collectionId: 456,
            artistName: "Queen",
            collectionName: "A Night at the Opera",
            artistId: 789,
          },
        ],
      }
      vi.mocked(itunesApi.lookupItunes).mockResolvedValueOnce(mockResponse)

      const result = await itunesArtistLookupAction(789)
      expect(result.artist.id).toBe(789)
      expect(result.albums.length).toBe(1)
      expect(result.albums[0]!.id).toBe(456)
      expect(itunesApi.lookupItunes).toHaveBeenCalledWith([789], "album")
    })

    it("should throw error if artist not found", async () => {
      vi.mocked(itunesApi.lookupItunes).mockResolvedValueOnce({
        resultCount: 0,
        results: [],
      })

      await expect(itunesArtistLookupAction(999)).rejects.toThrow("Artist with id 999 not found")
    })

    it("should throw user-friendly error if API rejects", async () => {
      vi.mocked(itunesApi.lookupItunes).mockRejectedValueOnce(new Error("Network Error"))

      await expect(itunesArtistLookupAction(789)).rejects.toThrow("Failed to load artist details. Please try again.")
    })
  })

  describe("itunesLookupAction", () => {
    it("should return empty results for empty ids", async () => {
      const result = await itunesLookupAction([])
      expect(result.resultCount).toBe(0)
      expect(result.results.length).toBe(0)
    })

    it("should call lookupItunes and return data on success", async () => {
      const mockResponse: ItunesSearchResponseType = {
        resultCount: 1,
        results: [{ trackId: 123, artistName: "Test Artist", trackName: "Test Track" }],
      }
      vi.mocked(itunesApi.lookupItunes).mockResolvedValueOnce(mockResponse)

      const result = await itunesLookupAction([123])
      expect(result.resultCount).toBe(1)
      expect(itunesApi.lookupItunes).toHaveBeenCalledWith([123])
    })

    it("should throw error on API failure", async () => {
      vi.mocked(itunesApi.lookupItunes).mockRejectedValueOnce(new Error("API Error"))
      await expect(itunesLookupAction([123])).rejects.toThrow("Failed to lookup tracks from ITunes API.")
    })
  })
})
