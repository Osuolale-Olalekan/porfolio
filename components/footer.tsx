import Link from "next/link"
import { Github, Linkedin, Twitter, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">OS</span>
              </div>
              <span className="font-semibold text-foreground">Osuolale Olalekan Abayomi</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Full-Stack Developer & Digital Artist creating beautiful,
              functional experiences.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://github.com/Osuolale-Olalekan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/olalekanabayomi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://x.com/OsuolaleOlalek5"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </Link>

              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#skills"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Skills
                </Link>
              </li>
              <li>
                <Link
                  href="#work"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">Web Development</li>
              {/* <li className="text-muted-foreground text-sm">Mobile Apps</li> */}
              <li className="text-muted-foreground text-sm">Digital Illustration</li>
              <li className="text-muted-foreground text-sm">Brand Design</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:osuolaleolalek7@gmail.com"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  osuolaleolalek7@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground text-sm">Osogbo, Nigeria</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Osuolale. All rights reserved.
          </p>
          {/* <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using Next.js
          </p> */}
        </div>
      </div>
    </footer>
  )
}
