"use client"

// Mock database - Replace with MongoDB later
// This uses localStorage to persist data across sessions

const USE_LOCAL_STORAGE = false // Set to true to enable localStorage persistence


export interface Project {
  _id: string
  title: string
  description: string
  longDescription?: string
  category: "developer" | "artist"
  tags: string[]
  image: string
  gallery?: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Profile {
  _id: string
  name: string
  title: string
  bio: string
  avatar: string
  email: string
  location: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    dribbble?: string
    behance?: string
  }
  stats: {
    yearsExperience: number
    projectsCompleted: number
    happyClients: number
  }
}

export interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
  portfolioType: "developer" | "artist" | "both"
}

// Initial mock data
const initialProjects: Project[] = [
  {
    _id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with Next.js, Stripe, and MongoDB",
    longDescription: "Built a comprehensive e-commerce platform featuring user authentication, product management, shopping cart, Stripe payment integration, and an admin dashboard. The platform handles thousands of daily transactions with 99.9% uptime.",
    category: "developer",
    tags: ["Next.js", "TypeScript", "MongoDB", "Stripe", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    gallery: [],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/ecommerce",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Task Management App",
    description: "Real-time collaborative task management with drag-and-drop",
    longDescription: "A Trello-like task management application with real-time updates, team collaboration features, and intuitive drag-and-drop interface.",
    category: "developer",
    tags: ["React", "Node.js", "Socket.io", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    gallery: [],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/tasks",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "AI Dashboard",
    description: "Analytics dashboard with AI-powered insights and predictions",
    longDescription: "An intelligent analytics dashboard that uses machine learning to provide actionable insights and predictions based on user data.",
    category: "developer",
    tags: ["Python", "React", "TensorFlow", "D3.js"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    gallery: [],
    liveUrl: "https://example.com",
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Fantasy Landscape",
    description: "Digital painting of a mystical forest at dawn",
    longDescription: "A detailed digital painting created in Procreate, featuring a mystical forest scene with ethereal lighting and magical creatures.",
    category: "artist",
    tags: ["Digital Art", "Procreate", "Fantasy", "Landscape"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
    gallery: [],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Character Design Series",
    description: "Original character designs for a fantasy game project",
    longDescription: "A series of character designs created for an indie game studio, featuring unique warriors, mages, and mythical creatures.",
    category: "artist",
    tags: ["Character Design", "Illustration", "Fantasy", "Game Art"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    gallery: [],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Brand Identity Package",
    description: "Complete branding for a tech startup including logo and guidelines",
    longDescription: "Developed comprehensive brand identity including logo design, color palette, typography system, and brand guidelines for a Silicon Valley startup.",
    category: "artist",
    tags: ["Branding", "Logo Design", "Typography", "Identity"],
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
    gallery: [],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const initialProfile: Profile = {
  _id: "1",
  name: "Osuolale Olalekan Abayomi",
  title: "Full-Stack Developer & Digital Artist",
  bio: "I'm a passionate creator who bridges the gap between code and creativity. With over 5 years of experience in web development and digital art, I craft beautiful, functional digital experiences that leave lasting impressions.",
  // avatar: "https://res.cloudinary.com/dvgfumpoj/image/upload/v1771279306/file_00000000769c620a993cad3a2b51b4b2_fkbnnf.png",
  avatar: "https://res.cloudinary.com/dvgfumpoj/image/upload/v1771280131/photoProfile_wiuchy.jpg",
  email: "osuolaleolalek7@gmail.com",
  location: "Osogbo, Nigeria",
  socialLinks: {
    github: "https://github.com/Osuolale-Olalekan",
    linkedin: "https://www.linkedin.com/in/olalekanabayomi",
    twitter: "https://x.com/OsuolaleOlalek5",
    instagram: "https://www.instagram.com/olalekan_gallery",
    // dribbble: "https://dribbble.com/johndoe",
    // behance: "https://behance.net/johndoe",
  },
  stats: {
    yearsExperience: 5,
    projectsCompleted: 5,
    happyClients: 30,
  },
}

const initialSkills: Skill[] = [
  { _id: "1", name: "React / Next.js", category: "Frontend", proficiency: 95, portfolioType: "developer" },
  { _id: "2", name: "TypeScript", category: "Frontend", proficiency: 90, portfolioType: "developer" },
  { _id: "3", name: "Tailwind CSS", category: "Frontend", proficiency: 95, portfolioType: "developer" },
  { _id: "4", name: "Node.js", category: "Backend", proficiency: 85, portfolioType: "developer" },
  { _id: "5", name: "Python", category: "Backend", proficiency: 80, portfolioType: "developer" },
  { _id: "6", name: "MongoDB", category: "Database", proficiency: 85, portfolioType: "developer" },
  { _id: "7", name: "PostgreSQL", category: "Database", proficiency: 80, portfolioType: "developer" },
  { _id: "8", name: "AWS / Vercel", category: "DevOps", proficiency: 75, portfolioType: "developer" },
  { _id: "9", name: "Digital Painting", category: "Art", proficiency: 90, portfolioType: "artist" },
  { _id: "10", name: "Character Design", category: "Art", proficiency: 85, portfolioType: "artist" },
  { _id: "11", name: "Procreate", category: "Tools", proficiency: 95, portfolioType: "artist" },
  { _id: "12", name: "Adobe Photoshop", category: "Tools", proficiency: 90, portfolioType: "artist" },
  { _id: "13", name: "Adobe Illustrator", category: "Tools", proficiency: 85, portfolioType: "artist" },
  { _id: "14", name: "Figma", category: "Tools", proficiency: 90, portfolioType: "both" },
]

// Storage keys
const STORAGE_KEYS = {
  projects: "portfolio_projects",
  profile: "portfolio_profile",
  skills: "portfolio_skills",
  adminAuth: "portfolio_admin_auth",
}

// Helper to check if we're on the client
const isClient = typeof window !== "undefined"

// Mock Database Functions
export const mockDb = {
  // Projects
  getProjects: (): Project[] => {
    if (!isClient || !USE_LOCAL_STORAGE) return initialProjects
    const stored = localStorage.getItem(STORAGE_KEYS.projects)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(initialProjects))
    return initialProjects
  },

  getProject: (id: string): Project | null => {
    const projects = mockDb.getProjects()
    return projects.find((p) => p._id === id) || null
  },

  createProject: (project: Omit<Project, "_id" | "createdAt" | "updatedAt">): Project => {
    const projects = mockDb.getProjects()
    const newProject: Project = {
      ...project,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    projects.push(newProject)
    if (isClient) localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
    return newProject
  },

  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const projects = mockDb.getProjects()
    const index = projects.findIndex((p) => p._id === id)
    if (index === -1) return null
    projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() }
    if (isClient) localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
    return projects[index]
  },

  deleteProject: (id: string): boolean => {
    const projects = mockDb.getProjects()
    const filtered = projects.filter((p) => p._id !== id)
    if (filtered.length === projects.length) return false
    if (isClient) localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(filtered))
    return true
  },

  // Profile
  getProfile: (): Profile => {
    if (!isClient || !USE_LOCAL_STORAGE) return initialProfile
    const stored = localStorage.getItem(STORAGE_KEYS.profile)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(initialProfile))
    return initialProfile
  },

  updateProfile: (updates: Partial<Profile>): Profile => {
    const profile = mockDb.getProfile()
    const updated = { ...profile, ...updates }
    if (isClient) localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updated))
    return updated
  },

  // Skills
  getSkills: (): Skill[] => {
    if (!isClient || !USE_LOCAL_STORAGE  ) return initialSkills
    const stored = localStorage.getItem(STORAGE_KEYS.skills)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(initialSkills))
    return initialSkills
  },

  createSkill: (skill: Omit<Skill, "_id">): Skill => {
    const skills = mockDb.getSkills()
    const newSkill: Skill = { ...skill, _id: Date.now().toString() }
    skills.push(newSkill)
    if (isClient) localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(skills))
    return newSkill
  },

  updateSkill: (id: string, updates: Partial<Skill>): Skill | null => {
    const skills = mockDb.getSkills()
    const index = skills.findIndex((s) => s._id === id)
    if (index === -1) return null
    skills[index] = { ...skills[index], ...updates }
    if (isClient) localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(skills))
    return skills[index]
  },

  deleteSkill: (id: string): boolean => {
    const skills = mockDb.getSkills()
    const filtered = skills.filter((s) => s._id !== id)
    if (filtered.length === skills.length) return false
    if (isClient) localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(filtered))
    return true
  },

  // Auth (mock - replace with real auth later)
  isAuthenticated: (): boolean => {
    if (!isClient) return false
    return localStorage.getItem(STORAGE_KEYS.adminAuth) === "true"
  },

  login: (password: string): boolean => {
    // Mock password - in production, use proper auth
    if (password === "admin123") {
      if (isClient) localStorage.setItem(STORAGE_KEYS.adminAuth, "true")
      return true
    }
    return false
  },

  logout: (): void => {
    if (isClient) localStorage.removeItem(STORAGE_KEYS.adminAuth)
  },

  // Reset to initial data
  resetData: (): void => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(initialProjects))
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(initialProfile))
      localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(initialSkills))
    }
  },
}
