"use client"

import { useEffect, useRef } from "react"

interface UseInfiniteScrollPropsType {
  onIntersect: () => void
  enabled?: boolean
  rootMargin?: string
}

export function useInfiniteScroll({ onIntersect, enabled = true, rootMargin = "200px" }: UseInfiniteScrollPropsType) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersectRef = useRef(onIntersect)

  useEffect(() => {
    onIntersectRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersectRef.current()
        }
      },
      { rootMargin }
    )

    const el = sentinelRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [enabled, rootMargin])

  return { sentinelRef }
}
