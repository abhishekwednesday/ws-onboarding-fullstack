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
  trackViewUrl: "https://example.com/itunes-store",
}

describe("CatalogCard component", () => {
  it("should render track title and artist", () => {
    render(<CatalogCard item={mockItem} />)

    expect(screen.getByText(mockItem.title)).toBeInTheDocument()
    expect(screen.getByText(mockItem.artist)).toBeInTheDocument()
  })

  it("should display the iTunes store badge with a link", () => {
    render(<CatalogCard item={mockItem} />)
    const storeLink = screen.getByRole("link", { name: /listen on apple music/i })
    expect(storeLink).toBeInTheDocument()
    expect(storeLink.getAttribute("href")).toBe(mockItem.trackViewUrl)
    expect(storeLink.getAttribute("target")).toBe("_blank")
  })

  it("should render genre", () => {
    render(<CatalogCard item={mockItem} />)
    expect(screen.getByText(/Rock/i)).toBeInTheDocument()
  })

  it("should render artwork image with correct alt text", () => {
    render(<CatalogCard item={mockItem} />)
    const img = screen.getByAltText(mockItem.title)
    expect(img).toBeInTheDocument()
  })

  it("should render non-clickable fallback for non-HTTPS trackViewUrl", () => {
    const nonHttpsItem = { ...mockItem, trackViewUrl: "http://example.com/itunes-store" }
    render(<CatalogCard item={nonHttpsItem} />)

    // An anchor element (link) should not exist
    const storeLink = screen.queryByRole("link", { name: /listen on apple music/i })
    expect(storeLink).not.toBeInTheDocument()

    // Instead, a generic element with the label should be present
    const storeBadge = screen.getByLabelText(/listen on apple music/i)
    expect(storeBadge).toBeInTheDocument()
    expect(storeBadge.tagName.toLowerCase()).not.toBe("a")
  })
})
