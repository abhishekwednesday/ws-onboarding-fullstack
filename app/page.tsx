import { Play, Radio, Search, Zap } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "MusicStream - Your World of Music",
  description: "Discover, search, and stream your favorite tracks using the iTunes Catalog.",
}

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="bg-background relative w-full overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--color-primary)_0%,transparent_100%)] opacity-[0.08]" />
        <div className="w-full">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-24 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="bg-muted/50 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium">
                  <Zap className="text-primary mr-2 h-4 w-4" />
                  <span>Powered by iTunes Search API</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Your World of Music,{" "}
                  <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                    Streamed.
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-[600px] text-lg md:text-xl/relaxed xl:text-2xl/relaxed">
                  Access millions of tracks, albums, and artists. Personalize your listening experience with a seamless
                  musical journey.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/catalog">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    Explore Catalog
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    How it works
                  </Button>
                </Link>
              </div>
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-background bg-muted h-8 w-8 rounded-full border-2" />
                  ))}
                </div>
                <p>Join 10,000+ music lovers discovering tracks daily.</p>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="from-primary/20 to-primary/5 absolute -inset-4 rounded-[2rem] bg-gradient-to-tr blur-3xl" />
              <div className="bg-card relative h-full w-full rounded-[2rem] border p-4 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-muted h-8 w-32 rounded" />
                    <div className="bg-muted h-8 w-8 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-muted/50 aspect-square animate-pulse rounded-xl" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted h-4 w-full rounded" />
                    <div className="bg-muted h-4 w-2/3 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 w-full border-y py-12">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center space-y-1 text-center font-bold">
              <span className="text-3xl lg:text-4xl">70M+</span>
              <span className="text-muted-foreground text-sm font-medium">Tracks</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1 text-center font-bold">
              <span className="text-3xl lg:text-4xl">5M+</span>
              <span className="text-muted-foreground text-sm font-medium">Albums</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1 text-center font-bold">
              <span className="text-3xl lg:text-4xl">200+</span>
              <span className="text-muted-foreground text-sm font-medium">Genres</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1 text-center font-bold">
              <span className="text-3xl lg:text-4xl">Free</span>
              <span className="text-muted-foreground text-sm font-medium">Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 lg:py-32">
        <div className="w-full">
          <div className="mb-12 flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Everything you need</h2>
            <p className="text-muted-foreground max-w-[700px] md:text-xl">
              Powerful tools to find and enjoy your favorite tunes effortlessly.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group bg-background hover:border-primary/50 relative overflow-hidden rounded-[2rem] border p-8 transition-all hover:shadow-lg">
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 inline-flex items-center justify-center rounded-2xl p-3 transition-colors">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Smart Discovery</h3>
              <p className="text-muted-foreground">Browse millions of tracks with our intelligent filtering system.</p>
            </div>
            <div className="group bg-background hover:border-primary/50 relative overflow-hidden rounded-[2rem] border p-8 transition-all hover:shadow-lg">
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 inline-flex items-center justify-center rounded-2xl p-3 transition-colors">
                <Play className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Instant Preview</h3>
              <p className="text-muted-foreground">Listen to high-quality audio snippets before you commit.</p>
            </div>
            <div className="group bg-background hover:border-primary/50 relative overflow-hidden rounded-[2rem] border p-8 transition-all hover:shadow-lg">
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 inline-flex items-center justify-center rounded-2xl p-3 transition-colors">
                <Radio className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Artist Radio</h3>
              <p className="text-muted-foreground">Discover related music based on your favorite artists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 lg:py-32">
        <div className="w-full">
          <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-[3rem] px-6 py-16 text-center sm:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" />
            <div className="relative z-10 mx-auto max-w-[600px] space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to start your journey?
              </h2>
              <p className="text-primary-foreground/80 md:text-xl">
                Join our community and start discovering music like never before.
              </p>
              <Link href="/catalog">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-lg font-bold">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
