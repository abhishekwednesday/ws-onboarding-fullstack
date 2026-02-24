"use client"

import { Menu, Music, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { ModeToggle } from "@/components/theme/ModeToggle"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Close mobile menu on path change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="bg-background/60 sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="group flex items-center space-x-2.5 transition-opacity hover:opacity-90">
            <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex transform items-center justify-center rounded-xl p-2 transition-transform duration-300 group-hover:scale-105">
              <Music className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">MusicStream</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm dark:border-white/5 dark:bg-black/20">
            <Link
              href="/"
              className={cn(
                "rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200",
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
                "rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200",
                pathname === "/catalog" || pathname.startsWith("/catalog/")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              Catalog
            </Link>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden md:flex">
            <ModeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="bg-background/95 fixed inset-0 top-16 z-40 p-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col space-y-6">
            <Link
              href="/"
              className={cn(
                "text-2xl font-semibold transition-colors",
                pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className={cn(
                "text-2xl font-semibold transition-colors",
                pathname === "/catalog" || pathname.startsWith("/catalog/")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Catalog
            </Link>
            <div className="pt-4">
              <div className="text-muted-foreground flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                <span>Switch Theme</span>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
