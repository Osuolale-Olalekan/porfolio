"use client"

import React, { useEffect, useState } from "react"
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
} from "lucide-react"

type Profile = {
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

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // ── Fetch profile ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error("Failed to fetch profile", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

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
      setProfile(updated)
      toast({
        title: "Profile saved!",
        description: "Your changes have been saved successfully.",
      })
    } catch (err) {
      console.error("Failed to save profile", err)
      toast({
        title: "Failed to save",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updateField = (updates: Partial<Profile>) => {
    if (profile) setProfile({ ...profile, ...updates })
  }

  const updateSocialLinks = (platform: keyof Profile["socialLinks"], value: string) => {
    if (profile) {
      setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [platform]: value } })
    }
  }

  const updateStats = (stat: keyof Profile["stats"], value: number) => {
    if (profile) {
      setProfile({ ...profile, stats: { ...profile.stats, [stat]: value } })
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
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
    <Button type="submit" form="profile-form" className={className} disabled={saving}>
      {saving ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
      ) : (
        <><Save className="w-4 h-4 mr-2" />Save Changes</>
      )}
    </Button>
  )

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
        {/* Basic Info */}
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
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
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
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => updateField({ location: e.target.value })}
                  placeholder="Lagos, Nigeria"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <div className="flex gap-4">
                <Input
                  id="avatar"
                  value={profile.avatar}
                  onChange={(e) => updateField({ avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1"
                />
                {profile.avatar && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
                    <img
                      src={profile.avatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = "/placeholder.svg" }}
                    />
                  </div>
                )}
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

        {/* Social Links */}
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
                <Label htmlFor="github">
                  <Github className="w-4 h-4 inline mr-2" />GitHub
                </Label>
                <Input
                  id="github"
                  value={profile.socialLinks.github || ""}
                  onChange={(e) => updateSocialLinks("github", e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">
                  <Linkedin className="w-4 h-4 inline mr-2" />LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={profile.socialLinks.linkedin || ""}
                  onChange={(e) => updateSocialLinks("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">
                  <Twitter className="w-4 h-4 inline mr-2" />Twitter / X
                </Label>
                <Input
                  id="twitter"
                  value={profile.socialLinks.twitter || ""}
                  onChange={(e) => updateSocialLinks("twitter", e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">
                  <Instagram className="w-4 h-4 inline mr-2" />Instagram
                </Label>
                <Input
                  id="instagram"
                  value={profile.socialLinks.instagram || ""}
                  onChange={(e) => updateSocialLinks("instagram", e.target.value)}
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dribbble">
                  <Dribbble className="w-4 h-4 inline mr-2" />Dribbble
                </Label>
                <Input
                  id="dribbble"
                  value={profile.socialLinks.dribbble || ""}
                  onChange={(e) => updateSocialLinks("dribbble", e.target.value)}
                  placeholder="https://dribbble.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="behance">
                  <Globe className="w-4 h-4 inline mr-2" />Behance
                </Label>
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

        {/* Stats */}
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

        {/* Mobile Save Button */}
        <div className="sm:hidden">
          <SaveButton className="w-full" />
        </div>
      </form>
    </div>
  )
}