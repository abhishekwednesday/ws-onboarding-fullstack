"use client"

import { Music, Search } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { ModeToggle } from "@/components/theme/ModeToggle"
import { Input } from "@/components/ui/input"

export function Navbar() {
  return (
    <nav className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="bg-primary text-primary-foreground rounded-xl p-1.5">
              <Music className="h-5 w-5" />
            </div>
            <span className="text-foreground hidden text-xl font-bold tracking-tight sm:inline-block">MusicStream</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link
              href="/catalog"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              Catalog
            </Link>
          </div>
        </div>

        <div className="flex max-w-sm flex-1 items-center justify-center px-2">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search artists, tracks..."
              className="bg-muted/50 focus:bg-background w-full pl-9 transition-all md:w-[300px] lg:w-[400px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
