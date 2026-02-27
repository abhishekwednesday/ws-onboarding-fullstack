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

vi.mock("@/features/auth/components/UserMenu", () => ({
  UserMenu: () => <div data-testid="user-menu">UserMenu</div>,
}))

describe("Navbar component", () => {
  it("renders the branding name", () => {
    render(<Navbar />)
    const brandingElements = screen.getAllByText(/MusicStream/i)
    expect(brandingElements.length).toBeGreaterThan(0)
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

    // Initial state: mobile menu text shouldn't be visible (due to opacity-0 styling, though RTL might still find it in the DOM)
    // We check the button itself
    expect(toggle).toBeInTheDocument()

    // Click to open
    fireEvent.click(toggle)
    expect(screen.getByText(/Start Browsing/i)).toBeInTheDocument()

    // The close button is now separate
    const closeBtn = screen.getByRole("button", { name: /close menu/i })
    expect(closeBtn).toBeInTheDocument()

    // Click to close
    fireEvent.click(closeBtn)

    // The toggle menu button should be back
    expect(screen.getByRole("button", { name: /toggle menu/i })).toBeInTheDocument()
  })

  it("closes the mobile menu when a navigation link is clicked", () => {
    mockUsePathname.mockReturnValue("/")
    const { rerender } = render(<Navbar />)
    const toggle = screen.getByRole("button", { name: /toggle menu/i })

    // Open menu
    fireEvent.click(toggle)

    // Verify it opened by finding the close button
    const closeBtn = screen.getByRole("button", { name: /close menu/i })
    expect(closeBtn).toBeInTheDocument()

    // Simulate navigation by changing mock return value and rerendering
    mockUsePathname.mockReturnValue("/catalog")
    rerender(<Navbar />)

    // Menu should be closed, so the original open toggle is back in view context (state reset)
    expect(screen.getByRole("button", { name: /toggle menu/i })).toBeInTheDocument()
  })
})
