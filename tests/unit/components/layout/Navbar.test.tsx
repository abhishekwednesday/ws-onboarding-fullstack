import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Navbar } from "@/components/layout/Navbar"

const mockUsePathname = vi.fn(() => "/")

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

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
    expect(links).toHaveLength(2) // Desktop + Mobile
    expect(links[0]).toHaveAttribute("href", "/catalog")
  })

  it("toggles the mobile menu on button click", () => {
    render(<Navbar />)
    const toggle = screen.getByRole("button", { name: /toggle menu/i })

    // Initial state
    expect(toggle).toHaveAttribute("aria-expanded", "false")

    // Click to open
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText(/Start Browsing/i)).toBeInTheDocument()

    // Click to close
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })

  it("closes the mobile menu when a navigation link is clicked", () => {
    mockUsePathname.mockReturnValue("/")
    const { rerender } = render(<Navbar />)
    const toggle = screen.getByRole("button", { name: /toggle menu/i })

    // Open menu
    fireEvent.click(toggle)
    expect(screen.getByText(/Start Browsing/i)).toBeInTheDocument()

    // Simulate navigation by changing mock return value and rerendering
    mockUsePathname.mockReturnValue("/catalog")
    rerender(<Navbar />)

    // Menu should be closed
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })
})
