import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Rate limiting store (in-memory for development, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per minute

function rateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Rate limiting for API routes
    if (path.startsWith("/api/")) {
      const identifier = token?.email || req.ip || "anonymous"
      if (!rateLimit(identifier)) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        )
      }
    }

    // Add security headers
    const response = NextResponse.next()

    // Security headers
    response.headers.set("X-DNS-Prefetch-Control", "on")
    response.headers.set("X-Frame-Options", "SAMEORIGIN")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    )
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    )
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
    )

    // Allow root path
    if (path === "/") {
      return response
    }

    // Role-based access control for specific routes
    const roleBasedRoutes: Record<string, string[]> = {
      "/admin": ["Administrator"],
      "/api/users": ["Administrator"],
      "/api/audit-logs": ["Administrator"],
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

    return response
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