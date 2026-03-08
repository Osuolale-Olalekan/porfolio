import Link from "next/link"
import { getProjects } from "@/lib/db/projects"
import { getProfile } from "@/lib/db/profile"
import { getSkills } from "@/lib/db/skills"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FolderKanban,
  User,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Code2,
  Palette,
  Eye,
} from "lucide-react"

export default async function AdminDashboardPage() {
  const [projects, profile, skills] = await Promise.all([
    getProjects(),
    getProfile(),
    getSkills(),
  ])

  const devProjects = projects.filter((p) => p.category === "dev")
  const artProjects = projects.filter((p) => p.category === "art")
  const featuredProjects = projects.filter((p) => p.featured)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt ?? "").getTime() - new Date(a.updatedAt ?? "").getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name?.split(" ")[0] || "Admin"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              View Site
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold">{projects.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <FolderKanban className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dev Projects</p>
                <p className="text-3xl font-bold">{devProjects.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Code2 className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Art Projects</p>
                <p className="text-3xl font-bold">{artProjects.length}</p>
              </div>
              <div className="p-3 bg-pink-500/10 rounded-xl">
                <Palette className="w-6 h-6 text-pink-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                <p className="text-3xl font-bold">{skills.length}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/projects?action=new"
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderKanban className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Add New Project</p>
                  <p className="text-sm text-muted-foreground">Showcase your latest work</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            <Link
              href="/admin/profile"
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Update Profile</p>
                  <p className="text-sm text-muted-foreground">Edit your bio and social links</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            <Link
              href="/admin/skills"
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Manage Skills</p>
                  <p className="text-sm text-muted-foreground">Add or update your skillset</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest updated projects</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="bg-transparent">
              <Link href="/admin/projects">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project._id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={project.category === "dev" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {project.category === "dev" ? "Dev" : "Art"}
                      </Badge>
                      {project.featured && (
                        <Badge variant="outline" className="text-xs">Featured</Badge>
                      )}
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="bg-transparent shrink-0">
                    <Link href={`/admin/projects?edit=${project._id}`}>Edit</Link>
                  </Button>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No projects yet. Add your first one!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Featured Projects
            </CardTitle>
            <CardDescription>
              These projects are highlighted on your homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <div
                  key={project._id}
                  className="group relative rounded-xl overflow-hidden border border-border"
                >
                  <div className="aspect-video bg-muted">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}