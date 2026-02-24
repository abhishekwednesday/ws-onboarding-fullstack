import { Play, Search } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "MusicStream",
  description: "A small music discovery app powered by the iTunes Search API.",
}

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full py-24 lg:py-36">
        <div className="flex flex-col items-center space-y-6 text-center">
          <p className="text-muted-foreground text-sm tracking-widest uppercase">Powered by iTunes Search API</p>

          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find music you&apos;ll love.
          </h1>

          <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
            A small personal project for discovering tracks and artists. Search anything — browse results, preview
            snippets, and jump straight to Apple Music.
          </p>

          <div className="pt-2">
            <Link href="/catalog">
              <Button size="lg" className="gap-2 px-8">
                Browse music
                <span aria-hidden="true">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Two honest feature cards */}
      <section className="w-full border-t py-16">
        <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
          <div className="space-y-3 rounded-2xl border p-6">
            <div className="bg-muted inline-flex rounded-xl p-2.5">
              <Search className="text-foreground h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold">Search anything</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Type a track, artist, or album name and get results straight from the iTunes catalog.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border p-6">
            <div className="bg-muted inline-flex rounded-xl p-2.5">
              <Play className="text-foreground h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold">Preview & open</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Play a 30-second preview on the spot, or open the full track directly in Apple Music.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
