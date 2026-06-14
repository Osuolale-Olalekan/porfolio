"use client"

import { usePortfolio } from "@/lib/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, GraduationCap, Heart, MapPin } from "lucide-react"
import { useProfile } from "@/lib/hooks/useprofile"

export function AboutSection() {
  const { activePortfolio } = usePortfolio()
  const profile = useProfile()

  if (!profile) return null

  const highlights = [
    { icon: Briefcase, label: "Experience", value: `${profile.stats.yearsExperience} Years` },
    { icon: GraduationCap, label: "Projects Done", value: profile.stats.projectsCompleted.toString() },
    { icon: MapPin, label: "Location", value: profile.location },
    { icon: Heart, label: "Happy Clients", value: profile.stats.happyClients.toString() },
  ]

  const values =
    activePortfolio === "developer"
      ? ["Clean & maintainable code", "User-centered design", "Continuous learning", "Collaborative teamwork"]
      : ["Visual storytelling", "Attention to detail", "Creative exploration", "Client collaboration"]

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 sm:mb-16">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
            Get to know me
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          <div>
            <p className="text-lg sm:text-xl text-foreground font-medium mb-5 leading-relaxed">
              {activePortfolio === "developer"
                ? "Building digital experiences that make a difference"
                : "Creating visual stories that captivate and inspire"}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">{profile.bio}</p>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">What I Value</h3>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <span
                    key={value}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((highlight) => (
              <Card key={highlight.label} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
                      <highlight.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground mb-1">{highlight.label}</p>
                      <p className="font-semibold text-foreground text-sm sm:text-base truncate">{highlight.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}