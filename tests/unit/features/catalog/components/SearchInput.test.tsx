import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { SearchInput } from "@/features/catalog/components/SearchInput"

describe("SearchInput component", () => {
  it("should render the input with the correct placeholder", () => {
    render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} />)

    const input = screen.getByRole("textbox")
    expect(input.getAttribute("placeholder")).toBe("Search for tracks, artists...")
  })

  it("should render a custom placeholder when provided", () => {
    render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} placeholder="Find music..." />)

    const input = screen.getByRole("textbox")
    expect(input.getAttribute("placeholder")).toBe("Find music...")
  })

  it("should display the current value", () => {
    render(<SearchInput value="Queen" onChange={vi.fn()} onClear={vi.fn()} />)

    const input = screen.getByRole("textbox") as HTMLInputElement
    expect(input.value).toBe("Queen")
  })

  it("should call onChange when the user types", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} onClear={vi.fn()} />)

    const input = screen.getByRole("textbox")
    await user.type(input, "A")
    expect(onChange).toHaveBeenCalledWith("A")
  })

  it("should not show the clear button when value is empty", () => {
    render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} />)

    expect(screen.queryByLabelText(/clear search/i)).toBeNull()
  })

  it("should show the clear button when value is non-empty", () => {
    render(<SearchInput value="Queen" onChange={vi.fn()} onClear={vi.fn()} />)

    expect(screen.getByLabelText(/clear search/i)).toBeDefined()
  })

  it("should call onClear when the clear button is clicked", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<SearchInput value="Queen" onChange={vi.fn()} onClear={onClear} />)

    await user.click(screen.getByLabelText(/clear search/i))
    expect(onClear).toHaveBeenCalledOnce()
  })
})
