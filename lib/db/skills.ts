import { connectDB } from "@/lib/mongodb"
import Skill, { ISkill } from "@/models/Skill"

function toPlain(doc: ISkill) {
  const obj = doc.toObject({ versionKey: false })
  obj._id = obj._id.toString()
  return obj
}

export async function getSkills(portfolioType?: "developer" | "artist") {
  await connectDB()
  const query = portfolioType
    ? { $or: [{ portfolioType }, { portfolioType: "both" }] }
    : {}
  const skills = await Skill.find(query).lean()
  return skills.map((s) => ({ ...s, _id: s._id.toString() }))
}

export async function createSkill(data: Omit<ISkill, "_id">) {
  await connectDB()
  const skill = await Skill.create(data)
  return toPlain(skill)
}

export async function updateSkill(id: string, updates: Partial<ISkill>) {
  await connectDB()
  const skill = await Skill.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })
  if (!skill) return null
  return toPlain(skill)
}

export async function deleteSkill(id: string): Promise<boolean> {
  await connectDB()
  const result = await Skill.findByIdAndDelete(id)
  return result !== null
}