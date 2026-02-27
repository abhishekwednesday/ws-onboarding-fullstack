"use client"

import { useTheme } from "next-themes"
import * as React from "react"

import Grainient from "@/components/backgrounds/Grainient"

/**
 * Animated Grainient background — covers the full viewport on the landing page.
 *   Light mode: soft cyan / sky-blue / lavender wash
 *   Dark mode:  deep cyan-navy ambient tones
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
        color1={isDark ? "#06b6d4" : "#e0f2fe"}
        color2={isDark ? "#020617" : "#f0f9ff"}
        color3={isDark ? "#172554" : "#c7d2fe"}
        timeSpeed={0.15}
        warpStrength={0.6}
        warpFrequency={3.5}
        warpSpeed={1.2}
        warpAmplitude={80}
        grainAmount={isDark ? 0.07 : 0.04}
        grainScale={1.5}
        grainAnimated={false}
        saturation={isDark ? 1.1 : 0.5}
        contrast={isDark ? 1.2 : 0.95}
        gamma={isDark ? 1.1 : 1.0}
        zoom={0.85}
        className="h-full w-full"
      />
    </div>
  )
}
