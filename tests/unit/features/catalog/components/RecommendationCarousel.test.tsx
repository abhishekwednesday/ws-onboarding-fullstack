import { render, screen } from "@testing-library/react"
import * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RecommendationCarousel } from "@/features/catalog/components/RecommendationCarousel"
import { useRecommendations } from "@/features/catalog/hooks/useRecommendations"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

// Mock the hook
vi.mock("@/features/catalog/hooks/useRecommendations")
// Mock the CatalogCard since we only want to test the carousel rendering logic,
// not the deep nesting of Next.js routers/images inside the CatalogCard.
vi.mock("@/features/catalog/components/CatalogCard", () => ({
  CatalogCard: ({ item }: { item: { title: string } }) => <div data-testid="mock-catalog-card">{item.title}</div>,
}))

// Mock environment and auth to prevent server-side execution errors in client test
vi.mock("@/env.mjs", () => ({ env: {} }))
vi.mock("@/lib/auth/auth", () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock("@/lib/db/pool", () => ({ pool: {} }))

describe("RecommendationCarousel Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render loading state when isLoading is true", () => {
    vi.mocked(useRecommendations).mockReturnValue({
      recommendations: [],
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    })

    render(<RecommendationCarousel />)

    expect(screen.getByTestId("recommendation-carousel-loading")).toBeInTheDocument()
    expect(screen.getByText(/finding tracks/i)).toBeInTheDocument()
  })

  it("should render empty state if there is an error", () => {
    vi.mocked(useRecommendations).mockReturnValue({
      recommendations: [],
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
      refetch: vi.fn(),
      isRefetching: false,
    })

    render(<RecommendationCarousel />)
    expect(screen.getByText(/no recommendations yet/i)).toBeInTheDocument()
  })

  it("should render empty state if recommendations array is empty", () => {
    vi.mocked(useRecommendations).mockReturnValue({
      recommendations: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    })

    render(<RecommendationCarousel />)
    expect(screen.getByText(/no recommendations yet/i)).toBeInTheDocument()
  })

  it("should render recommendations successfully", () => {
    vi.mocked(useRecommendations).mockReturnValue({
      recommendations: [
        { id: 1, title: "Track A", artist: "Artist A" } as CatalogItemType,
        { id: 2, title: "Track B", artist: "Artist B" } as CatalogItemType,
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    })

    render(<RecommendationCarousel />)

    expect(screen.getByTestId("recommendation-carousel")).toBeInTheDocument()
    expect(screen.getByText("Recommended for You")).toBeInTheDocument()

    const mockCards = screen.getAllByTestId("mock-catalog-card")
    expect(mockCards).toHaveLength(2)
    expect(mockCards[0]).toHaveTextContent("Track A")
    expect(mockCards[1]).toHaveTextContent("Track B")
  })
})
