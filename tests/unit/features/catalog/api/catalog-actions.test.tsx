import { describe, expect, it, vi } from "vitest"
import { itunesSearchAction } from "@/features/catalog/api/catalog-actions"
import * as itunesApi from "@/lib/api/itunes"
import { type ItunesSearchResponseType } from "@/lib/api/schemas"

vi.mock("@/lib/api/itunes", () => ({
  searchItunes: vi.fn(),
  ITUNES_PAGE_SIZE: 50,
}))

describe("itunesSearchAction server action", () => {
  it("should call searchItunes and return mapped data on success", async () => {
    const mockResponse = {
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
    vi.mocked(itunesApi.searchItunes).mockResolvedValueOnce(mockResponse as unknown as ItunesSearchResponseType)

    const result = await itunesSearchAction("Queen")
    expect(result.items.length).toBe(1)
    expect(result.items[0]!.id).toBe(123)
    expect(result.nextOffset).toBe(null)
    expect(result.totalCount).toBe(1)
    expect(itunesApi.searchItunes).toHaveBeenCalledWith("Queen", 0)
  })

  it("should return correct nextOffset for a full page", async () => {
    const mockFullPage = {
      resultCount: 100,
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
    vi.mocked(itunesApi.searchItunes).mockResolvedValueOnce(mockFullPage as unknown as ItunesSearchResponseType)

    const result = await itunesSearchAction("test", 0)
    expect(result.items.length).toBe(50)
    expect(result.nextOffset).toBe(50)
  })

  it("should throw a user-friendly error if the API call fails", async () => {
    vi.mocked(itunesApi.searchItunes).mockRejectedValueOnce(new Error("API Down"))

    await expect(itunesSearchAction("Queen")).rejects.toThrow("Failed to fetch data from ITunes API.")
  })
})
