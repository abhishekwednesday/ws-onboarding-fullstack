import { describe, expect, it } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("should merge classes correctly", () => {
    expect(cn("px-2", "py-2")).toBe("px-2 py-2")
  })

  it("should handle conditional classes", () => {
    expect(cn("px-2", true && "py-2", false && "mt-4")).toBe("px-2 py-2")
  })

  it("should override conflicting Tailwind classes", () => {
    expect(cn("px-2 p-4")).toBe("p-4")
  })
})
