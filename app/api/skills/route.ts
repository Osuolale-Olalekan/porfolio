import { NextRequest, NextResponse } from "next/server"
import { getSkills, createSkill } from "@/lib/db/skills"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const portfolioType = searchParams.get("portfolioType") as "developer" | "artist" | null

    const skills = await getSkills(portfolioType ?? undefined)
    return NextResponse.json(skills)
  } catch (error) {
    console.error("[GET /api/skills]", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const skill = await createSkill(body)
    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error("[POST /api/skills]", error)
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}