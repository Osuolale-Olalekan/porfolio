import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/db/projects";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-8 -ml-2">
          <Link href="/#work">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        {/* Hero Image */}
        {project.image && (
          <div className="rounded-xl overflow-hidden mb-8 bg-muted">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              variant={project.category === "dev" ? "default" : "secondary"}
            >
              {project.category === "dev" ? "Development" : "Art & Design"}
            </Badge>
            {project.featured && <Badge>Featured</Badge>}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            {project.description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline" className="bg-transparent">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full description */}
        {project.longDescription && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              About this project
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {project.longDescription}
            </p>
          </div>
        )}

        {/* Gallery */}
        {project.gallery?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Gallery
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {project.gallery.map((img: string, i: number) => (
                <div
                  key={i}
                  className="aspect-video rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
