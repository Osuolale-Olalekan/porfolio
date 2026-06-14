"use client"

import { useEffect, useRef, useState } from "react"
import { usePortfolio } from "@/lib/portfolio-context"

type Skill = {
  _id: string
  name: string
  category: string
  proficiency: number
  portfolioType: "developer" | "artist" | "both"
  icon: string
}

function SkillPill({ skill }: { skill: Skill }) {
  return (
    <div className="skill-pill">
      <div className="skill-pill-icon">
        {skill.icon ? (
          <img
            src={skill.icon}
            alt={skill.name}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              e.currentTarget.style.display = "none"
              const p = e.currentTarget.parentElement
              if (p) p.innerHTML = `<span class="pill-initial">${skill.name.charAt(0)}</span>`
            }}
          />
        ) : (
          <span className="pill-initial">{skill.name.charAt(0)}</span>
        )}
      </div>
      <span className="skill-pill-name">{skill.name}</span>
      <span className="skill-pill-pct">{skill.proficiency}%</span>
    </div>
  )
}

function InfiniteTrack({
  skills,
  direction = "left",
  speed = 32,
  tilt = 0,
}: {
  skills: Skill[]
  direction?: "left" | "right"
  speed?: number
  tilt?: number
}) {
  // Triple the array so the loop is seamless on any screen width
  const items = [...skills, ...skills, ...skills]

  return (
    <div
      className="track-viewport"
      style={{ transform: `rotateX(${tilt}deg)` }}
    >
      <div
        className="track-belt"
        style={{
          animationName: direction === "left" ? "slideLeft" : "slideRight",
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((skill, i) => (
          <SkillPill key={`${skill._id}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  )
}

export function SkillsSection() {
  const { activePortfolio } = usePortfolio()
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    const portfolioType = activePortfolio === "developer" ? "developer" : "artist"
    fetch(`/api/skills?portfolioType=${portfolioType}`)
      .then((res) => res.json())
      .then((data) => setSkills(Array.isArray(data) ? data : (data.skills ?? [])))
      .catch(console.error)
  }, [activePortfolio])

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  const categories = Object.entries(groupedSkills)

  if (skills.length === 0) return null

  // Alternate direction per row; vary speed slightly for depth
  const rowConfig = [
    { direction: "left" as const,  speed: 28, tilt: -2 },
    { direction: "right" as const, speed: 34, tilt:  0 },
    { direction: "left" as const,  speed: 24, tilt:  2 },
    { direction: "right" as const, speed: 30, tilt: -1 },
  ]

  return (
    <section id="skills" className="py-16 sm:py-20 lg:py-32 skills-stage">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
            What I work with
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Skills & Tools
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </div>

      {/* 3-D conveyor stage — full bleed, perspective set on parent */}
      <div className="conveyor-stage">
        {categories.map(([category, categorySkills], idx) => {
          const cfg = rowConfig[idx % rowConfig.length]
          return (
            <div key={category} className="conveyor-row">
              <span className="row-label">{category}</span>
              <InfiniteTrack
                skills={categorySkills}
                direction={cfg.direction}
                speed={cfg.speed}
                tilt={cfg.tilt}
              />
            </div>
          )
        })}
      </div>

      <style>{`
        /* ── Stage perspective ── */
        .conveyor-stage {
          perspective: 1200px;
          perspective-origin: 50% 40%;
          padding: 8px 0 24px;
          overflow: hidden;
        }

        /* ── One row ── */
        .conveyor-row {
          position: relative;
          margin-bottom: 18px;
        }

        /* Category label floats left, fades at edge */
        .row-label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          white-space: nowrap;
          pointer-events: none;
        }

        /* ── Track viewport — clips overflow and applies 3-D tilt ── */
        .track-viewport {
          width: 100%;
          overflow: hidden;
          transform-style: preserve-3d;
          /* fade edges */
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          transition: transform 0.4s ease;
        }
        .track-viewport:hover {
          transform: rotateX(0deg) !important;
        }

        /* ── Belt — the moving strip ── */
        .track-belt {
          display: flex;
          gap: 12px;
          width: max-content;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          padding: 10px 0;
        }
        .track-belt:hover {
          animation-play-state: paused;
        }

        /* ── Pill ── */
        .skill-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px 8px 8px;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 9999px;
          white-space: nowrap;
          cursor: default;
          transform: translateZ(0);
          transition:
            transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.25s ease,
            border-color 0.25s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }
        .skill-pill:hover {
          transform: translateZ(24px) scale(1.06);
          box-shadow: 0 8px 24px hsl(var(--primary) / 0.22);
          border-color: hsl(var(--primary) / 0.5);
        }

        .skill-pill-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: hsl(var(--primary) / 0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          transition: background 0.25s ease;
        }
        .skill-pill:hover .skill-pill-icon {
          background: hsl(var(--primary) / 0.20);
        }

        .pill-initial {
          font-size: 13px;
          font-weight: 700;
          color: hsl(var(--primary));
        }

        .skill-pill-name {
          font-size: 13px;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .skill-pill-pct {
          font-size: 11px;
          font-weight: 500;
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.10);
          padding: 2px 7px;
          border-radius: 9999px;
        }

        /* ── Keyframes ── */
        @keyframes slideLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes slideRight {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .track-belt {
            animation: none !important;
            flex-wrap: wrap;
            width: 100%;
            justify-content: center;
          }
          .track-viewport {
            transform: none !important;
            mask-image: none;
            -webkit-mask-image: none;
          }
        }
      `}</style>
    </section>
  )
}