import { describe, expect, it } from "vitest"
import { ItunesSearchResponseSchema, ItunesTrackSchema } from "@/lib/api/schemas"

describe("iTunes Zod Schemas", () => {
  const mockTrack = {
    trackId: 123,
    artistName: "Test Artist",
    trackName: "Test Track",
    artworkUrl100: "https://example.com/image.jpg",
    previewUrl: "https://example.com/preview.mp3",
    primaryGenreName: "Rock",
    kind: "song",
  }

  describe("ItunesTrackSchema", () => {
    it("should validate a valid track", () => {
      const result = ItunesTrackSchema.safeParse(mockTrack)
      expect(result.success).toBe(true)
    })

    it("should fail validation if required fields are missing", () => {
      const result = ItunesTrackSchema.safeParse({ trackId: 123 })
      expect(result.success).toBe(false)
    })
  })

  describe("ItunesSearchResponseSchema", () => {
    it("should validate a valid response", () => {
      const mockResponse = {
        resultCount: 1,
        results: [mockTrack],
      }
      const result = ItunesSearchResponseSchema.safeParse(mockResponse)
      expect(result.success).toBe(true)
    })
  })
})
