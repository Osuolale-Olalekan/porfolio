// lib/hooks/useProfile.ts
import { useEffect, useState } from "react"

type Profile = {
  name: string
  bio: string
  email: string
  location: string
  avatar: string
  title: string
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

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => { if (data?.name) setProfile(data) })
      .catch(console.error)
  }, [])

  return profile
}