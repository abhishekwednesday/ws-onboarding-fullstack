import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Navbar } from "@/components/layout/Navbar"

vi.mock("@/components/theme/ModeToggle", () => ({
  ModeToggle: () => <div data-testid="mode-toggle">ModeToggle</div>,
}))

describe("Navbar component", () => {
  it("renders the branding name", () => {
    render(<Navbar />)
    expect(screen.getByText(/MusicStream/i)).toBeInTheDocument()
  })

  it("renders navigation links", () => {
    render(<Navbar />)
    const links = screen.getAllByRole("link", { name: /Catalog/i })
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]).toBeInTheDocument()
  })
})
