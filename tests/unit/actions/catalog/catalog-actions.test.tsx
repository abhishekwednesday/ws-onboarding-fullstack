import { describe, expect, it, vi } from "vitest"
import { itunesSearchAction } from "@/actions/catalog/catalog-actions"
import * as itunesApi from "@/lib/api/itunes"
import { type ItunesSearchResponseType } from "@/lib/api/schemas"

vi.mock("@/lib/api/itunes", () => ({
  searchItunes: vi.fn(),
}))

describe("itunesSearchAction server action", () => {
  it("should call searchItunes and return data on success", async () => {
    const mockResponse = {
      resultCount: 1,
      results: [{ trackId: 123, artistName: "Queen", trackName: "Bohemian Rhapsody" }],
    }
    vi.mocked(itunesApi.searchItunes).mockResolvedValueOnce(mockResponse as unknown as ItunesSearchResponseType)

    const result = await itunesSearchAction("Queen")
    expect(result).toEqual(mockResponse)
    expect(itunesApi.searchItunes).toHaveBeenCalledWith("Queen")
  })

  it("should throw a user-friendly error if the API call fails", async () => {
    vi.mocked(itunesApi.searchItunes).mockRejectedValueOnce(new Error("API Down"))

    await expect(itunesSearchAction("Queen")).rejects.toThrow("Failed to fetch data from ITunes API.")
  })
})
