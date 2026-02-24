"use client"

import { useTheme } from "next-themes"
import * as React from "react"

import Grainient from "@/components/backgrounds/Grainient"

/**
 * Animated Grainient background — covers the full viewport on the landing page.
 * Colors are derived from the site's red-tinted theme:
 *   Light mode: warm rose / blush tones (matching the blush-white secondaries)
 *   Dark mode:  deep maroon / red-black tones (matching --background oklch 0.12 0.012 25)
 */
export function HeroGrainient() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Grainient
        // Light: warm rose-pink  Dark: visibly deep crimson
        color1={isDark ? "#4a0a0a" : "#fff0f0"}
        color2={isDark ? "#220505" : "#ffd6d6"}
        color3={isDark ? "#6b1020" : "#ffe4e4"}
        timeSpeed={0.15}
        warpStrength={0.6}
        warpFrequency={3.5}
        warpSpeed={1.2}
        warpAmplitude={80}
        grainAmount={0.07}
        grainScale={1.5}
        grainAnimated={false}
        saturation={isDark ? 1.1 : 0.65}
        contrast={isDark ? 1.2 : 1.1}
        gamma={1.1}
        zoom={0.85}
        className="h-full w-full"
      />
    </div>
  )
}
