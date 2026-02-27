import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import * as recommendationsApi from "@/features/catalog/api/recommendations"
import { useRecommendations } from "@/features/catalog/hooks/useRecommendations"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

vi.mock("@/features/catalog/api/recommendations", () => ({
  getRecommendedTracksAction: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const mockRecommendations: CatalogItemType[] = [
  {
    id: 1,
    title: "Rec 1",
    artist: "Rec Artist 1",
  },
  {
    id: 2,
    title: "Rec 2",
    artist: "Rec Artist 2",
  },
]

describe("useRecommendations hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch recommendations successfully", async () => {
    vi.mocked(recommendationsApi.getRecommendedTracksAction).mockResolvedValue({
      success: true,
      data: mockRecommendations,
    })

    const { result } = renderHook(() => useRecommendations(), { wrapper: createWrapper() })

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for data
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.recommendations).toEqual(mockRecommendations)
    expect(result.current.isError).toBe(false)
  })

  it("should handle error state when fetching recommendations fails", async () => {
    // Suppress console.error for this expected error test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    vi.mocked(recommendationsApi.getRecommendedTracksAction).mockResolvedValue({
      success: false,
      error: "Failed to fetch recommendations",
    })

    const { result } = renderHook(() => useRecommendations(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.recommendations).toEqual([])
    expect(result.current.error?.message).toBe("Failed to fetch recommendations")

    consoleSpy.mockRestore()
  })
})
