import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Allow root path
    if (path === "/") {
      return NextResponse.next()
    }

    // Role-based access control for specific routes
    const roleBasedRoutes: Record<string, string[]> = {
      "/admin": ["Administrator"],
      "/api/users": ["Administrator"],
      "/api/roles": ["Administrator", "Agency", "Central Cash", "Tunisia Security"],
      "/api/agencies": ["Administrator", "Agency", "Central Cash", "Tunisia Security"],
      "/central-cash": ["Central Cash"],
      "/tunisia-security": ["Tunisia Security"],
      "/agency": ["Agency"],
    }

    for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
      if (path.startsWith(route)) {
        if (!token || !allowedRoles.includes(token.role as string)) {
          return NextResponse.redirect(new URL("/unauthorized", req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public paths
        if (path === "/" || path.startsWith("/login") || path.startsWith("/api/auth")) {
          return true
        }

        // All other paths require authentication
        return !!token
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Logo and public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
  ],
}