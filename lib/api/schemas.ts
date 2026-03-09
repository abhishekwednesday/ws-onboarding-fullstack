import { z } from "zod"

export enum CatalogMediaType {
  MUSIC = "music",
  PODCAST = "podcast",
  AUDIOBOOK = "audiobook",
  MOVIE = "movie",
  TV_SHOW = "tvShow",
  ALL = "all",
}

export enum CatalogExplicitType {
  YES = "Yes",
  NO = "No",
  CLEANED = "cleaned",
}

export interface SearchOptions {
  term: string
  offset?: number
  limit?: number
  media?: CatalogMediaType
  entity?: string
  attribute?: string
  country?: string // e.g., 'US', 'GB'
  lang?: string // e.g. 'en_us', 'ja_jp'
  explicit?: CatalogExplicitType
}

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
  trackViewUrl: z
    .string()
    .url()
    .refine((url) => url.startsWith("https:"), { message: "URL must use HTTPS protocol" })
    .optional(),
})

export type ItunesTrackType = z.infer<typeof ItunesTrackSchema>

export const ItunesItemSchema = z.union([
  ItunesTrackSchema,
  z.object({ wrapperType: z.string().optional(), kind: z.string().optional() }).passthrough(),
])

export type ItunesItemType = z.infer<typeof ItunesItemSchema>
export const ItunesSearchResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(ItunesItemSchema),
})

export type ItunesSearchResponseType = z.infer<typeof ItunesSearchResponseSchema>
