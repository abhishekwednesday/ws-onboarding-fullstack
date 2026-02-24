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

  // Disable scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

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
            className="group text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 rotate-0 transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <Menu className="h-5 w-5 rotate-0 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "bg-background/90 fixed inset-0 z-40 flex flex-col backdrop-blur-2xl transition-all duration-500 ease-in-out md:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        )}
        style={{ top: "4rem", height: "calc(100vh - 4rem)" }}
      >
        <div className="flex flex-1 flex-col justify-between p-8 pb-12">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase opacity-50">
              Navigation
            </p>
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className={cn(
                  "group flex items-center justify-between py-4 text-3xl font-bold tracking-tight transition-all",
                  pathname === "/" ? "text-primary" : "text-foreground hover:translate-x-2"
                )}
              >
                <span>Home</span>
                <div
                  className={cn(
                    "bg-primary h-1.5 w-1.5 rounded-full transition-all duration-300",
                    pathname === "/"
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50"
                  )}
                />
              </Link>
              <Link
                href="/catalog"
                className={cn(
                  "group flex items-center justify-between py-4 text-3xl font-bold tracking-tight transition-all",
                  pathname === "/catalog" || pathname.startsWith("/catalog/")
                    ? "text-primary"
                    : "text-foreground hover:translate-x-2"
                )}
              >
                <span>Catalog</span>
                <div
                  className={cn(
                    "bg-primary h-1.5 w-1.5 rounded-full transition-all duration-300",
                    pathname === "/catalog" || pathname.startsWith("/catalog/")
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50"
                  )}
                />
              </Link>
            </div>
          </div>

          {/* Social/Theme Section */}
          <div className="space-y-8 border-t border-white/10 pt-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Appearance</p>
                <p className="text-muted-foreground text-xs">Toggle between light and dark modes</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
                <ModeToggle />
              </div>
            </div>

            <div>
              <Link
                href="/catalog"
                className="bg-primary text-primary-foreground flex items-center justify-center rounded-xl py-4 text-sm font-bold transition-transform active:scale-95"
              >
                Start Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
