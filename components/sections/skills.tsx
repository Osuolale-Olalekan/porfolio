"use client"

import { useEffect, useState } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"

type Skill = {
  _id: string
  name: string
  category: string
  proficiency: number
  portfolioType: "developer" | "artist" | "both"
}

export function SkillsSection() {
  const { activePortfolio } = usePortfolio()
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    const portfolioType = activePortfolio === "developer" ? "developer" : "artist"
    fetch(`/api/skills?portfolioType=${portfolioType}`)
      .then((res) => res.json())
      .then(setSkills)
      .catch(console.error)
  }, [activePortfolio])

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (skills.length === 0) return null

  return (
    <section id="skills" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">What I work with</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Skills & Tools</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-primary" />
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categorySkills.map((skill) => (
                  <Card
                    key={skill._id}
                    className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-default"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <span className="text-lg font-bold text-primary group-hover:text-primary-foreground transition-colors">
                            {skill.name.charAt(0)}
                          </span>
                        </div>
                        <p className="font-medium text-foreground text-sm sm:text-base mb-2">{skill.name}</p>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}