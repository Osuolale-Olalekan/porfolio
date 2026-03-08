import projectsData from "@/data/projects.json"
import profileData from "@/data/profile.json"
import skillsData from "@/data/skills.json"

export type Project = {
  id: string
  title: string
  description: string
  longDescription: string
  category: "dev" | "art"
  tags: string[]
  image: string
  gallery: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
  completedAt: string
}

export type Profile = typeof profileData
export type Skills = typeof skillsData

export function getProjects(category?: "dev" | "art"): Project[] {
  if (category) {
    return projectsData.projects.filter((p) => p.category === category) as Project[]
  }
  return projectsData.projects as Project[]
}

export function getFeaturedProjects(category?: "dev" | "art"): Project[] {
  const projects = getProjects(category)
  return projects.filter((p) => p.featured)
}

export function getProjectById(id: string): Project | undefined {
  return projectsData.projects.find((p) => p.id === id) as Project | undefined
}

export function getRelatedProjects(id: string, limit = 3): Project[] {
  const project = getProjectById(id)
  if (!project) return []
  
  return projectsData.projects
    .filter((p) => p.id !== id && p.category === project.category)
    .slice(0, limit) as Project[]
}

export function getProfile(): Profile {
  return profileData
}

export function getSkills(category: "dev" | "art") {
  return skillsData[category]
}

export function getAllTags(category?: "dev" | "art"): string[] {
  const projects = getProjects(category)
  const tags = new Set<string>()
  projects.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}
