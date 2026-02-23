import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Footer } from "@/components/layout/Footer"

describe("Footer component", () => {
  it("renders description", () => {
    render(<Footer />)
    expect(screen.getByText(/MusicStream/i)).toBeInTheDocument()
  })
})
