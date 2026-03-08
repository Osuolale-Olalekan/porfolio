"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePortfolio } from "@/lib/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

export function ProjectsSection() {
  const { activePortfolio } = usePortfolio()
  const [projects, setProjects] = useState<Project[]>([])
const [filter, setFilter] = useState<string>("all")
const [loadedCategory, setLoadedCategory] = useState<string | null>(null)

const currentCategory = activePortfolio === "developer" ? "dev" : "art"
const loading = loadedCategory !== currentCategory // ← derived, no setState needed

useEffect(() => {
  fetch(`/api/projects?category=${currentCategory}`)
    .then((res) => res.json())
    .then((data) => {
      setProjects(data)
      setFilter("all")
      setLoadedCategory(currentCategory) // ← one setState, in a callback
    })
    .catch(console.error)
}, [activePortfolio])

  if (loading) return null

  const tags = Array.from(new Set(projects.flatMap((p) => p.tags))).slice(0, 5)
  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.tags.includes(filter))

  return (
    <section id="work" className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Selected Work</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-8" />

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  filter === tag
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.slice(0, 6).map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`} className="group">
              <Card className="overflow-hidden h-full hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/30">{project.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-background font-medium flex items-center gap-2">
                      View Project <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                  {project.featured && (
                    <Badge className="absolute top-3 right-3 bg-primary">Featured</Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(project.tags ?? []).slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                    {(project.tags ?? []).length > 3 && (
                      <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {projects.length > 6 && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/projects">
                View All Projects <ArrowUpRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}