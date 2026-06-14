"use client"

import React, { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Github,
  Loader2,
  Upload,
  X,
  Images,
} from "lucide-react"
import ImageCropper from "@/components/ImageCropper"

type Project = {
  _id: string
  title: string
  description: string
  longDescription?: string
  category: "dev" | "art"
  tags: string[]
  image: string
  gallery: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  completedAt: string
  createdAt?: string
  updatedAt?: string
}

type ProjectForm = {
  title: string
  description: string
  longDescription: string
  category: "dev" | "art"
  tags: string
  image: string
  gallery: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
  completedAt: string
}

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  longDescription: "",
  category: "dev",
  tags: "",
  image: "",
  gallery: [],
  liveUrl: "",
  githubUrl: "",
  featured: false,
  completedAt: new Date().toISOString().split("T")[0],
}

export default function AdminProjectsPage() {
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "dev" | "art">("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [dragOver, setDragOver] = useState(false)
  const [galleryDragOver, setGalleryDragOver] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropTarget, setCropTarget] = useState<"image" | "gallery">("image")
  const [pendingFileName, setPendingFileName] = useState<string>("image.jpg")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const hasHandledUrlParams = useRef(false)

  // ── Fetch all projects ──────────────────────────────────────────────────────
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/projects")
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error("Failed to fetch projects", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // ── Handle URL params ───────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return
    if (hasHandledUrlParams.current) return
    hasHandledUrlParams.current = true

    const action = searchParams.get("action")
    const editId = searchParams.get("edit")

    if (action === "new") {
      setEditingProject(null)
      setForm(emptyForm)
      setDialogOpen(true)
    } else if (editId) {
      const project = projects.find((p) => p._id === editId)
      if (project) openEditDialog(project)
    }
  }, [loading, searchParams, projects])

  // ── Upload blob to Cloudinary ──────────────────────────────────────────────
  const uploadBlob = async (blob: Blob, fileName: string): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", blob, fileName)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      return data.url ?? null
    } catch (err) {
      console.error("Upload failed", err)
      return null
    }
  }

  // ── File selection → open cropper ─────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFileName(file.name)
    setCropTarget("image")
    setCropSrc(URL.createObjectURL(file))
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setPendingFileName(file.name)
      setCropTarget("image")
      setCropSrc(URL.createObjectURL(file))
    }
  }

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFileName(file.name)
    setCropTarget("gallery")
    setCropSrc(URL.createObjectURL(file))
    e.target.value = ""
  }

  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setGalleryDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setPendingFileName(file.name)
      setCropTarget("gallery")
      setCropSrc(URL.createObjectURL(file))
    }
  }

  // ── Crop callbacks ─────────────────────────────────────────────────────────
  const handleCropComplete = async (croppedBlob: Blob) => {
    const fileName = pendingFileName
    const target = cropTarget
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)

    if (target === "image") {
      setUploading(true)
      const url = await uploadBlob(croppedBlob, fileName)
      if (url) setForm((prev) => ({ ...prev, image: url }))
      setUploading(false)
    } else {
      setUploadingGallery(true)
      const url = await uploadBlob(croppedBlob, fileName)
      if (url) setForm((prev) => ({ ...prev, gallery: [...prev.gallery, url] }))
      setUploadingGallery(false)
    }
  }

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      category: project.category,
      tags: project.tags.join(", "),
      image: project.image,
      gallery: project.gallery ?? [],
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      featured: project.featured,
      completedAt: project.completedAt,
    })
    setDialogOpen(true)
  }

  const handleNewProject = () => {
    setEditingProject(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title: form.title,
      description: form.description,
      longDescription: form.longDescription,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      image: form.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      gallery: form.gallery,
      liveUrl: form.liveUrl || "",
      githubUrl: form.githubUrl || "",
      featured: form.featured,
      completedAt: form.completedAt,
    }

    try {
      if (editingProject) {
        await fetch(`/api/projects/${editingProject._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      await fetchProjects()
      setDialogOpen(false)
      setForm(emptyForm)
      setEditingProject(null)
    } catch (err) {
      console.error("Failed to save project", err)
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deletingProject) return
    try {
      await fetch(`/api/projects/${deletingProject._id}`, { method: "DELETE" })
      await fetchProjects()
      setDeleteDialogOpen(false)
      setDeletingProject(null)
    } catch (err) {
      console.error("Failed to delete project", err)
    }
  }

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleNewProject}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="dev">Developer</SelectItem>
                <SelectItem value="art">Artist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Projects Grid */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="overflow-hidden group">
              <div className="aspect-video relative bg-muted">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEditDialog(project)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => { setDeletingProject(project); setDeleteDialogOpen(true) }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
                {project.featured && (
                  <Badge className="absolute top-2 right-2">Featured</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold line-clamp-1">{project.title}</h3>
                  <Badge
                    variant={project.category === "dev" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {project.category === "dev" ? "Dev" : "Art"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(project.tags ?? []).slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                  {(project.tags ?? []).length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
                {/* Gallery count badge */}
                {(project.gallery ?? []).length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Images className="w-3 h-3" />
                    {project.gallery.length} gallery image{project.gallery.length !== 1 ? "s" : ""}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No projects found</h3>
              <p className="text-muted-foreground text-sm">
                {search ? "Try adjusting your search" : "Add your first project to get started"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update your project details below"
                : "Fill in the details for your new project"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Project title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v as "dev" | "art" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Developer</SelectItem>
                    <SelectItem value="art">Artist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description for cards (1-2 sentences)"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Full Description</Label>
              <Textarea
                id="longDescription"
                value={form.longDescription}
                onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                placeholder="Detailed description for project page"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="React, TypeScript, Node.js (comma separated)"
              />
            </div>

            {/* ── Cover Image ── */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}
                  ${uploading ? "pointer-events-none opacity-60" : ""}
                `}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading to Cloudinary...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drop image here or <span className="text-primary underline">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex items-center gap-2 my-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or paste URL</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex gap-2">
                <Input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                {form.image && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0 bg-transparent"
                    onClick={() => setForm({ ...form, image: "" })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {form.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
                    }}
                  />
                </div>
              )}
            </div>

            {/* ── Gallery Images ── */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Images className="w-4 h-4" />
                Gallery Images
                <span className="text-xs text-muted-foreground font-normal">
                  ({form.gallery.length} image{form.gallery.length !== 1 ? "s" : ""})
                </span>
              </Label>

              {/* Gallery drop zone */}
              <div
                onClick={() => !uploadingGallery && galleryInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setGalleryDragOver(true) }}
                onDragLeave={() => setGalleryDragOver(false)}
                onDrop={handleGalleryDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors
                  ${galleryDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}
                  ${uploadingGallery ? "pointer-events-none opacity-60" : ""}
                `}
              >
                {uploadingGallery ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading gallery image...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Images className="w-6 h-6 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Add gallery image or <span className="text-primary underline">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Upload one at a time</p>
                  </div>
                )}
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGalleryFileChange}
              />

              {/* Gallery grid preview */}
              {form.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {form.gallery.map((url, index) => (
                    <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="w-7 h-7"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="absolute bottom-1 left-1 text-xs bg-background/80 rounded px-1">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="liveUrl"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="githubUrl"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="completedAt">Completed Date</Label>
              <Input
                id="completedAt"
                type="date"
                value={form.completedAt}
                onChange={(e) => setForm({ ...form, completedAt: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="featured" className="font-medium">Featured Project</Label>
                <p className="text-sm text-muted-foreground">
                  Show this project prominently on your homepage
                </p>
              </div>
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(checked) => setForm({ ...form, featured: checked })}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="bg-transparent"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || uploading || uploadingGallery}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingProject?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Cropper — shared for both cover and gallery */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          aspectRatio={cropTarget === "image" ? 16 / 9 : undefined}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}

// "use client"

// import React, { useEffect, useState, useRef } from "react"
// import { useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   Search,
//   ExternalLink,
//   Github,
//   ImageIcon,
//   Loader2,
// } from "lucide-react"

// type Project = {
//   _id: string
//   title: string
//   description: string
//   longDescription?: string
//   category: "dev" | "art"
//   tags: string[]
//   image: string
//   gallery: string[]
//   liveUrl?: string
//   githubUrl?: string
//   featured: boolean
//   completedAt: string
//   createdAt?: string
//   updatedAt?: string
// }

// type ProjectForm = {
//   title: string
//   description: string
//   longDescription: string
//   category: "dev" | "art"
//   tags: string
//   image: string
//   liveUrl: string
//   githubUrl: string
//   featured: boolean
//   completedAt: string
// }

// const emptyForm: ProjectForm = {
//   title: "",
//   description: "",
//   longDescription: "",
//   category: "dev",
//   tags: "",
//   image: "",
//   liveUrl: "",
//   githubUrl: "",
//   featured: false,
//   completedAt: new Date().toISOString().split("T")[0],
// }

// export default function AdminProjectsPage() {
//   const searchParams = useSearchParams()
//   const [projects, setProjects] = useState<Project[]>([])
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [search, setSearch] = useState("")
//   const [categoryFilter, setCategoryFilter] = useState<"all" | "dev" | "art">("all")
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [editingProject, setEditingProject] = useState<Project | null>(null)
//   const [deletingProject, setDeletingProject] = useState<Project | null>(null)
//   const [form, setForm] = useState<ProjectForm>(emptyForm)
//   const hasHandledUrlParams = useRef(false)

//   // ── Fetch all projects ──────────────────────────────────────────────────────
//   const fetchProjects = async () => {
//     try {
//       setLoading(true)
//       const res = await fetch("/api/projects")
//       const data = await res.json()
//       setProjects(data)
//     } catch (err) {
//       console.error("Failed to fetch projects", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchProjects()
//   }, [])

//   // ── Handle URL params (e.g. ?action=new or ?edit=id) ───────────────────────
//   useEffect(() => {
//     if (loading) return
//     if (hasHandledUrlParams.current) return
//     hasHandledUrlParams.current = true

//     const action = searchParams.get("action")
//     const editId = searchParams.get("edit")

//     if (action === "new") {
//       setEditingProject(null)
//       setForm(emptyForm)
//       setDialogOpen(true)
//     } else if (editId) {
//       const project = projects.find((p) => p._id === editId)
//       if (project) openEditDialog(project)
//     }
//   }, [loading, searchParams, projects])

//   // ── Helpers ────────────────────────────────────────────────────────────────
//   const openEditDialog = (project: Project) => {
//     setEditingProject(project)
//     setForm({
//       title: project.title,
//       description: project.description,
//       longDescription: project.longDescription || "",
//       category: project.category,
//       tags: project.tags.join(", "),
//       image: project.image,
//       liveUrl: project.liveUrl || "",
//       githubUrl: project.githubUrl || "",
//       featured: project.featured,
//       completedAt: project.completedAt,
//     })
//     setDialogOpen(true)
//   }

//   const handleNewProject = () => {
//     setEditingProject(null)
//     setForm(emptyForm)
//     setDialogOpen(true)
//   }

//   // ── Submit (create or update) ──────────────────────────────────────────────
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSaving(true)

//     const payload = {
//       title: form.title,
//       description: form.description,
//       longDescription: form.longDescription,
//       category: form.category,
//       tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
//       image: form.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
//       gallery: [],
//       liveUrl: form.liveUrl || "",
//       githubUrl: form.githubUrl || "",
//       featured: form.featured,
//       completedAt: form.completedAt,
//     }

//     try {
//       if (editingProject) {
//         await fetch(`/api/projects/${editingProject._id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         })
//       } else {
//         await fetch("/api/projects", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         })
//       }
//       await fetchProjects()
//       setDialogOpen(false)
//       setForm(emptyForm)
//       setEditingProject(null)
//     } catch (err) {
//       console.error("Failed to save project", err)
//     } finally {
//       setSaving(false)
//     }
//   }

//   // ── Delete ─────────────────────────────────────────────────────────────────
//   const confirmDelete = async () => {
//     if (!deletingProject) return
//     try {
//       await fetch(`/api/projects/${deletingProject._id}`, { method: "DELETE" })
//       await fetchProjects()
//       setDeleteDialogOpen(false)
//       setDeletingProject(null)
//     } catch (err) {
//       console.error("Failed to delete project", err)
//     }
//   }

//   // ── Filter ─────────────────────────────────────────────────────────────────
//   const filteredProjects = projects.filter((project) => {
//     const matchesSearch =
//       project.title.toLowerCase().includes(search.toLowerCase()) ||
//       project.description.toLowerCase().includes(search.toLowerCase()) ||
//       project.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
//     const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
//     return matchesSearch && matchesCategory
//   })

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
//           <p className="text-muted-foreground">Manage your portfolio projects</p>
//         </div>
//         <Button onClick={handleNewProject}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Project
//         </Button>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search projects..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-9"
//               />
//             </div>
//             <Select
//               value={categoryFilter}
//               onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}
//             >
//               <SelectTrigger className="w-full sm:w-[180px]">
//                 <SelectValue placeholder="Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 <SelectItem value="dev">Developer</SelectItem>
//                 <SelectItem value="art">Artist</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Loading */}
//       {loading && (
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
//         </div>
//       )}

//       {/* Projects Grid */}
//       {!loading && (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {filteredProjects.map((project) => (
//             <Card key={project._id} className="overflow-hidden group">
//               <div className="aspect-video relative bg-muted">
//                 <img
//                   src={project.image || "/placeholder.svg"}
//                   alt={project.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
//                   <Button size="sm" variant="secondary" onClick={() => openEditDialog(project)}>
//                     <Pencil className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={() => { setDeletingProject(project); setDeleteDialogOpen(true) }}
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" />
//                     Delete
//                   </Button>
//                 </div>
//                 {project.featured && (
//                   <Badge className="absolute top-2 right-2">Featured</Badge>
//                 )}
//               </div>
//               <CardContent className="p-4">
//                 <div className="flex items-start justify-between gap-2 mb-2">
//                   <h3 className="font-semibold line-clamp-1">{project.title}</h3>
//                   <Badge
//                     variant={project.category === "dev" ? "default" : "secondary"}
//                     className="shrink-0"
//                   >
//                     {project.category === "dev" ? "Dev" : "Art"}
//                   </Badge>
//                 </div>
//                 <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
//                   {project.description}
//                 </p>
//                 <div className="flex flex-wrap gap-1">
//                   {(project.tags ?? []).slice(0, 3).map((tag) => (
//                     <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
//                       {tag}
//                     </span>
//                   ))}
//                   {(project.tags ?? []).length > 3 && (
//                     <span className="text-xs text-muted-foreground">
//                       +{project.tags.length - 3} more
//                     </span>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}

//           {filteredProjects.length === 0 && (
//             <div className="col-span-full text-center py-12">
//               <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
//                 <Search className="w-8 h-8 text-muted-foreground" />
//               </div>
//               <h3 className="font-semibold mb-1">No projects found</h3>
//               <p className="text-muted-foreground text-sm">
//                 {search ? "Try adjusting your search" : "Add your first project to get started"}
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Add/Edit Dialog */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {editingProject ? "Edit Project" : "Add New Project"}
//             </DialogTitle>
//             <DialogDescription>
//               {editingProject
//                 ? "Update your project details below"
//                 : "Fill in the details for your new project"}
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Title *</Label>
//                 <Input
//                   id="title"
//                   value={form.title}
//                   onChange={(e) => setForm({ ...form, title: e.target.value })}
//                   placeholder="Project title"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="category">Category *</Label>
//                 <Select
//                   value={form.category}
//                   onValueChange={(v) => setForm({ ...form, category: v as "dev" | "art" })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="dev">Developer</SelectItem>
//                     <SelectItem value="art">Artist</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Short Description *</Label>
//               <Textarea
//                 id="description"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 placeholder="Brief description for cards (1-2 sentences)"
//                 rows={2}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="longDescription">Full Description</Label>
//               <Textarea
//                 id="longDescription"
//                 value={form.longDescription}
//                 onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
//                 placeholder="Detailed description for project page"
//                 rows={4}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="tags">Tags</Label>
//               <Input
//                 id="tags"
//                 value={form.tags}
//                 onChange={(e) => setForm({ ...form, tags: e.target.value })}
//                 placeholder="React, TypeScript, Node.js (comma separated)"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="image">Image URL</Label>
//               <div className="flex gap-2">
//                 <Input
//                   id="image"
//                   value={form.image}
//                   onChange={(e) => setForm({ ...form, image: e.target.value })}
//                   placeholder="https://example.com/image.jpg"
//                   className="flex-1"
//                 />
//                 <Button type="button" variant="outline" size="icon" className="shrink-0 bg-transparent">
//                   <ImageIcon className="w-4 h-4" />
//                 </Button>
//               </div>
//               {form.image && (
//                 <div className="mt-2 rounded-lg overflow-hidden border border-border">
//                   <img
//                     src={form.image}
//                     alt="Preview"
//                     className="w-full h-32 object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="liveUrl">Live URL</Label>
//                 <div className="relative">
//                   <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                   <Input
//                     id="liveUrl"
//                     value={form.liveUrl}
//                     onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
//                     placeholder="https://example.com"
//                     className="pl-9"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="githubUrl">GitHub URL</Label>
//                 <div className="relative">
//                   <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                   <Input
//                     id="githubUrl"
//                     value={form.githubUrl}
//                     onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
//                     placeholder="https://github.com/..."
//                     className="pl-9"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="completedAt">Completed Date</Label>
//               <Input
//                 id="completedAt"
//                 type="date"
//                 value={form.completedAt}
//                 onChange={(e) => setForm({ ...form, completedAt: e.target.value })}
//               />
//             </div>

//             <div className="flex items-center justify-between rounded-lg border border-border p-4">
//               <div>
//                 <Label htmlFor="featured" className="font-medium">Featured Project</Label>
//                 <p className="text-sm text-muted-foreground">
//                   Show this project prominently on your homepage
//                 </p>
//               </div>
//               <Switch
//                 id="featured"
//                 checked={form.featured}
//                 onCheckedChange={(checked) => setForm({ ...form, featured: checked })}
//               />
//             </div>

//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="bg-transparent"
//                 onClick={() => setDialogOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={saving}>
//                 {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                 {editingProject ? "Save Changes" : "Create Project"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Project</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete &quot;{deletingProject?.title}&quot;? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               className="bg-transparent"
//               onClick={() => setDeleteDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmDelete}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }