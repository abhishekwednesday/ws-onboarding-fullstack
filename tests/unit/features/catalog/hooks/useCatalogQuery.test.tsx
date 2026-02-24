import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import * as catalogActions from "@/actions/catalog/catalog-actions"
import { useCatalogQuery } from "@/features/catalog/hooks/useCatalogQuery"
import { type ItunesSearchResponseType } from "@/lib/api/schemas"

vi.mock("@/actions/catalog/catalog-actions", () => ({
  itunesSearchAction: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  )
}

describe("useCatalogQuery hook", () => {
  it("should transform ITunes data to CatalogItemType on success", async () => {
    const mockItunesResponse = {
      resultCount: 1,
      results: [
        {
          trackId: 123,
          trackName: "Song Name",
          artistName: "Artist Name",
          collectionName: "Album Name",
          artworkUrl100: "http://example.com/art.jpg",
          previewUrl: "http://example.com/preview.mp3",
          primaryGenreName: "Rock",
          trackTimeMillis: 300000,
          trackViewUrl: "http://example.com/view",
        },
      ],
    }
    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValueOnce(
      mockItunesResponse as unknown as ItunesSearchResponseType
    )

    const { result } = renderHook(() => useCatalogQuery("query"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([
      {
        id: 123,
        title: "Song Name",
        artist: "Artist Name",
        album: "Album Name",
        artworkUrl: "http://example.com/art.jpg",
        previewUrl: "http://example.com/preview.mp3",
        genre: "Rock",
        duration: 300000,
        trackViewUrl: "http://example.com/view",
      },
    ])
  })

  it("should handle error state when the action fails", async () => {
    vi.mocked(catalogActions.itunesSearchAction).mockRejectedValueOnce(new Error("Fetch Failed"))

    const { result } = renderHook(() => useCatalogQuery("query"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })
})
