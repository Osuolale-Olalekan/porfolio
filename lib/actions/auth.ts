//this one has server actions
"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { connectDB } from "@/lib/mongodb"
import Admin from "@/models/Admin"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-this"
)
const COOKIE_NAME = "admin_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// ── Login ─────────────────────────────────────────────────────────────────────
export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get("email")?.toString().trim().toLowerCase()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  try {
    await connectDB()
    const admin = await Admin.findOne({ email })

    if (!admin) {
      return { error: "Invalid email or password." }
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return { error: "Invalid email or password." }
    }

    // Create JWT
    const token = await new SignJWT({ id: admin._id.toString(), email: admin.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Set secure cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    })
  } catch (err) {
    console.error("[login]", err)
    return { error: "Something went wrong. Please try again." }
  }

  // Must be outside try/catch — Next.js redirect() throws internally
  redirect("/admin")
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// ── Get current session (use in Server Components / layouts) ──────────────────
export async function getSession(): Promise<{ id: string; email: string } | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { id: string; email: string }
  } catch {
    return null
  }
}