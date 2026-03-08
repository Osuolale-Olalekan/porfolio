"use client"

import { useEffect, useState } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

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

export function HeroSection() {
  const { activePortfolio } = usePortfolio()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then(setProfile)
      .catch(console.error)
  }, [])

  if (!profile) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              {activePortfolio === "developer" ? "Full-Stack Developer" : "Digital Artist"}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 text-balance">
              {profile.name}
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-primary mb-6">
              {profile.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 text-pretty">
              {profile.bio}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button asChild size="lg" className="group">
                <Link href="#contact">
                  Work With Me
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group bg-transparent">
                <Link href="#work">View My Work</Link>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <span className="text-sm text-muted-foreground">Find me on</span>
              <div className="flex items-center gap-2">
                {profile.socialLinks.github && (
                  <Link href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Github className="w-5 h-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                )}
                {profile.socialLinks.linkedin && (
                  <Link href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Linkedin className="w-5 h-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                )}
                {profile.socialLinks.twitter && (
                  <Link href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Twitter className="w-5 h-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
                {profile.socialLinks.instagram && (
                  <Link href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="w-5 h-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-110 animate-pulse" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-6xl sm:text-7xl lg:text-8xl font-bold text-primary/50">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-4 py-2 shadow-lg animate-bounce">
                <span className="text-sm font-medium">{profile.stats.yearsExperience}+ Years</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-4 py-2 shadow-lg animate-bounce">
                <span className="text-sm font-medium">{profile.stats.projectsCompleted}+ Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}