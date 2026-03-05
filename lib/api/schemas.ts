import { z } from "zod"

export const ItunesTrackSchema = z.object({
  wrapperType: z.string().optional(),
  kind: z.string().optional(),
  artistId: z.number().optional(),
  collectionId: z.number().optional(),
  trackId: z.number(),
  artistName: z.string(),
  collectionName: z.string().optional(),
  trackName: z.string(),
  artworkUrl100: z.string().optional(),
  previewUrl: z.string().optional(),
  trackTimeMillis: z.number().optional(),
  releaseDate: z.string().optional(),
  primaryGenreName: z.string().optional(),
  trackViewUrl: z.string().url().refine((url) => url.startsWith("https:"), { message: "URL must use HTTPS protocol" }).optional(),
})

export type ItunesTrackType = z.infer<typeof ItunesTrackSchema>

export const ItunesSearchResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(ItunesTrackSchema),
})

export type ItunesSearchResponseType = z.infer<typeof ItunesSearchResponseSchema>
