import { BookHeart, ChevronDown, Play, Search, Sparkles } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

import { HeroGrainient } from "@/components/landing/HeroGrainient"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "MusicStream | Premium Catalog",
  description: "A breathtaking music discovery experience powered by the iTunes Search API.",
}

export default function LandingPage() {
  return (
    <>
      <div className="bg-gradient-ambient pointer-events-none fixed inset-0 z-0" />
      <HeroGrainient />

      <div className="relative z-10 flex flex-col pt-16">
        {/* ── Hero ── */}
        <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-4 text-center">
          <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8">
            <div className="glass animate-in fade-in slide-in-from-bottom-4 mb-4 inline-flex items-center gap-2 rounded-full px-5 py-2 duration-1000">
              <Sparkles className="text-primary h-4 w-4" />
              <span className="text-foreground/80 text-xs font-medium tracking-[0.2em] uppercase">
                Refined Discovery
              </span>
            </div>

            <h1 className="animate-in fade-in slide-in-from-bottom-6 font-serif text-6xl leading-[1.05] font-medium tracking-tight delay-150 duration-1000 sm:text-7xl lg:text-8xl">
              Find the music
              <br />
              <span className="text-gradient-primary pr-4 italic">you love.</span>
            </h1>

            <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-8 max-w-xl text-lg leading-relaxed delay-300 duration-1000 sm:text-xl">
              A premium, high-fidelity catalog powered by iTunes. Search tracks, preview snippets, and curate your
              personal collection seamlessly.
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-10 flex w-full flex-col gap-4 pt-8 delay-500 duration-1000 sm:w-auto sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-full px-10 text-base font-medium transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]"
              >
                <Link href="/catalog">Enter Catalog</Link>
              </Button>
            </div>
          </div>

          <div className="text-foreground/30 absolute bottom-12 flex animate-pulse flex-col items-center gap-2">
            <span className="text-[10px] font-medium tracking-widest uppercase">Explore</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </section>

        {/* ── Features ── */}
        <section className="relative z-10 w-full py-32">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Search,
                  title: "Infinite Search",
                  description:
                    "Instantly query millions of tracks with sub-second response times and continuous scroll.",
                },
                {
                  icon: Play,
                  title: "High-Fi Previews",
                  description:
                    "Listen to 30-second master quality previews directly from the Apple Music CDN natively.",
                },
                {
                  icon: BookHeart,
                  title: "Local State Synced",
                  description:
                    "Curate your likes effortlessly. Your collection persists locally, beautifully designed.",
                },
              ].map(({ icon: Icon, title, description }, i) => (
                <div
                  key={title}
                  className="glass-card group rounded-3xl p-8"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="glass group-hover:bg-primary/20 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110">
                    <Icon className="text-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                  </div>
                  <h3 className="text-foreground mb-3 font-serif text-xl font-medium">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
