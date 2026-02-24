"use client"

import { Music } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { ModeToggle } from "@/components/theme/ModeToggle"

export function Navbar() {
  return (
    <nav className="bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center space-x-2.5 transition-all hover:opacity-90">
            <div className="bg-primary shadow-primary/20 flex transform items-center justify-center rounded-xl p-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:inline-block">
              MusicStream
            </span>
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <Link
              href="/catalog"
              className="hover:bg-accent hover:text-accent-foreground rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200"
            >
              Catalog
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-border hidden h-6 w-[1px] md:block" aria-hidden="true" />
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
