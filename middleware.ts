import { betterFetch } from "@better-fetch/fetch"
import type { Session } from "better-auth/types"
import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/playlists"]
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => pathName.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathName.startsWith(route))

  // In Next.js middleware (Edge Runtime), we cannot use the Node.js pg adapter directly.
  // We must hit our own Next.js API route to validate the session.
  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      // Pass the cookie forward so the server can validate it
      cookie: request.headers.get("cookie") || "",
    },
  })

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
