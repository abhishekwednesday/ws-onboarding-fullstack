"use client"

import { Menu, Music, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { ModeToggle } from "@/components/theme/ModeToggle"
import { UserMenu } from "@/features/auth/components/UserMenu"
import { useSession } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleToggleMobileMenu = () => setIsMobileMenuOpen((p) => !p)

  React.useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"
    const mql = window.matchMedia("(min-width: 768px)")
    const handleBreakpoint = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setIsMobileMenuOpen(false)
        document.body.style.overflow = "unset"
      }
    }
    mql.addEventListener("change", handleBreakpoint)
    return () => {
      document.body.style.overflow = "unset"
      mql.removeEventListener("change", handleBreakpoint)
    }
  }, [isMobileMenuOpen])

  React.useEffect(() => setIsMobileMenuOpen(false), [pathname])

  const links = [
    { name: "Home", href: "/", isActive: pathname === "/" },
    { name: "Catalog", href: "/catalog", isActive: pathname.startsWith("/catalog") },
  ]
  if (session) {
    links.push({ name: "Playlists", href: "/playlists", isActive: pathname.startsWith("/playlists") })
  }

  return (
    <>
      {/* Mobile Menu Overlay — rendered outside nav to avoid parent backdrop-filter context */}
      <div
        id="mobile-menu"
        aria-hidden={!isMobileMenuOpen}
        className={cn(
          "bg-background/95 fixed inset-0 z-[60] flex flex-col backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-in-out md:hidden",
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {/* Overlay header matching navbar */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center space-x-2.5">
            <div className="bg-primary/20 text-primary flex items-center justify-center rounded-xl p-2">
              <Music className="h-5 w-5" />
            </div>
            <span className="text-foreground font-serif text-lg font-bold tracking-tight">MusicStream</span>
          </Link>
          <button
            onClick={handleToggleMobileMenu}
            className="group border-border bg-muted/50 text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-8 pb-12">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">Navigation</p>
            <div className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "group flex items-center justify-between py-4 font-serif text-3xl font-medium tracking-tight transition-all",
                    link.isActive ? "text-primary" : "text-foreground/80 hover:text-foreground hover:translate-x-2"
                  )}
                >
                  <span>{link.name}</span>
                  <div
                    className={cn(
                      "bg-primary h-1.5 w-1.5 rounded-full transition-all duration-300",
                      link.isActive
                        ? "scale-100 opacity-100 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                        : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50"
                    )}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Social/Theme Section */}
          <div className="border-border space-y-8 border-t pt-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-foreground text-sm font-semibold">Appearance</p>
                <p className="text-muted-foreground text-xs">Toggle display modes</p>
              </div>
              <div className="border-border bg-muted/50 rounded-xl border p-1 backdrop-blur-md">
                <ModeToggle />
              </div>
            </div>

            <div>
              <Link
                href="/catalog"
                className="bg-primary text-primary-foreground flex items-center justify-center rounded-xl py-4 text-sm font-bold transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95"
              >
                Start Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-background/60 border-border sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex flex-1 items-center justify-start">
            <Link href="/" className="group flex items-center space-x-2.5 transition-opacity hover:opacity-90">
              <div className="bg-primary/20 text-primary flex items-center justify-center rounded-xl p-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Music className="h-5 w-5" />
              </div>
              <span className="text-foreground font-serif text-lg font-bold tracking-tight">MusicStream</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="border-border bg-muted/50 flex items-center gap-1 rounded-full border p-1 backdrop-blur-md">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300",
                    link.isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <UserMenu />
              <ModeToggle />
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <UserMenu />
              <button
                onClick={handleToggleMobileMenu}
                className="group border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5 rotate-0 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
