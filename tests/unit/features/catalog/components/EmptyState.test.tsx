import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { EmptyState } from "@/features/catalog/components/EmptyState"

describe("EmptyState component", () => {
  it("should render the default title and description", () => {
    render(<EmptyState />)

    expect(screen.getByText("No results found")).toBeDefined()
    expect(screen.getByText(/couldn't find what you're looking for/i)).toBeDefined()
  })

  it("should render custom title and description when provided", () => {
    render(<EmptyState title="Nothing here" description="Try a different query." />)

    expect(screen.getByText("Nothing here")).toBeDefined()
    expect(screen.getByText("Try a different query.")).toBeDefined()
  })

  it("should not render a clear button when onReset is not provided", () => {
    render(<EmptyState />)

    expect(screen.queryByRole("button", { name: /clear search/i })).toBeNull()
  })

  it("should render and invoke the clear button when onReset is provided", () => {
    const onReset = vi.fn()
    render(<EmptyState onReset={onReset} />)

    const button = screen.getByRole("button", { name: /clear search/i })
    expect(button).toBeDefined()

    fireEvent.click(button)
    expect(onReset).toHaveBeenCalledOnce()
  })
})
