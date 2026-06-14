// proxy.ts
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-this"
)

const PROTECTED_API_ROUTES = [
  "/api/profile",
  "/api/projects",
  "/api/skills",
  "/api/upload",
]

async function verifyToken(token: string) {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page through
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Protect all /admin pages
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_session")?.value

    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    return NextResponse.next()
  }

  // Protect write API routes (POST, PATCH, DELETE)
  // GET stays public so portfolio visitors can load your data
  const isProtectedApi = PROTECTED_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedApi && request.method !== "GET") {
    const token = request.cookies.get("admin_session")?.value

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/profile/:path*",
    "/api/projects/:path*",
    "/api/skills/:path*",
    "/api/upload/:path*",
  ],
}

// This file is a Next.js middleware that protects admin routes and certain API endpoints using JWT authentication. It checks for a valid token in the cookies and redirects to the login page if authentication fails.
// import { NextRequest, NextResponse } from "next/server"
// import { jwtVerify } from "jose"

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET ?? "fallback-secret-change-this"
// )

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Allow login page through — no auth needed
//   if (pathname === "/admin/login") {
//     return NextResponse.next()
//   }

//   // Protect all other /admin routes
//   if (pathname.startsWith("/admin")) {
//     const token = request.cookies.get("admin_session")?.value

//     if (!token) {
//       return NextResponse.redirect(new URL("/admin/login", request.url))
//     }

//     try {
//       await jwtVerify(token, JWT_SECRET)
//       return NextResponse.next()
//     } catch {
//       // Token invalid or expired
//       return NextResponse.redirect(new URL("/admin/login", request.url))
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// }