import type { Session } from "better-auth/types"
import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/playlists"]
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname

  const isBoundaryMatch = (route: string) => pathName === route || pathName.startsWith(route + "/")

  const isProtectedRoute = protectedRoutes.some(isBoundaryMatch)
  const isAuthRoute = authRoutes.some(isBoundaryMatch)

  let response: NextResponse

  if (!isProtectedRoute && !isAuthRoute) {
    response = NextResponse.next()
  } else {
    // In Next.js middleware (Edge Runtime), we cannot use the Node.js pg adapter directly.
    // We must hit our own Next.js API route to validate the session.
    let session: Session | null = null
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const fetchResponse = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      session = fetchResponse.ok ? ((await fetchResponse.json()) as Session) : null
    } catch (error) {
      // Treat any network or parse error as an unauthenticated state
      console.warn("Middleware session fetch failed or timed out:", error)
      session = null
    }

    if (isProtectedRoute && !session) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname + request.nextUrl.search)
      response = NextResponse.redirect(loginUrl)
    } else if (isAuthRoute && session) {
      response = NextResponse.redirect(new URL("/", request.url))
    } else {
      response = NextResponse.next()
    }
  }

  // Geolocation: Set country cookie if not present
  if (!request.cookies.has("x-user-country")) {
    const geoRequest = request as NextRequest & { geo?: { country?: string } }
    const country = geoRequest.geo?.country || request.headers.get("x-vercel-ip-country") || "US"
    response.cookies.set("x-user-country", country)
  }

  return response
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
