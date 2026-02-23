import * as React from "react"
import { Footer } from "./Footer"
import { Navbar } from "./Navbar"

export function BasePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
