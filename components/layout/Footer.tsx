import * as React from "react"

export function Footer() {
  return (
    <footer className="bg-background w-full border-t py-6 md:py-0">
      <div className="mx-auto flex h-24 max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
        <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
          &copy; {new Date().getFullYear()} MusicStream. All rights reserved.
        </p>
        <div className="text-muted-foreground flex items-center space-x-4 text-sm font-medium">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  )
}
