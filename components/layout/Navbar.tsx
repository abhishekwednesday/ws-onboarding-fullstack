"use client"

import { Music } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { ModeToggle } from "@/components/theme/ModeToggle"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-background/80 sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="group flex items-center space-x-2.5 transition-all hover:opacity-90">
            <div className="bg-primary flex transform items-center justify-center rounded-lg p-1.5 transition-transform duration-300 group-hover:scale-105">
              <Music className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight sm:inline-block">MusicStream</span>
          </Link>
        </div>

        {/* Centered Navigation Items */}
        <div className="hidden flex-1 items-center justify-center sm:flex">
          <div className="flex items-center gap-1 overflow-hidden rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm dark:border-white/5 dark:bg-black/20">
            <Link
              href="/"
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/catalog" || pathname.startsWith("/catalog/")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              Catalog
            </Link>
          </div>
        </div>

        {/* Theme Toggle / Right Actions */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="bg-border/50 hidden h-6 w-[1px] md:block" aria-hidden="true" />
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
