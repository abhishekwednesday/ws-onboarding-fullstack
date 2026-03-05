import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { ErrorState } from "@/features/catalog/components/ErrorState"

describe("ErrorState component", () => {
  it("should render the default title and message", () => {
    render(<ErrorState />)

    expect(screen.getByText("Something went wrong")).toBeDefined()
    expect(screen.getByText(/error occurred while fetching/i)).toBeDefined()
  })

  it("should render custom title and message when provided", () => {
    render(<ErrorState title="Oops" message="Network failure." />)

    expect(screen.getByText("Oops")).toBeDefined()
    expect(screen.getByText("Network failure.")).toBeDefined()
  })

  it("should not render a retry button when onRetry is not provided", () => {
    render(<ErrorState />)

    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull()
  })

  it("should render and invoke the retry button when onRetry is provided", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)

    const button = screen.getByRole("button", { name: /try again/i })
    expect(button).toBeDefined()

    await user.click(button)
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
