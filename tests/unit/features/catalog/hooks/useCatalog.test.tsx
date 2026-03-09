import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import * as catalogActions from "@/features/catalog/api/catalog-actions"
import { useCatalog } from "@/features/catalog/hooks/useCatalog"

vi.mock("@/features/catalog/api/catalog-actions", () => ({
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useCatalog hook", () => {
  const mockItems = [
    {
      id: 1,
      title: "Song 1",
      artist: "Artist 1",
      artworkUrl: "",
      previewUrl: "",
    },
    {
      id: 2,
      title: "Song 2",
      artist: "Artist 2",
      artworkUrl: "",
      previewUrl: "",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValue({
      items: mockItems,
      nextOffset: null,
      totalCount: 2,
    })
  })

  it("should fetch initial items on mount", async () => {
    const { result } = renderHook(() => useCatalog(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data.length).toBe(2)
    expect(catalogActions.itunesSearchAction).toHaveBeenCalledWith("top music", {
      offset: 0,
      media: "",
      country: undefined,
      explicit: "",
    })
  })

  it("should load more items when loadMore is called", async () => {
    const fullPageItems = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      title: `Song ${i}`,
      artist: "Artist",
      artworkUrl: "",
      previewUrl: "",
    }))

    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValueOnce({
      items: fullPageItems,
      nextOffset: 50,
      totalCount: 100,
    })

    const { result } = renderHook(() => useCatalog(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasMore).toBe(true)

    const secondBatch = [{ id: 100, title: "Song 100", artist: "Artist", artworkUrl: "", previewUrl: "" }]

    vi.mocked(catalogActions.itunesSearchAction).mockResolvedValueOnce({
      items: secondBatch,
      nextOffset: null,
      totalCount: 100,
    })

    await act(async () => {
      result.current.loadMore()
    })

    await waitFor(() => expect(result.current.isFetchingMore).toBe(false))
    // isFetchingMore is now mapped directly to isFetchingNextPage in useCatalog.ts
    expect(result.current.isFetchingMore).toBe(false)

    expect(result.current.data.length).toBe(51)
    expect(catalogActions.itunesSearchAction).toHaveBeenCalledWith("top music", {
      offset: 50,
      media: "",
      country: undefined,
      explicit: "",
    })
  })

  it("should stop pagination when no new unique items are found", async () => {
    const fiftyItems = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      title: `Song ${i}`,
      artist: "Artist",
      artworkUrl: "",
      previewUrl: "",
    }))

    vi.mocked(catalogActions.itunesSearchAction).mockClear()
    vi.mocked(catalogActions.itunesSearchAction)
      .mockResolvedValueOnce({
        totalCount: 50,
        nextOffset: 50, // Added to simulate pagination
        items: fiftyItems,
      })
      .mockResolvedValueOnce({
        totalCount: 50,
        nextOffset: 100,
        items: fiftyItems, // Return same items to test duplicate handling
      })

    const { result } = renderHook(() => useCatalog(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasMore).toBe(true)

    await act(async () => {
      result.current.loadMore()
    })

    await waitFor(() => {
      expect(result.current.isFetchingMore).toBe(false)
      expect(result.current.hasMore).toBe(false)
    })
  })

  it("should reset items and dedupe cache when search term changes", async () => {
    const searchBatch = [{ id: 10, title: "Search Result", artist: "Search Artist", artworkUrl: "", previewUrl: "" }]

    vi.mocked(catalogActions.itunesSearchAction).mockClear()
    vi.mocked(catalogActions.itunesSearchAction)
      .mockResolvedValueOnce({
        items: mockItems, // consumed by initial mount "top music"
        nextOffset: null,
        totalCount: 2,
      })
      .mockResolvedValueOnce({
        items: searchBatch, // consumed by "new" term search
        nextOffset: null,
        totalCount: 1,
      })

    const { result } = renderHook(() => useCatalog(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setSearchTerm("new")
    })

    await waitFor(
      () => {
        expect(result.current.data.length).toBe(1)
        expect(result.current.data[0]?.title).toBe("Search Result")
      },
      { timeout: 3000 }
    )
  })
})
