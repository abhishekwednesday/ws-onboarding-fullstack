import { render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { CatalogCard } from "@/features/catalog/components/CatalogCard"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

// Mock dependencies that trigger server-side imports or complex state
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock("@/lib/analytics/events", () => ({
  trackTrackSelected: vi.fn(),
}))

vi.mock("@/features/playlist/components/AddToPlaylistButton", () => ({
  AddToPlaylistButton: () => <div data-testid="mock-add-to-playlist" />,
}))

vi.mock("@/features/catalog/components/FavoriteButton", () => ({
  FavoriteButton: () => <div data-testid="mock-favorite-button" />,
}))

const mockItem: CatalogItemType = {
  id: 1,
  title: "Bohemian Rhapsody",
  artist: "Queen",
  album: "A Night at the Opera",
  artworkUrl: "http://example.com/art.jpg",
  genre: "Rock",
  duration: 354000,
  trackViewUrl: "http://example.com/itunes-store",
}

describe("CatalogCard component", () => {
  it("should render track title and artist", () => {
    render(<CatalogCard item={mockItem} />)

    expect(screen.getByText(mockItem.title)).toBeDefined()
    expect(screen.getByText(mockItem.artist)).toBeDefined()
  })

  it("should display the iTunes store badge with a link", () => {
    render(<CatalogCard item={mockItem} />)
    const storeLink = screen.getByRole("link", { name: /listen on apple music/i })
    expect(storeLink).toBeDefined()
    expect(storeLink.getAttribute("href")).toBe(mockItem.trackViewUrl)
    expect(storeLink.getAttribute("target")).toBe("_blank")
  })

  it("should render genre", () => {
    render(<CatalogCard item={mockItem} />)
    expect(screen.getByText(/Rock/i)).toBeDefined()
  })

  it("should render artwork image with correct alt text", () => {
    render(<CatalogCard item={mockItem} />)
    const img = screen.getByAltText(mockItem.title)
    expect(img).toBeDefined()
  })
})
