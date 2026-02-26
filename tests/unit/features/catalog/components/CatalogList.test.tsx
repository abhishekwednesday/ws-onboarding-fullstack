import { render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { CatalogList } from "@/features/catalog/components/CatalogList"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

vi.mock("@/features/catalog/components/CatalogCard", () => ({
  CatalogCard: ({ item }: { item: CatalogItemType }) => (
    <div data-testid="mock-catalog-card">
      <div>{item.title}</div>
      <div>{item.artist}</div>
    </div>
  ),
}))

const mockItems: CatalogItemType[] = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    artworkUrl: "http://example.com/art1.jpg",
    genre: "Rock",
    duration: 354000,
    trackViewUrl: "http://example.com/itunes-1",
  },
  {
    id: 2,
    title: "Hotel California",
    artist: "Eagles",
    album: "Their Greatest Hits",
    artworkUrl: "http://example.com/art2.jpg",
    genre: "Rock",
    duration: 391000,
    trackViewUrl: "http://example.com/itunes-2",
  },
]

describe("CatalogList component", () => {
  it("should render a card for each item in the list", () => {
    render(<CatalogList items={mockItems} />)

    expect(screen.getByText("Bohemian Rhapsody")).toBeDefined()
    // Use getAllByText because the title may also appear as accessible text in the image alt
    expect(screen.getAllByText("Hotel California").length).toBeGreaterThan(0)
    expect(screen.getByText("Eagles")).toBeDefined()
  })

  it("should show the empty state message when the list is empty", () => {
    render(<CatalogList items={[]} />)

    expect(screen.getByText("No tracks found in the catalog.")).toBeDefined()
  })

  it("should not render the empty message when items exist", () => {
    render(<CatalogList items={mockItems} />)

    expect(screen.queryByText("No tracks found in the catalog.")).toBeNull()
  })
})
