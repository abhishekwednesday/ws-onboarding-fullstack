import { BookHeart, ChevronDown, Play, Search } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

import { HeroGrainient } from "@/components/landing/HeroGrainient"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "MusicStream",
  description: "A small music discovery app powered by the iTunes Search API.",
}

export default function LandingPage() {
  return (
    <>
      {/* Animated background — covers full viewport */}
      <HeroGrainient />

      <div className="flex flex-col">
        {/* ── Hero: full-viewport, vertically centred ── */}
        <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center text-center">
          {/* Content */}
          <div className="flex flex-col items-center space-y-7 px-4">
            {/* Eyebrow */}
            <span className="text-muted-foreground inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs tracking-widest uppercase backdrop-blur-sm">
              Powered by iTunes Search API
            </span>

            {/* Headline */}
            <h1 className="max-w-3xl text-5xl leading-[1.1] font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Find music
              <br />
              <span className="text-primary">you&apos;ll love.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground max-w-md text-base leading-relaxed sm:text-lg">
              Search tracks, artists, and albums. Preview snippets, save favourites, and jump straight to
              Apple&nbsp;Music.
            </p>

            {/* CTA */}
            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="gap-2 px-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/catalog">
                  Browse the catalog
                  <span aria-hidden="true">→</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="text-muted-foreground/50 absolute bottom-8 flex flex-col items-center gap-1">
            <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
          </div>
        </section>

        {/* ── Features: glass cards ── */}
        <section id="features" className="w-full py-24">
          <div className="mx-auto max-w-5xl px-4">
            {/* Section label */}
            <div className="mb-12 flex flex-col items-center gap-2 text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">What you can do</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need</h2>
            </div>

            {/* Cards */}
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: Search,
                  title: "Search anything",
                  description: "Type a track, artist, or album and get results straight from the iTunes catalog.",
                },
                {
                  icon: Play,
                  title: "Preview & open",
                  description: "Play a 30-second preview on the spot, or open the full track in Apple Music.",
                },
                {
                  icon: BookHeart,
                  title: "Save favourites",
                  description: "Bookmark tracks you love and revisit them any time — no account needed.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-background/40 space-y-4 rounded-2xl border border-white/10 p-7 backdrop-blur-md"
                >
                  <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
                    <Icon className="text-foreground h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
