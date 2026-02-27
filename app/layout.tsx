import "styles/tailwind.css"
import { Outfit, Playfair_Display } from "next/font/google"
import { Suspense } from "react"

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })

import { BasePage } from "@/components/layout/BasePage"
import { GlobalSyncProvider } from "@/components/providers/GlobalSyncProvider"
import { PostHogPageView } from "@/components/providers/PostHogPageView"
import { PostHogProvider } from "@/components/providers/PostHogProvider"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <PostHogProvider>
            <Suspense>
              <PostHogPageView />
            </Suspense>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <GlobalSyncProvider />
              <BasePage>{children}</BasePage>
              <Toaster />
            </ThemeProvider>
          </PostHogProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
