import { beforeEach, describe, expect, it, vi } from "vitest"
import { searchItunes } from "@/lib/api/itunes"

describe("searchItunes API client", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })

  it("should return empty results if term is empty", async () => {
    const result = await searchItunes("")
    expect(result).toEqual({ resultCount: 0, results: [] })
    expect(fetch).not.toHaveBeenCalled()
  })

  it("should fetch data from iTunes and return parsed results", async () => {
    const mockData = {
      resultCount: 1,
      results: [
        {
          trackId: 1,
          artistName: "Artist",
          trackName: "Track",
        },
      ],
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response)

    const result = await searchItunes("test")
    expect(result).toEqual(mockData)
  })

  it("should include the offset parameter in the URL if provided", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ resultCount: 0, results: [] }),
    } as Response)

    await searchItunes("test", { offset: 50 })
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("offset=50"))
  })
})
