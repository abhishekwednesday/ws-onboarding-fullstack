import "styles/tailwind.css"
import { BasePage } from "@/components/layout/BasePage"
import { ThemeProvider } from "@/components/theme/ThemeProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <BasePage>{children}</BasePage>
        </ThemeProvider>
      </body>
    </html>
  )
}
