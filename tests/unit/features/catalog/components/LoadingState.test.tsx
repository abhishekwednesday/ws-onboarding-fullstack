import { render } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { CatalogCardSkeleton, LoadingState } from "@/features/catalog/components/LoadingState"

describe("CatalogCardSkeleton component", () => {
  it("should render without crashing", () => {
    const { container } = render(<CatalogCardSkeleton />)
    expect(container.firstChild).toBeDefined()
  })
})

describe("LoadingState component", () => {
  it("should render exactly 10 skeleton cards", () => {
    const { container } = render(<LoadingState />)

    // Each CatalogCardSkeleton renders a Card. Count the direct children of the grid.
    const grid = container.firstChild as HTMLElement
    expect(grid.children).toHaveLength(10)
  })

  it("should render a grid container", () => {
    const { container } = render(<LoadingState />)
    const grid = container.firstChild as HTMLElement
    expect(grid.tagName.toLowerCase()).toBe("div")
  })
})
