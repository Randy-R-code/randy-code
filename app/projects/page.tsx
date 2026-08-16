import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import { projects, statusLabel } from "@/lib/projects";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects City — Randy Code",
  description:
    "Projets réalisés par Randy Rimbault, développeur fullstack TypeScript. InfraLens, sites clients et applications sur mesure.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <PageShell
      label="Projects City"
      title="Projets réalisés"
      tagline="Des problèmes réels, des solutions concrètes, des résultats mesurables."
      color={brand.colors.blue[400]}
      icon="building2"
    >
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="flex flex-col gap-4 rounded-xl border p-6"
            style={{
              borderColor: `${brand.colors.blue[400]}18`,
              background: brand.colors.surface[2],
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${brand.colors.blue[400]}18`,
                  color: brand.colors.blue[400],
                }}
              >
                {statusLabel(project.status)}
              </span>
            </div>

            <div className="flex flex-wrap content-start gap-1.5 lg:min-h-11">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `${brand.colors.blue[400]}18`,
                    color: brand.colors.blue[400],
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <h2 className="text-base font-semibold text-white">
              {project.name}
            </h2>

            <div className="flex flex-col gap-2.5 text-sm">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Problème
                </span>
                <p className="mt-0.5 text-zinc-400">{project.problem}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Solution
                </span>
                <p className="mt-0.5 text-zinc-400">{project.solution}</p>
              </div>
              <div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: brand.colors.blue[400] }}
                >
                  Résultat
                </span>
                <p className="mt-0.5 font-medium text-zinc-300">
                  {project.result}
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-4">
              <Link
                href={`/projects/${project.slug}`}
                className="text-xs font-medium"
                style={{ color: brand.colors.blue[400] }}
              >
                Étude de cas →
              </Link>
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium"
                  style={{ color: brand.colors.blue[400] }}
                >
                  Voir le projet <ExternalLink size={11} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <div
        className="mt-12 rounded-xl border p-6"
        style={{ borderColor: `${brand.colors.blue[400]}30` }}
      >
        <h2 className="text-lg font-semibold text-white">
          Un projet en tête ?
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Discutons-en. Je travaille avec des entrepreneurs et des équipes pour
          transformer des idées en produits qui fonctionnent.
        </p>
        <a
          href="/contact"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: `${brand.colors.blue[400]}18`,
            color: brand.colors.blue[400],
            border: `1px solid ${brand.colors.blue[400]}30`,
          }}
        >
          Me contacter →
        </a>
      </div>
    </PageShell>
  );
}
