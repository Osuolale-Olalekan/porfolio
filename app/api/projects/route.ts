import { NextRequest, NextResponse } from "next/server"
import { getProjects, getFeaturedProjects, createProject } from "@/lib/db/projects"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category") as "dev" | "art" | null
    const featured = searchParams.get("featured")

    const projects = featured === "true"
      ? await getFeaturedProjects(category ?? undefined)
      : await getProjects(category ?? undefined)

    return NextResponse.json(projects)
  } catch (error) {
    console.error("[GET /api/projects]", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const project = await createProject(body)
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("[POST /api/projects]", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

// import { NextRequest, NextResponse } from "next/server"

// export interface Project {
//   id: string
//   title: string
//   description: string
//   longDescription?: string
//   image: string
//   category: "web" | "mobile" | "illustration" | "3d" | "branding"
//   type: "developer" | "artist"
//   technologies: string[]
//   link?: string
//   github?: string
//   behance?: string
//   featured: boolean
//   year: number
// }

// const projects: Project[] = [
//   {
//     id: "ecommerce-platform",
//     title: "E-Commerce Platform",
//     description: "A full-stack e-commerce solution with real-time inventory management",
//     longDescription: "Built a comprehensive e-commerce platform featuring real-time inventory tracking, secure payment processing with Stripe, and an intuitive admin dashboard. The platform handles thousands of concurrent users with optimized database queries and caching strategies.",
//     image: "/projects/ecommerce.jpg",
//     category: "web",
//     type: "developer",
//     technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Redis"],
//     link: "https://example.com",
//     github: "https://github.com",
//     featured: true,
//     year: 2025,
//   },
//   {
//     id: "ai-dashboard",
//     title: "AI Analytics Dashboard",
//     description: "Real-time analytics dashboard powered by machine learning",
//     longDescription: "Developed an AI-powered analytics dashboard that processes and visualizes large datasets in real-time. Features include predictive analytics, anomaly detection, and customizable reporting tools.",
//     image: "/projects/ai-dashboard.jpg",
//     category: "web",
//     type: "developer",
//     technologies: ["React", "Python", "TensorFlow", "D3.js", "AWS"],
//     link: "https://example.com",
//     github: "https://github.com",
//     featured: true,
//     year: 2025,
//   },
//   {
//     id: "mobile-fitness",
//     title: "Fitness Tracking App",
//     description: "Cross-platform mobile app for health and fitness tracking",
//     longDescription: "Created a cross-platform fitness application with features like workout tracking, nutrition logging, and social challenges. Integrated with wearable devices for real-time health monitoring.",
//     image: "/projects/fitness-app.jpg",
//     category: "mobile",
//     type: "developer",
//     technologies: ["React Native", "Node.js", "MongoDB", "Firebase"],
//     link: "https://example.com",
//     featured: true,
//     year: 2024,
//   },
//   {
//     id: "fantasy-world",
//     title: "Fantasy World Series",
//     description: "Digital illustration series exploring magical landscapes",
//     longDescription: "A collection of 12 digital paintings depicting fantastical worlds filled with floating islands, ancient forests, and mythical creatures. Each piece took approximately 40 hours to complete.",
//     image: "/projects/fantasy.jpg",
//     category: "illustration",
//     type: "artist",
//     technologies: ["Photoshop", "Procreate", "Blender"],
//     behance: "https://behance.net",
//     featured: true,
//     year: 2025,
//   },
//   {
//     id: "character-design",
//     title: "Character Design Collection",
//     description: "Original character designs for games and animation",
//     longDescription: "Designed over 50 unique characters for various game and animation projects. Each character includes full turnaround sheets, expression studies, and costume variations.",
//     image: "/projects/characters.jpg",
//     category: "illustration",
//     type: "artist",
//     technologies: ["Procreate", "Clip Studio Paint", "Photoshop"],
//     behance: "https://behance.net",
//     featured: true,
//     year: 2025,
//   },
//   {
//     id: "3d-environments",
//     title: "3D Environment Art",
//     description: "Stylized 3D environments for indie games",
//     longDescription: "Created immersive 3D environments combining hand-painted textures with modern lighting techniques. These assets have been used in multiple published indie games.",
//     image: "/projects/3d-env.jpg",
//     category: "3d",
//     type: "artist",
//     technologies: ["Blender", "Substance Painter", "Unity"],
//     behance: "https://behance.net",
//     featured: true,
//     year: 2024,
//   },
//   {
//     id: "brand-identity",
//     title: "Brand Identity System",
//     description: "Complete brand identity for tech startup",
//     longDescription: "Developed a comprehensive brand identity including logo design, color palette, typography system, and brand guidelines. The design system was implemented across all digital and print materials.",
//     image: "/projects/branding.jpg",
//     category: "branding",
//     type: "artist",
//     technologies: ["Illustrator", "Figma", "After Effects"],
//     behance: "https://behance.net",
//     featured: false,
//     year: 2024,
//   },
//   {
//     id: "saas-platform",
//     title: "SaaS Management Platform",
//     description: "Enterprise SaaS platform for team collaboration",
//     longDescription: "Built a scalable SaaS platform enabling enterprise teams to collaborate on projects with features like real-time editing, version control, and automated workflows.",
//     image: "/projects/saas.jpg",
//     category: "web",
//     type: "developer",
//     technologies: ["Next.js", "GraphQL", "PostgreSQL", "Docker", "Kubernetes"],
//     link: "https://example.com",
//     github: "https://github.com",
//     featured: false,
//     year: 2024,
//   },
// ]

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const type = searchParams.get("type")
//   const category = searchParams.get("category")
//   const featured = searchParams.get("featured")

//   let filteredProjects = [...projects]

//   if (type) {
//     filteredProjects = filteredProjects.filter((p) => p.type === type)
//   }

//   if (category) {
//     filteredProjects = filteredProjects.filter((p) => p.category === category)
//   }

//   if (featured === "true") {
//     filteredProjects = filteredProjects.filter((p) => p.featured)
//   }

//   return NextResponse.json(filteredProjects)
// }
