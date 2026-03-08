import { connectDB } from "@/lib/mongodb"
import Project, { IProject } from "@/models/Project"

// Helper: convert Mongoose doc to plain object
function toPlain(doc: IProject) {
  const obj = doc.toObject({ versionKey: false })
  obj._id = obj._id.toString()
  return obj
}

export async function getProjects(category?: "dev" | "art") {
  await connectDB()
  const query = category ? { category } : {}
  const projects = await Project.find(query).sort({ completedAt: -1 }).lean()
  return projects.map((p) => ({ ...p, _id: p._id.toString() }))
}

export async function getFeaturedProjects(category?: "dev" | "art") {
  await connectDB()
  const query = category ? { category, featured: true } : { featured: true }
  const projects = await Project.find(query).sort({ completedAt: -1 }).lean()
  return projects.map((p) => ({ ...p, _id: p._id.toString() }))
}

export async function getProjectById(id: string) {
  await connectDB()
  const project = await Project.findById(id).lean()
  if (!project) return null
  return { ...project, _id: project._id.toString() }
}

export async function getRelatedProjects(id: string, limit = 3) {
  await connectDB()
  const project = await Project.findById(id).lean()
  if (!project) return []
  const related = await Project.find({ category: project.category, _id: { $ne: project._id } })
    .limit(limit)
    .lean()
  return related.map((p) => ({ ...p, _id: p._id.toString() }))
}

export async function getAllTags(category?: "dev" | "art"): Promise<string[]> {
  const projects = await getProjects(category)
  const tags = new Set<string>()
  projects.forEach((p) => p.tags.forEach((t: string) => tags.add(t)))
  return Array.from(tags).sort()
}

export async function createProject(
  data: Omit<IProject, "_id" | "createdAt" | "updatedAt">
) {
  await connectDB()
  const project = await Project.create(data)
  return toPlain(project)
}

export async function updateProject(id: string, updates: Partial<IProject>) {
  await connectDB()
  const project = await Project.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })
  if (!project) return null
  return toPlain(project)
}

export async function deleteProject(id: string): Promise<boolean> {
  await connectDB()
  const result = await Project.findByIdAndDelete(id)
  return result !== null
}