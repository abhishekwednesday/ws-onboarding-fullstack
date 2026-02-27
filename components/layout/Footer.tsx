import { Music } from "lucide-react"
import Link from "next/link"
import * as React from "react"

export function Footer() {
  return (
    <footer className="border-border/40 relative mt-auto overflow-hidden border-t py-12">
      <div className="from-primary/5 pointer-events-none absolute inset-x-0 top-1/2 bottom-0 bg-gradient-to-t to-transparent opacity-50" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-6 md:flex-row lg:px-8">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <div className="text-foreground flex items-center gap-2">
            <Music className="text-primary h-4 w-4" />
            <span className="font-serif font-medium tracking-wide">MusicStream</span>
          </div>
          <p className="text-muted-foreground font-sans text-[10px] font-medium tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div className="text-muted-foreground flex items-center space-x-8 text-xs font-semibold tracking-wider uppercase">
          <Link href="/privacy" className="hover:text-primary transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors duration-300">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
