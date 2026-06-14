"use client"

import { useProfile } from "@/lib/hooks/useprofile"
import { usePortfolio } from "@/lib/portfolio-context"
import Link from "next/link"

export function HeroSection() {
  const { activePortfolio } = usePortfolio()
  const profile = useProfile()

  if (!profile) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </section>
    )
  }

  const role = activePortfolio === "developer" ? "Full-Stack Developer" : "Digital Artist"
  const firstName = profile.name.split(" ")[1]

  return (
    <section
      className="relative bg-white dark:bg-background flex flex-col items-center justify-start pt-24 pb-12"
      style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden", minHeight: "100svh" }}
    >
      {/* Hello badge */}
      {/* <div className="inline-flex items-center gap-2 border border-foreground/80 rounded-full px-4 py-1.5 text-sm font-medium text-foreground mb-5 z-10 mx-4">
        Hello!
        <span
          className="text-primary"
          style={{ display: "inline-block", animation: "spinStar 4s linear infinite" }}
        >
          ✦
        </span>
      </div> */}

      {/* Headline */}
      <h1
        className="text-center font-extrabold leading-tight text-foreground z-10 mb-0 w-full"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(26px, 8vw, 80px)",
          lineHeight: 1.08,
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        I&apos;m <span className="text-primary">{firstName},</span>
        <br />
        {role}
      </h1>

      {/* Stage */}
      <div
        className="relative w-full flex justify-center mt-3"
        // style={{
        //   height: "clamp(220px, 48vw, 400px)",
        //   maxWidth: "min(720px, 100vw)",
        //   boxSizing: "border-box",
        // }}
        style={{
  height: "clamp(220px, 55vw, 400px)",
  width: "100%",
  boxSizing: "border-box",
}}
      >
        {/* Left panel — md+ only */}
        <div
          className="absolute z-[6] hidden md:block"
          style={{
            left: "clamp(0px, 2vw, 24px)",
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: "clamp(100px, 18vw, 160px)",
          }}
        >
          <p className="text-xs font-medium leading-relaxed mb-4 text-primary">
            {firstName}&apos;s work brought our school platform to life. Highly recommended!
          </p>
          <div
            className="font-extrabold text-foreground"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px, 2.8vw, 30px)" }}
          >
            {profile.stats.projectsCompleted}+
          </div>
          <div className="text-xs text-muted-foreground mt-1">Projects Completed</div>
        </div>

        {/* Primary-colored circle */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full z-[1] bg-primary"
          // style={{
          //   width: "clamp(160px, 36vw, 320px)",
          //   height: "clamp(160px, 36vw, 320px)",
          // }}
          style={{
  width: "clamp(140px, 40vw, 320px)",
  height: "clamp(140px, 40vw, 320px)",
}}
        />

        {/* Avatar */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2] flex items-end justify-center"
          // style={{ height: "108%" }}
          style={{ height: "108%", maxWidth: "clamp(140px, 40vw, 280px)" }}
        >
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              // className="h-full w-auto object-cover object-top"
              // style={{
              //   filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.18))",
              //   maxWidth: "clamp(120px, 28vw, 280px)",
              // }}
              className="h-full w-full object-cover object-top"
style={{
  filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.18))",
}}
            />
          ) : (
            <div
              className="flex items-center justify-center h-full"
              style={{ width: "clamp(120px, 22vw, 220px)" }}
            >
              <span
                className="font-extrabold text-white/90"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(36px, 9vw, 80px)",
                }}
              >
                {profile.name.split(" ").map((n: string) => n[1]).join("")}
              </span>
            </div>
          )}
        </div>

        {/* Right panel — md+ only */}
        <div
          className="absolute z-[6] text-right hidden md:block"
          style={{
            right: "clamp(0px, 2vw, 24px)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <div className="text-base mb-1 text-primary" style={{ letterSpacing: "2px" }}>★★★★★</div>
          <div
            className="font-extrabold text-foreground leading-none"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px, 3vw, 36px)" }}
          >
            {profile.stats.yearsExperience} Years
          </div>
          <div className="text-sm text-muted-foreground mt-1 pb-2 border-b-[3px] border-primary text-right">
            Expert
          </div>
          <div className="text-xs text-muted-foreground mt-2">{profile.location}</div>
        </div>
      </div>

      {/* Stats row — mobile only */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-5 z-10 md:hidden px-4 box-border">
        <div className="text-center bg-primary/10 rounded-2xl py-3 px-2">
          <div
            className="font-extrabold text-primary"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px" }}
          >
            {profile.stats.projectsCompleted}+
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Projects</div>
        </div>
        <div className="text-center bg-primary/10 rounded-2xl py-3 px-2">
          <div
            className="font-extrabold text-primary"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px" }}
          >
            {profile.stats.yearsExperience}+
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Years Exp.</div>
        </div>
        <div className="text-center bg-primary/10 rounded-2xl py-3 px-2">
          <div
            className="font-extrabold text-primary"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px" }}
          >
            {profile.stats.happyClients}+
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Clients</div>
        </div>
      </div>

      {/* CTAs */}
      <div
        className="relative flex items-center justify-center gap-3 mt-6 z-10 w-full px-4 box-border"
        style={{ maxWidth: "320px" }}
      >
        <span
          className="absolute -left-1 -top-5 text-xl text-foreground hidden sm:block"
          style={{ animation: "arrowPulse 1.8s ease-in-out infinite" }}
        >
          ↪
        </span>

        <Link
          href="#work"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold text-primary-foreground bg-primary transition-all hover:-translate-y-1 active:scale-95 hover:bg-primary/90"
          style={{ boxShadow: "0 6px 20px hsl(var(--primary) / 0.35)" }}
        >
          Portfolio ↗
        </Link>

        <Link
          href="#contact"
          className="flex-1 flex items-center justify-center rounded-full py-3 text-sm font-semibold text-foreground border-2 border-foreground bg-transparent transition-all hover:-translate-y-1 hover:border-primary hover:text-primary active:scale-95"
        >
          Hire Me
        </Link>
      </div>

      {/* Social links */}
      {(profile.socialLinks?.github || profile.socialLinks?.linkedin || profile.socialLinks?.twitter) && (
        <div className="flex items-center gap-5 mt-7 z-10 flex-wrap justify-center px-4">
          {profile.socialLinks.github && (
            <Link
              href={profile.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              GitHub
            </Link>
          )}
          {profile.socialLinks.linkedin && (
            <Link
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              LinkedIn
            </Link>
          )}
          {profile.socialLinks.twitter && (
            <Link
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              Twitter
            </Link>
          )}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        @keyframes spinStar { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes arrowPulse { 0%,100%{transform:translateX(0)} 50%{transform:translateX(6px)} }
      `}</style>
    </section>
  )
}