"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
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
import { Plus, Pencil, Trash2, Sparkles, Code2, Palette, Loader2 } from "lucide-react"

type Skill = {
  _id: string
  name: string
  category: string
  proficiency: number
  portfolioType: "developer" | "artist" | "both"
}

type SkillForm = {
  name: string
  category: string
  proficiency: number
  portfolioType: "developer" | "artist" | "both"
}

const emptyForm: SkillForm = {
  name: "",
  category: "",
  proficiency: 80,
  portfolioType: "developer",
}

const categoryOptions = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Art",
  "Tools",
  "Design",
  "Other",
]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<SkillForm>(emptyForm)
  const [filter, setFilter] = useState<"all" | "developer" | "artist">("all")

  // ── Fetch skills ─────────────────────────────────────────────────────────
  const fetchSkills = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/skills")
      const data = await res.json()
      setSkills(data)
    } catch (err) {
      console.error("Failed to fetch skills", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const openEditDialog = (skill: Skill) => {
    setEditingSkill(skill)
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      portfolioType: skill.portfolioType,
    })
    setDialogOpen(true)
  }

  const handleNewSkill = () => {
    setEditingSkill(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  // ── Submit (create or update) ─────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingSkill) {
        await fetch(`/api/skills/${editingSkill._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
      await fetchSkills()
      setDialogOpen(false)
      setForm(emptyForm)
      setEditingSkill(null)
    } catch (err) {
      console.error("Failed to save skill", err)
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deletingSkill) return
    setDeleting(true)
    try {
      await fetch(`/api/skills/${deletingSkill._id}`, { method: "DELETE" })
      await fetchSkills()
      setDeleteDialogOpen(false)
      setDeletingSkill(null)
    } catch (err) {
      console.error("Failed to delete skill", err)
    } finally {
      setDeleting(false)
    }
  }

  // ── Filter & group ────────────────────────────────────────────────────────
  const filteredSkills = skills.filter((skill) => {
    if (filter === "all") return true
    return skill.portfolioType === filter || skill.portfolioType === "both"
  })

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">Manage your skillset</p>
        </div>
        <Button onClick={handleNewSkill}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          className={filter !== "all" ? "bg-transparent" : ""}
          onClick={() => setFilter("all")}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          All
        </Button>
        <Button
          variant={filter === "developer" ? "default" : "outline"}
          size="sm"
          className={filter !== "developer" ? "bg-transparent" : ""}
          onClick={() => setFilter("developer")}
        >
          <Code2 className="w-4 h-4 mr-2" />
          Developer
        </Button>
        <Button
          variant={filter === "artist" ? "default" : "outline"}
          size="sm"
          className={filter !== "artist" ? "bg-transparent" : ""}
          onClick={() => setFilter("artist")}
        >
          <Palette className="w-4 h-4 mr-2" />
          Artist
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Skills by Category */}
      {!loading && (
        <div className="grid gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>
                  {categorySkills.length} skill{categorySkills.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge
                            variant={
                              skill.portfolioType === "developer"
                                ? "default"
                                : skill.portfolioType === "artist"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {skill.portfolioType === "both"
                              ? "Both"
                              : skill.portfolioType === "developer"
                              ? "Dev"
                              : "Art"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => openEditDialog(skill)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive bg-transparent"
                          onClick={() => {
                            setDeletingSkill(skill)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(groupedSkills).length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No skills found</h3>
              <p className="text-muted-foreground text-sm">
                Add your first skill to get started
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
            <DialogDescription>
              {editingSkill
                ? "Update your skill details below"
                : "Add a new skill to your portfolio"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., React, Digital Painting"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioType">Portfolio Type *</Label>
                <Select
                  value={form.portfolioType}
                  onValueChange={(v) =>
                    setForm({ ...form, portfolioType: v as "developer" | "artist" | "both" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Proficiency Level</Label>
                <span className="text-sm font-medium">{form.proficiency}%</span>
              </div>
              <Slider
                value={[form.proficiency]}
                onValueChange={(v) => setForm({ ...form, proficiency: v[0] })}
                min={0}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
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
              <Button type="submit" disabled={saving || !form.name || !form.category}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingSkill ? "Save Changes" : "Add Skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingSkill?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}