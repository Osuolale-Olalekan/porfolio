import { NextRequest, NextResponse } from "next/server"
import { getProfile, updateProfile } from "@/lib/db/profile"

export async function GET() {
  try {
    const profile = await getProfile()
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }
    return NextResponse.json(profile)
  } catch (error) {
    console.error("[GET /api/profile]", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// Had to disable this endpoint for now because of the body parsing issue in Next 14. Will re-enable once that's resolved.
// export async function PATCH(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const updated = await updateProfile(body)
//     return NextResponse.json(updated)
//   } catch (error) {
//     console.error("[PATCH /api/profile]", error)
//     return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
//   }
// }

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    // Only pick fields you explicitly allow
    const allowedFields = {
      name: body.name,
      title: body.title,
      bio: body.bio,
      avatar: body.avatar,
      avatarPosition: body.avatarPosition,
      email: body.email,
      location: body.location,
      socialLinks: body.socialLinks,
      stats: body.stats,
    }

    // Strip out undefined fields
    const sanitized = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
    )

    const updated = await updateProfile(sanitized)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PATCH /api/profile]", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}