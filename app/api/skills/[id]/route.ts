import { NextRequest, NextResponse } from "next/server"
import { updateSkill, deleteSkill } from "@/lib/db/skills"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = await updateSkill(id, body)

    if (!updated) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PATCH /api/skills/:id]", error)
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await deleteSkill(id)

    if (!deleted) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/skills/:id]", error)
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
  }
}