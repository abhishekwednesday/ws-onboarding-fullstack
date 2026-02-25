import type { Session } from "better-auth/types"
import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/playlists"]
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname

  const isBoundaryMatch = (route: string) => pathName === route || pathName.startsWith(route + "/")

  const isProtectedRoute = protectedRoutes.some(isBoundaryMatch)
  const isAuthRoute = authRoutes.some(isBoundaryMatch)

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // In Next.js middleware (Edge Runtime), we cannot use the Node.js pg adapter directly.
  // We must hit our own Next.js API route to validate the session.
  let session: Session | null = null
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    })
    session = response.ok ? ((await response.json()) as Session) : null
  } catch (error) {
    // Treat any network or parse error as an unauthenticated state
    session = null
  }

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
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
