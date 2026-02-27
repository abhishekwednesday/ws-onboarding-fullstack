import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Navbar } from "@/components/layout/Navbar"

const mockUsePathname = vi.fn(() => "/")

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

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
    const desktopLink = screen.getByRole("link", { name: /Catalog/i })
    expect(desktopLink).toHaveAttribute("href", "/catalog")
  })

  it("toggles the mobile menu on button click", () => {
    render(<Navbar />)
    const toggle = screen.getByRole("button", { name: /toggle menu/i })
    const mobileMenu = document.getElementById("mobile-menu")!

    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(mobileMenu).toHaveAttribute("aria-hidden", "true")

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(mobileMenu).toHaveAttribute("aria-hidden", "false")

    const closeBtn = screen.getByRole("button", { name: /close menu/i })
    fireEvent.click(closeBtn)

    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(mobileMenu).toHaveAttribute("aria-hidden", "true")
  })

  it("closes the mobile menu when a navigation link is clicked", () => {
    mockUsePathname.mockReturnValue("/")
    const { rerender } = render(<Navbar />)
    const toggle = screen.getByRole("button", { name: /toggle menu/i })
    const mobileMenu = document.getElementById("mobile-menu")!

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(mobileMenu).toHaveAttribute("aria-hidden", "false")

    mockUsePathname.mockReturnValue("/catalog")
    rerender(<Navbar />)

    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(mobileMenu).toHaveAttribute("aria-hidden", "true")
  })
})
