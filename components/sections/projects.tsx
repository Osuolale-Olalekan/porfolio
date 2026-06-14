"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePortfolio } from "@/lib/portfolio-context"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Project = {
  _id: string
  title: string
  description: string
  category: "dev" | "art"
  tags: string[]
  image: string
  featured: boolean
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -10
    const rotateY = ((x - cx) / cx) * 10
    const glowX = (x / rect.width) * 100
    const glowY = (y / rect.height) * 100
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
    card.style.setProperty("--glow-x", `${glowX}%`)
    card.style.setProperty("--glow-y", `${glowY}%`)
    card.style.setProperty("--glow-opacity", "1")
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)`
    card.style.setProperty("--glow-opacity", "0")
  }

  return (
    <div
      className="project-card-outer"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        ref={cardRef}
        className="project-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-spotlight" />

        <div className="card-image-wrap">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="card-img"
            />
          ) : (
            <div className="card-img-placeholder">
              <span>{project.title.charAt(0)}</span>
            </div>
          )}

          <div className="card-overlay">
            <span className="card-overlay-cta">
              View Project <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          {project.featured && (
            <Badge className="card-badge">Featured</Badge>
          )}
        </div>

        <div className="card-body">
          <h3 className="card-title">{project.title}</h3>
          <p className="card-desc">{project.description}</p>
          <div className="card-tags">
            {(project.tags ?? []).slice(0, 3).map((tag) => (
              <span key={tag} className="card-tag">{tag}</span>
            ))}
            {(project.tags ?? []).length > 3 && (
              <span className="card-tag">+{project.tags.length - 3}</span>
            )}
          </div>
        </div>

        <div className="card-edge-shine" />
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="project-card-outer">
      <div className="project-card skeleton-card">
        <div className="skeleton-img" />
        <div className="card-body">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-short" />
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const portfolio = usePortfolio()
  const activePortfolio = portfolio?.activePortfolio

  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const currentCategory = activePortfolio === "developer" ? "dev" : "art"

  // useEffect(() => {
  //   let cancelled = false

  //   setLoading(true)
  //   setError(null)

  //   fetch(`/api/projects?category=${currentCategory}`)
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(`Request failed with status ${res.status}`)
  //       }
  //       return res.json()
  //     })
  //     .then((data) => {
  //       if (cancelled) return
  //       const list: Project[] = Array.isArray(data)
  //         ? data
  //         : Array.isArray(data?.projects)
  //         ? data.projects
  //         : []
  //       setProjects(list)
  //       setFilter("all")
  //     })
  //     .catch((err) => {
  //       if (cancelled) return
  //       console.error("Failed to load projects:", err)
  //       setError("Couldn't load projects right now. Please try again later.")
  //       setProjects([])
  //     })
  //     .finally(() => {
  //       if (!cancelled) setLoading(false)
  //     })

  //   return () => {
  //     cancelled = true
  //   }
  // }, [currentCategory])
  useEffect(() => {
  let cancelled = false

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/projects?category=${currentCategory}`)
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      const data = await res.json()
      if (cancelled) return
      const list: Project[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.projects)
        ? data.projects
        : []
      setProjects(list)
      setFilter("all")
    } catch (err) {
      if (cancelled) return
      console.error("Failed to load projects:", err)
      setError("Couldn't load projects right now. Please try again later.")
      setProjects([])
    } finally {
      if (!cancelled) setLoading(false)
    }
  }

  fetchProjects()

  return () => { cancelled = true }
}, [currentCategory])

  // Intersection observer for section entrance
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const tags = Array.from(new Set(projects.flatMap((p) => p.tags ?? []))).slice(0, 5)
  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => (p.tags ?? []).includes(filter))

  return (
    <section
      id="work"
      ref={sectionRef}
      className={cn("projects-section", visible && "projects-visible")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 projects-header">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
            Selected Work
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            My Projects
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-7 sm:mb-8" />

          {!loading && !error && tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {["all", ...tags].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    filter === tag
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {tag === "all" ? "All" : tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="projects-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            <div className="projects-grid">
              {filteredProjects.slice(0, 6).map((project, i) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className="project-link"
                >
                  <ProjectCard project={project} index={i} />
                </Link>
              ))}
            </div>

            {projects.length > 6 && (
              <div className="text-center mt-12 sm:mt-16">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:scale-95"
                >
                  View All Projects <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No projects found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .projects-section {
          padding: 64px 0;
          background: hsl(var(--muted) / 0.3);
          overflow: hidden;
        }
        @media (min-width: 640px)  { .projects-section { padding: 80px 0; } }
        @media (min-width: 1024px) { .projects-section { padding: 128px 0; } }

        .projects-header {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .projects-visible .projects-header {
          opacity: 1;
          transform: translateY(0);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 640px)  { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .projects-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

        .project-link {
          display: block;
          text-decoration: none;
        }

        .project-card-outer {
          opacity: 0;
          transform: translateY(40px) rotateX(8deg) scale(0.96);
          transition:
            opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .projects-visible .project-card-outer {
          opacity: 1;
          transform: translateY(0) rotateX(0deg) scale(1);
        }

        .project-card {
          position: relative;
          border-radius: 16px;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          overflow: hidden;
          transform-style: preserve-3d;
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            border-color 0.18s ease;
          will-change: transform;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-opacity: 0;
        }
        .project-card:hover {
          box-shadow:
            0 20px 48px rgba(0,0,0,0.14),
            0 4px 16px hsl(var(--primary) / 0.15);
          border-color: hsl(var(--primary) / 0.4);
        }

        .card-spotlight {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          border-radius: inherit;
          background: radial-gradient(
            280px circle at var(--glow-x) var(--glow-y),
            hsl(var(--primary) / 0.10),
            transparent 70%
          );
          opacity: var(--glow-opacity);
          transition: opacity 0.3s ease;
        }

        .card-image-wrap {
          position: relative;
          aspect-ratio: 16 / 9;
          background: hsl(var(--muted));
          overflow: hidden;
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translateZ(0);
        }
        .project-card:hover .card-img {
          transform: scale(1.07) translateZ(0);
        }
        .card-img-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.05));
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-img-placeholder span {
          font-size: 48px;
          font-weight: 800;
          color: hsl(var(--primary) / 0.28);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: hsl(var(--foreground) / 0.78);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }
        .project-card:hover .card-overlay {
          opacity: 1;
        }
        .card-overlay-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          color: hsl(var(--background));
          font-weight: 600;
          font-size: 14px;
          transform: translateY(6px);
          transition: transform 0.3s ease;
        }
        .project-card:hover .card-overlay-cta {
          transform: translateY(0);
        }

        .card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 3;
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
        }

        .card-body {
          padding: 20px;
          position: relative;
          z-index: 2;
          transform: translateZ(20px);
        }
        .card-title {
          font-size: 17px;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin-bottom: 8px;
          line-height: 1.3;
          transition: color 0.2s ease;
        }
        .project-card:hover .card-title {
          color: hsl(var(--primary));
        }
        .card-desc {
          font-size: 13px;
          color: hsl(var(--muted-foreground));
          margin-bottom: 14px;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .card-tag {
          font-size: 11px;
          padding: 3px 9px;
          background: hsl(var(--muted));
          border-radius: 9999px;
          color: hsl(var(--muted-foreground));
          transition: background 0.2s, color 0.2s;
        }
        .project-card:hover .card-tag {
          background: hsl(var(--primary) / 0.10);
          color: hsl(var(--primary));
        }

        .card-edge-shine {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent,
            hsl(var(--primary) / 0.6),
            transparent
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 3;
        }
        .project-card:hover .card-edge-shine {
          opacity: 1;
        }

        /* Skeleton */
        .skeleton-card {
          pointer-events: none;
        }
        .skeleton-img {
          aspect-ratio: 16 / 9;
          background: hsl(var(--muted));
          animation: skeleton-pulse 1.4s ease-in-out infinite;
        }
        .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: hsl(var(--muted));
          margin-bottom: 10px;
          animation: skeleton-pulse 1.4s ease-in-out infinite;
        }
        .skeleton-title {
          width: 60%;
          height: 16px;
        }
        .skeleton-short {
          width: 40%;
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-card-outer,
          .projects-header {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .project-card {
            transition: none !important;
            transform: none !important;
          }
          .card-img {
            transition: none !important;
          }
          .skeleton-img,
          .skeleton-line {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { usePortfolio } from "@/lib/portfolio-context"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { ArrowUpRight } from "lucide-react"
// import { cn } from "@/lib/utils"

// type Project = {
//   _id: string
//   title: string
//   description: string
//   category: "dev" | "art"
//   tags: string[]
//   image: string
//   featured: boolean
// }

// export function ProjectsSection() {
//   const { activePortfolio } = usePortfolio()
//   const [projects, setProjects] = useState<Project[]>([])
//   const [filter, setFilter] = useState<string>("all")
//   const [loadedCategory, setLoadedCategory] = useState<string | null>(null)

//   const currentCategory = activePortfolio === "developer" ? "dev" : "art"
//   const loading = loadedCategory !== currentCategory

//   useEffect(() => {
//     fetch(`/api/projects?category=${currentCategory}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setProjects(Array.isArray(data) ? data : (data.projects ?? []))
//         setFilter("all")
//         setLoadedCategory(currentCategory)
//       })
//       .catch(console.error)
//   }, [activePortfolio])

//   if (loading) return null

//   const tags = Array.from(new Set(projects.flatMap((p) => p.tags))).slice(0, 5)
//   const filteredProjects =
//     filter === "all" ? projects : projects.filter((p) => p.tags.includes(filter))

//   return (
//     <section id="work" className="py-16 sm:py-20 lg:py-32 bg-muted/30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         <div className="text-center mb-10 sm:mb-12">
//           <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
//             Selected Work
//           </p>
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">My Projects</h2>
//           <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-7 sm:mb-8" />

//           <div className="flex flex-wrap justify-center gap-2">
//             {["all", ...tags].map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => setFilter(tag)}
//                 className={cn(
//                   "px-4 py-2 rounded-full text-sm font-medium transition-all",
//                   filter === tag
//                     ? "bg-primary text-primary-foreground"
//                     : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
//                 )}
//               >
//                 {tag === "all" ? "All" : tag}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
//           {filteredProjects.slice(0, 6).map((project) => (
//             <Link key={project._id} href={`/projects/${project._id}`} className="group">
//               <Card className="overflow-hidden h-full hover:border-primary/50 hover:shadow-xl transition-all duration-300">
//                 <div className="relative aspect-video bg-muted overflow-hidden">
//                   {project.image ? (
//                     <img
//                       src={project.image}
//                       alt={project.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
//                       <span className="text-4xl font-bold text-primary/30">
//                         {project.title.charAt(0)}
//                       </span>
//                     </div>
//                   )}
//                   <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                     <span className="text-background font-medium flex items-center gap-2">
//                       View Project <ArrowUpRight className="w-4 h-4" />
//                     </span>
//                   </div>
//                   {project.featured && (
//                     <Badge className="absolute top-3 right-3 bg-primary">Featured</Badge>
//                   )}
//                 </div>

//                 <CardContent className="p-5 sm:p-6">
//                   <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
//                     {project.title}
//                   </h3>
//                   <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
//                   <div className="flex flex-wrap gap-2">
//                     {(project.tags ?? []).slice(0, 3).map((tag) => (
//                       <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
//                         {tag}
//                       </span>
//                     ))}
//                     {(project.tags ?? []).length > 3 && (
//                       <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
//                         +{project.tags.length - 3}
//                       </span>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </Link>
//           ))}
//         </div>

//         {projects.length > 6 && (
//           <div className="text-center mt-10 sm:mt-12">
//             <Button asChild variant="outline" size="lg" className="bg-transparent">
//               <Link href="/projects">
//                 View All Projects <ArrowUpRight className="ml-2 w-4 h-4" />
//               </Link>
//             </Button>
//           </div>
//         )}

//         {filteredProjects.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">No projects found in this category.</p>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }