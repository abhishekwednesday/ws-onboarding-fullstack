import { render, screen } from "@testing-library/react"
import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useInfiniteScroll } from "@/features/catalog/hooks/useInfiniteScroll"

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ""
  readonly thresholds: ReadonlyArray<number> = []

  private callback: IntersectionObserverCallback
  public observedElements: Set<Element> = new Set()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(target: Element): void {
    this.observedElements.add(target)
  }

  unobserve(target: Element): void {
    this.observedElements.delete(target)
  }

  disconnect(): void {
    this.observedElements.clear()
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  fire(entries: Partial<IntersectionObserverEntry>[]): void {
    this.callback(entries as IntersectionObserverEntry[], this)
  }
}

function TestComponent({ onIntersect, enabled }: { onIntersect: () => void; enabled?: boolean }) {
  const { sentinelRef } = useInfiniteScroll({ onIntersect, enabled })
  return (
    <div ref={sentinelRef} data-testid="sentinel">
      Sentinel
    </div>
  )
}

describe("useInfiniteScroll hook", () => {
  let latestObserver: MockIntersectionObserver | null = null

  beforeEach(() => {
    latestObserver = null
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback) => {
        latestObserver = new MockIntersectionObserver(callback)
        return latestObserver
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("should create an IntersectionObserver and observe the element", () => {
    render(<TestComponent onIntersect={vi.fn()} enabled={true} />)

    expect(IntersectionObserver).toHaveBeenCalled()
    expect(latestObserver?.observedElements.size).toBe(1)

    const div = screen.getByTestId("sentinel")
    expect(latestObserver?.observedElements.has(div)).toBe(true)
  })

  it("should call onIntersect when element is intersecting", () => {
    const onIntersect = vi.fn()
    render(<TestComponent onIntersect={onIntersect} enabled={true} />)

    latestObserver?.fire([{ isIntersecting: true }])
    expect(onIntersect).toHaveBeenCalled()
  })

  it("should cleanup observer on unmount", () => {
    const { unmount } = render(<TestComponent onIntersect={vi.fn()} enabled={true} />)

    const div = screen.getByTestId("sentinel")
    const unobserveSpy = vi.spyOn(latestObserver!, "unobserve")

    unmount()
    expect(unobserveSpy).toHaveBeenCalledWith(div)
  })

  it("should not create observer if disabled", () => {
    render(<TestComponent onIntersect={vi.fn()} enabled={false} />)
    expect(IntersectionObserver).not.toHaveBeenCalled()
  })
})
