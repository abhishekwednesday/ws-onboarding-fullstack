import "styles/tailwind.css"
import { Suspense } from "react"

import { BasePage } from "@/components/layout/BasePage"
import { PostHogPageView } from "@/components/providers/PostHogPageView"
import { PostHogProvider } from "@/components/providers/PostHogProvider"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { ThemeProvider } from "@/components/theme/ThemeProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <PostHogProvider>
            <Suspense>
              <PostHogPageView />
            </Suspense>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <BasePage>{children}</BasePage>
            </ThemeProvider>
          </PostHogProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
