import { brand } from "@/lib/brand";
import { buildSoftwareApplicationSchema } from "@/lib/json-ld";
import { getProject, projects, statusLabel } from "@/lib/projects";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const SOFTWARE_APPLICATION_SLUGS = new Set(["liflow", "infralens"]);

type Props = { params: Promise<{ slug: string }> };

const color = brand.colors.blue[400];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Randy Code`,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="flex-1 px-6 pt-8 pb-16">
      {SOFTWARE_APPLICATION_SLUGS.has(project.slug) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildSoftwareApplicationSchema(project)),
          }}
        />
      )}
      <div className="mx-auto w-full max-w-3xl">
        {/* Breadcrumbs */}
        <nav
          aria-label="Fil d'Ariane"
          className="mb-4 flex items-center gap-1.5 text-xs text-zinc-400"
        >
          <Link href="/" className="hover:text-zinc-300">
            Accueil
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects" className="hover:text-zinc-300">
            Projets
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-zinc-400">
            {project.name}
          </span>
        </nav>

        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft size={12} />
          Tous les projets
        </Link>

        {/* Hero */}
        <header className="mb-10">
          <span
            className="mb-3 inline-block w-fit rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {statusLabel(project.status)}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-3 max-w-xl text-base text-zinc-400">
            {project.tagline}
          </p>
        </header>

        {/* Contenu */}
        <div className="flex flex-col gap-6">
          {(project.caseStudy
            ? [
                { label: "Contexte", text: project.caseStudy.context },
                { label: "Problème", text: project.problem },
                { label: "Objectifs", text: project.caseStudy.objectives },
                { label: "Rôle", text: project.caseStudy.role },
                {
                  label: "Solution",
                  text: project.caseStudy.solution ?? project.solution,
                },
                { label: "Architecture", text: project.caseStudy.architecture },
                {
                  label: "Choix techniques",
                  text: project.caseStudy.technicalChoices,
                },
                { label: "Difficultés", text: project.caseStudy.difficulties },
                {
                  label: "Sécurité et confidentialité",
                  text: project.caseStudy.security,
                },
                { label: "Résultat", text: project.result },
                { label: "Enseignements", text: project.caseStudy.learnings },
              ].filter((section): section is { label: string; text: string } =>
                Boolean(section.text),
              )
            : [
                { label: "Problème", text: project.problem },
                { label: "Solution", text: project.solution },
                { label: "Résultat", text: project.result },
              ]
          ).map(({ label, text }) => {
            const isResult = label === "Résultat";
            const sectionColor = isResult ? brand.colors.green[500] : color;
            return (
              <section
                key={label}
                className="rounded-xl border p-6"
                style={{
                  borderColor: `${sectionColor}18`,
                  background: brand.colors.surface[2],
                }}
              >
                <h2
                  className={
                    isResult
                      ? "mb-2 text-sm font-semibold uppercase tracking-wider"
                      : "mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400"
                  }
                  style={isResult ? { color: sectionColor } : undefined}
                >
                  {label}
                </h2>
                <p className="text-sm leading-relaxed text-zinc-300">{text}</p>
              </section>
            );
          })}
        </div>

        {/* Stack */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400">Stack :</span>
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md px-2 py-0.5 text-[10px] font-medium text-zinc-300"
              style={{ background: brand.colors.surface[3] }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Liens */}
        {project.projectUrl && (
          <div className="mt-8">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: `${color}18`,
                color,
                border: `1px solid ${color}30`,
              }}
            >
              Voir le produit <ExternalLink size={12} />
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
