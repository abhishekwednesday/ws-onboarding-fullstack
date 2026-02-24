import { render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { CatalogCard } from "@/features/catalog/components/CatalogCard"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

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
  it("should render track information correctly", () => {
    render(<CatalogCard item={mockItem} />)

    expect(screen.getByText(mockItem.title)).toBeDefined()
    expect(screen.getByText(mockItem.artist)).toBeDefined()
    expect(screen.getByText(mockItem.album!)).toBeDefined()
  })

  it("should display the mandatory iTunes attribution text", () => {
    render(<CatalogCard item={mockItem} />)
    expect(screen.getByText(/provided courtesy of iTunes/i)).toBeDefined()
  })

  it("should display the iTunes store badge with a link", () => {
    render(<CatalogCard item={mockItem} />)
    const storeLink = screen.getByRole("link", { name: /listen on apple music/i })
    expect(storeLink).toBeDefined()
    expect(storeLink.getAttribute("href")).toBe(mockItem.trackViewUrl)
    expect(storeLink.getAttribute("target")).toBe("_blank")
  })

  it("should render metadata like genre and duration", () => {
    render(<CatalogCard item={mockItem} />)
    expect(screen.getByText(/Rock/i)).toBeDefined()
    expect(screen.getByText("5:54")).toBeDefined() // 354000ms -> 5:54
  })
})
