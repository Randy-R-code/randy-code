import { HeroText } from "@/components/hero-text";
import { WorldMap } from "@/components/map/world-map";
import { brand } from "@/lib/brand";
import { getFeaturedProjects, statusLabel } from "@/lib/projects";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const featuredProjects = getFeaturedProjects();

const color = brand.colors.blue[400];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 pt-12 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <HeroText />
        <WorldMap />

        {/* Projets phares */}
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Projets phares
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <div
                key={project.slug}
                className="flex flex-col rounded-xl border p-6"
                style={{
                  borderColor: `${color}30`,
                  background: brand.colors.surface[2],
                }}
              >
                <span
                  className="mb-3 inline-block w-fit rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {statusLabel(project.status)}
                </span>
                <h3 className="text-lg font-bold text-white">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm text-zinc-400">
                  {project.tagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
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
                <div className="mt-5 flex items-center gap-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs font-medium text-zinc-300 hover:text-white"
                  >
                    Étude de cas →
                  </Link>
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:brightness-125"
                      style={{
                        borderColor: `${color}30`,
                        backgroundColor: `${color}0d`,
                        color,
                      }}
                    >
                      <ExternalLink size={11} />
                      Voir le produit
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Profil synthétique */}
        <section
          className="mt-16 border-t pt-10"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            Développeur TypeScript autodidacte, je construis des applications
            web complètes — du prototype au produit déployé. Avant le code,
            plusieurs années sur le terrain (mécanique, électricité, logistique)
            m&apos;ont appris à livrer des outils vraiment utilisables, pas
            juste fonctionnels.
          </p>
          <Link
            href="/about"
            className="mt-3 inline-block text-sm font-medium text-zinc-300 hover:text-white"
          >
            En savoir plus →
          </Link>
        </section>

        {/* CTA final */}
        <section
          className="mt-16 rounded-2xl border p-8 text-center"
          style={{
            borderColor: "var(--border-default)",
            background: brand.colors.surface[2],
          }}
        >
          <h2 className="text-lg font-semibold text-white">
            Un produit, un outil métier ou une idée à concrétiser ?
          </h2>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-85"
          >
            Discuter du projet
          </Link>
        </section>
      </div>
    </main>
  );
}
