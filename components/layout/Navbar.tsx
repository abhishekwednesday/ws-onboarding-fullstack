"use client"

import Link from "next/link"
import * as React from "react"
import { ModeToggle } from "@/components/theme/ModeToggle"

export function Navbar() {
  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">MusicStream</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link href="/" className="hover:text-primary text-sm font-medium transition-colors">
              Home
            </Link>
            <Link
              href="/catalog"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              Catalog
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
