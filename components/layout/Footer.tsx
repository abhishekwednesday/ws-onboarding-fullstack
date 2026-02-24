import Link from "next/link"
import * as React from "react"

export function Footer() {
  return (
    <footer className="bg-background w-full border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-sm font-semibold tracking-tight">MusicStream</p>
          <p className="text-muted-foreground text-xs">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="text-muted-foreground flex items-center space-x-8 text-xs font-medium">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
