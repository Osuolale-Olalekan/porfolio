"use client"

import React, { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Save,
  User,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Dribbble,
  Globe,
  Loader2,
  Upload,
  X,
} from "lucide-react"
import ImageCropper from "@/components/ImageCropper"

type AvatarPosition = {
  x: number
  y: number
  scale: number
}

type Profile = {
  _id: string
  name: string
  title: string
  bio: string
  avatar: string
  avatarPosition: AvatarPosition
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

const defaultPosition: AvatarPosition = { x: 50, y: 50, scale: 1 }

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [pendingFileName, setPendingFileName] = useState<string>("avatar.jpg")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // ── Fetch profile ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setProfile({ ...data, avatarPosition: data.avatarPosition ?? defaultPosition })
      } catch (err) {
        console.error("Failed to fetch profile", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // ── Upload blob to Cloudinary ─────────────────────────────────────────────
  const uploadBlob = async (blob: Blob, fileName: string) => {
    setUploading(true)
    const formData = new FormData()
    formData.append("file", blob, fileName)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url && profile) {
        setProfile({ ...profile, avatar: data.url, avatarPosition: defaultPosition })
        toast({ title: "Avatar uploaded!", description: "Your new avatar is ready." })
      }
    } catch (err) {
      console.error("Upload failed", err)
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  // ── File selection → open cropper ─────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFileName(file.name)
    setCropSrc(URL.createObjectURL(file))
    e.target.value = ""
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setPendingFileName(file.name)
      setCropSrc(URL.createObjectURL(file))
    }
  }

  // ── Crop callbacks ─────────────────────────────────────────────────────────
  const handleCropComplete = async (croppedBlob: Blob) => {
    const fileName = pendingFileName
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    await uploadBlob(croppedBlob, fileName)
  }

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  // ── Avatar drag to reposition ─────────────────────────────────────────────
  const position = profile?.avatarPosition ?? defaultPosition

  const updatePosition = (updates: Partial<AvatarPosition>) => {
    if (!profile) return
    setProfile({ ...profile, avatarPosition: { ...position, ...updates } })
  }

  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handlePreviewMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewRef.current) return
    const dx = ((e.clientX - dragStart.x) / previewRef.current.offsetWidth) * 100
    const dy = ((e.clientY - dragStart.y) / previewRef.current.offsetHeight) * 100
    updatePosition({
      x: Math.min(100, Math.max(0, position.x - dx)),
      y: Math.min(100, Math.max(0, position.y - dy)),
    })
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handlePreviewMouseUp = () => setIsDragging(false)

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error("Failed to save")
      const updated = await res.json()
      setProfile({ ...updated, avatarPosition: updated.avatarPosition ?? defaultPosition })
      toast({ title: "Profile saved!", description: "Your changes have been saved successfully." })
    } catch (err) {
      console.error("Failed to save profile", err)
      toast({ title: "Failed to save", description: "Something went wrong. Please try again.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updateField = (updates: Partial<Profile>) => {
    if (profile) setProfile({ ...profile, ...updates })
  }

  const updateSocialLinks = (platform: keyof Profile["socialLinks"], value: string) => {
    if (profile) setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [platform]: value } })
  }

  const updateStats = (stat: keyof Profile["stats"], value: number) => {
    if (profile) setProfile({ ...profile, stats: { ...profile.stats, [stat]: value } })
  }

  // ── Loading / empty states ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No profile found. Add your profile data to MongoDB first.</p>
      </div>
    )
  }

  const SaveButton = ({ className }: { className?: string }) => (
    <Button type="submit" form="profile-form" className={className} disabled={saving || uploading}>
      {saving
        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
        : <><Save className="w-4 h-4 mr-2" />Save Changes</>
      }
    </Button>
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        <div className="hidden sm:block">
          <SaveButton />
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Your name, title, and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => updateField({ name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={profile.title}
                  onChange={(e) => updateField({ title: e.target.value })}
                  placeholder="Full-Stack Developer & Digital Artist"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateField({ email: e.target.value })}
                  placeholder="hello@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-2" />Location
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => updateField({ location: e.target.value })}
                  placeholder="Lagos, Nigeria"
                />
              </div>
            </div>

            {/* ── Avatar ── */}
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex gap-4 items-start">

                {/* Controls */}
                <div className="flex-1 space-y-2">

                  {/* Drop zone */}
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    className={`
                      border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                      ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}
                      ${uploading ? "pointer-events-none opacity-60" : ""}
                    `}
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">
                          Drop photo or <span className="text-primary underline">browse</span>
                        </span>
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

                  {/* Divider */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">or paste URL</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* URL input */}
                  <div className="flex gap-2">
                    <Input
                      value={profile.avatar}
                      onChange={(e) => updateField({ avatar: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-1"
                    />
                    {profile.avatar && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 bg-transparent"
                        onClick={() => updateField({ avatar: "", avatarPosition: defaultPosition })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Position controls */}
                  {profile.avatar && (
                    <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Adjust Position
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag the preview circle to reposition your photo
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Zoom</span>
                          <span>{Math.round(position.scale * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.05"
                          value={position.scale}
                          onChange={(e) => updatePosition({ scale: parseFloat(e.target.value) })}
                          className="w-full accent-primary"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent text-xs"
                        onClick={() => updatePosition(defaultPosition)}
                      >
                        Reset Position
                      </Button>
                    </div>
                  )}
                </div>

                {/* Draggable preview */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    ref={previewRef}
                    onMouseDown={handlePreviewMouseDown}
                    onMouseMove={handlePreviewMouseMove}
                    onMouseUp={handlePreviewMouseUp}
                    onMouseLeave={handlePreviewMouseUp}
                    className={`
                      w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted
                      flex items-center justify-center select-none
                      ${profile.avatar ? "cursor-grab active:cursor-grabbing" : ""}
                    `}
                  >
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Avatar preview"
                        draggable={false}
                        className="w-full h-full object-cover pointer-events-none"
                        style={{
                          objectPosition: `${position.x}% ${position.y}%`,
                          transform: `scale(${position.scale})`,
                          transformOrigin: `${position.x}% ${position.y}%`,
                        }}
                        onError={(e) => { e.currentTarget.src = "/placeholder.svg" }}
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  {profile.avatar && (
                    <p className="text-xs text-muted-foreground">Drag to reposition</p>
                  )}
                </div>

              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => updateField({ bio: e.target.value })}
                placeholder="Tell visitors about yourself..."
                rows={4}
              />
            </div>

          </CardContent>
        </Card>

        {/* ── Social Links ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Social Links
            </CardTitle>
            <CardDescription>Connect your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="github"><Github className="w-4 h-4 inline mr-2" />GitHub</Label>
                <Input
                  id="github"
                  value={profile.socialLinks.github || ""}
                  onChange={(e) => updateSocialLinks("github", e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin"><Linkedin className="w-4 h-4 inline mr-2" />LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={profile.socialLinks.linkedin || ""}
                  onChange={(e) => updateSocialLinks("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter"><Twitter className="w-4 h-4 inline mr-2" />Twitter / X</Label>
                <Input
                  id="twitter"
                  value={profile.socialLinks.twitter || ""}
                  onChange={(e) => updateSocialLinks("twitter", e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram"><Instagram className="w-4 h-4 inline mr-2" />Instagram</Label>
                <Input
                  id="instagram"
                  value={profile.socialLinks.instagram || ""}
                  onChange={(e) => updateSocialLinks("instagram", e.target.value)}
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dribbble"><Dribbble className="w-4 h-4 inline mr-2" />Dribbble</Label>
                <Input
                  id="dribbble"
                  value={profile.socialLinks.dribbble || ""}
                  onChange={(e) => updateSocialLinks("dribbble", e.target.value)}
                  placeholder="https://dribbble.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="behance"><Globe className="w-4 h-4 inline mr-2" />Behance</Label>
                <Input
                  id="behance"
                  value={profile.socialLinks.behance || ""}
                  onChange={(e) => updateSocialLinks("behance", e.target.value)}
                  placeholder="https://behance.net/username"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Stats ── */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Numbers displayed on your homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  value={profile.stats.yearsExperience}
                  onChange={(e) => updateStats("yearsExperience", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectsCompleted">Projects Completed</Label>
                <Input
                  id="projectsCompleted"
                  type="number"
                  min="0"
                  value={profile.stats.projectsCompleted}
                  onChange={(e) => updateStats("projectsCompleted", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="happyClients">Happy Clients</Label>
                <Input
                  id="happyClients"
                  type="number"
                  min="0"
                  value={profile.stats.happyClients}
                  onChange={(e) => updateStats("happyClients", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile save button */}
        <div className="sm:hidden">
          <SaveButton className="w-full" />
        </div>

      </form>

      {/* Image Cropper */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          aspectRatio={1}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

    </div>
  )
}