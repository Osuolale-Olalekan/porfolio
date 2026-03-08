"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { usePortfolio } from "@/lib/portfolio-context";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

type Profile = {
  email: string;
  location: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
};

const initialState: ContactFormState = {
  success: false,
  message: "",
};

export function ContactSection() {
  const { activePortfolio } = usePortfolio();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  const resumeFile =
    activePortfolio === "developer"
      ? "/Olalekan_Abayomi_Resume.pdf"
      : "/Olalekan_Osuolale_Illustrator_Resume.pdf"
  const resumeName =
    activePortfolio === "developer"
      ? "Olalekan_Abayomi_Resume.pdf"
      : "Olalekan_Osuolale_Illustrator_Resume.pdf"

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
            Get in touch
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {"Let's Work Together"}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {activePortfolio === "developer"
              ? "Have a project in mind? I'd love to help you build something amazing. Let's discuss your ideas."
              : "Looking for creative artwork or illustrations? I'm here to bring your vision to life."}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Contact Information
              </h3>
              <p className="text-muted-foreground mb-6">
                Feel free to reach out through any of these channels. I
                typically respond within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${profile?.email}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {profile?.email ?? "—"}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">
                      {profile?.location ?? "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                Follow Me
              </h4>
              <div className="flex gap-3">
                {profile?.socialLinks.github && (
                  <Link
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                )}
                {profile?.socialLinks.linkedin && (
                  <Link
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                )}
                {profile?.socialLinks.twitter && (
                  <Link
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Resume — swaps based on active portfolio */}
            <div className="flex gap-3">
              <Button variant="outline" className="bg-transparent" asChild>
                <a href={resumeFile} target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              </Button>
              <Button variant="outline" className="bg-transparent" asChild>
                <a href={resumeFile} download={resumeName}>
                  Download Resume
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6 sm:p-8">
                {state.success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground">{state.message}</p>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                        />
                        {state.errors?.name && (
                          <p className="text-sm text-destructive">
                            {state.errors.name[0]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                        />
                        {state.errors?.email && (
                          <p className="text-sm text-destructive">
                            {state.errors.email[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type</Label>
                      <Select name="projectType">
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">
                            Web Development
                          </SelectItem>
                          <SelectItem value="illustration">
                            Illustration / Art
                          </SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project..."
                        rows={5}
                        required
                      />
                      {state.errors?.message && (
                        <p className="text-sm text-destructive">
                          {state.errors.message[0]}
                        </p>
                      )}
                    </div>

                    {state.message && !state.success && (
                      <p className="text-sm text-destructive">
                        {state.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}