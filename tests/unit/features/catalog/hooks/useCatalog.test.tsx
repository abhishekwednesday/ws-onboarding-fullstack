import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as catalogActions from "@/actions/catalog/catalog-actions"
import { useCatalog } from "@/features/catalog/hooks/useCatalog"
import { type ItunesSearchResponseType } from "@/lib/api/schemas"

vi.mock("@/actions/catalog/catalog-actions", () => ({
  itunesSearchAction: vi.fn(),
}))

describe("useCatalog hook", () => {
  const mockItems = [
    { trackId: 1, trackName: "Song 1", artistName: "Artist 1", artworkUrl100: "", previewUrl: "" },
    { trackId: 2, trackName: "Song 2", artistName: "Artist 2", artworkUrl100: "", previewUrl: "" },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValue({
      resultCount: 2,
      results: mockItems,
    } as unknown as ItunesSearchResponseType)
  })

  it("should fetch initial items on mount", async () => {
    const { result } = renderHook(() => useCatalog())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data.length).toBe(2)
    expect(catalogActions.itunesSearchAction).toHaveBeenCalledWith("top music", 0)
  })

  it("should load more items when loadMore is called", async () => {
    // Start with a mock that looks like a full page to keep hasMore=true
    const fullPageResults = Array.from({ length: 50 }).map((_, i) => ({
      trackId: i,
      trackName: `Song ${i}`,
      artistName: "Artist",
      artworkUrl100: "",
      previewUrl: "",
    }))
    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValueOnce({
      resultCount: 50,
      results: fullPageResults,
    } as unknown as ItunesSearchResponseType)

    const { result } = renderHook(() => useCatalog())

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasMore).toBe(true)

    const secondBatch = [
      { trackId: 100, trackName: "Song 100", artistName: "Artist", artworkUrl100: "", previewUrl: "" },
    ]

    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValueOnce({
      resultCount: 1,
      results: secondBatch,
    } as unknown as ItunesSearchResponseType)

    await act(async () => {
      result.current.loadMore()
    })

    await waitFor(() => expect(result.current.isFetchingMore).toBe(false))

    expect(result.current.data.length).toBe(51)
    expect(catalogActions.itunesSearchAction).toHaveBeenCalledWith("top music", 50)
  })

  it("should reset items when search term changes", async () => {
    const { result } = renderHook(() => useCatalog())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const searchBatch = [
      { trackId: 10, trackName: "Search Result", artistName: "Search Artist", artworkUrl100: "", previewUrl: "" },
    ]

    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValueOnce({
      resultCount: 1,
      results: searchBatch,
    } as unknown as ItunesSearchResponseType)

    act(() => {
      result.current.setSearchTerm("new")
    })

    // Search term change triggers a reset fetch when it deviates from lastTermRef.current
    await waitFor(
      () => {
        expect(result.current.data.length).toBe(1)
        expect(result.current.data[0]?.title).toBe("Search Result")
      },
      { timeout: 3000 }
    )
  })

  it("should stop pagination when no new unique items are found", async () => {
    // Start with items in state
    const { result } = renderHook(() => useCatalog())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // items length is 2. manually override hasMore to true for testing if needed
    // Actually the hook sets hasMore based on result length.

    // We need the FIRST call to return 50 to have hasMore=true
    vi.mocked(catalogActions.itunesSearchAction).mockClear()
    vi.mocked(catalogActions.itunesSearchAction)
      .mockResolvedValueOnce({
        resultCount: 50,
        results: Array.from({ length: 50 }).map((_, i) => ({
          trackId: i,
          trackName: `Song ${i}`,
          artistName: "Artist",
          artworkUrl100: "",
          previewUrl: "",
        })),
      } as unknown as ItunesSearchResponseType)
      .mockResolvedValueOnce({
        resultCount: 50,
        results: Array.from({ length: 50 }).map((_, i) => ({
          trackId: i, // SAME IDs as before
          trackName: `Song ${i}`,
          artistName: "Artist",
          artworkUrl100: "",
          previewUrl: "",
        })),
      } as unknown as ItunesSearchResponseType)

    const { result: hook } = renderHook(() => useCatalog())
    await waitFor(() => expect(hook.current.isLoading).toBe(false))
    expect(hook.current.hasMore).toBe(true)

    await act(async () => {
      hook.current.loadMore()
    })

    await waitFor(() => {
      expect(hook.current.isFetchingMore).toBe(false)
      expect(hook.current.hasMore).toBe(false)
    })
  })
})
