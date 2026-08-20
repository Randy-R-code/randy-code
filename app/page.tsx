import { HeroText } from "@/components/hero-text";
import { WorldMap } from "@/components/map/world-map";
import { brand } from "@/lib/brand";
import { getFeaturedProjects, statusLabel } from "@/lib/projects";
import { tools } from "@/lib/tools";
import { ExternalLink, Wrench } from "lucide-react";
import Link from "next/link";

const featuredProjects = getFeaturedProjects();

const color = brand.colors.blue[400];
const toolsColor = brand.colors.green[500];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 pt-12 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <HeroText />
        <WorldMap />

        {/* Mon parcours */}
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Mon parcours
          </h2>
          <div
            className="flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: "var(--border-default)",
              background: brand.colors.surface[2],
            }}
          >
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">
              Développeur fullstack TypeScript, je construis des applications
              web complètes — du prototype au produit déployé. Avant le code,
              plusieurs années sur le terrain (mécanique, électricité,
              logistique) m&apos;ont appris à livrer des outils vraiment
              utilisables, pas juste fonctionnels.
            </p>
            <Link
              href="/about"
              className="inline-flex shrink-0 self-start items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all duration-200 hover:text-white sm:self-auto"
              style={{ borderColor: "var(--border-default)" }}
            >
              Mon parcours en détail →
            </Link>
          </div>
        </section>

        {/* Projets phares */}
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Projets phares
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {featuredProjects.map((project) => {
              const cardColor = project.type === "tool" ? toolsColor : color;
              return (
                <div
                  key={project.slug}
                  className="flex flex-col rounded-xl border p-6"
                  style={{
                    borderColor: `${cardColor}30`,
                    background: brand.colors.surface[2],
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="inline-block w-fit rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${cardColor}18`,
                        color: cardColor,
                      }}
                    >
                      {statusLabel(project.status)}
                    </span>
                    {project.type === "tool" && (
                      <Wrench
                        size={16}
                        aria-hidden="true"
                        style={{ color: cardColor }}
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {project.name}
                  </h3>
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
                          borderColor: `${cardColor}30`,
                          backgroundColor: `${cardColor}0d`,
                          color: cardColor,
                        }}
                      >
                        <ExternalLink size={11} />
                        Voir le produit
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Outils développeur */}
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Outils développeur
          </h2>
          <div
            className="flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: `${toolsColor}30`,
              background: brand.colors.surface[2],
            }}
          >
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-300">
              {tools.map((tool, i) => (
                <span key={tool.slug} className="contents">
                  <Link href={tool.href} className="hover:text-white">
                    {tool.name}
                  </Link>
                  {i < tools.length - 1 && (
                    <span aria-hidden="true" className="text-zinc-600">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </p>
            <Link
              href="/tools"
              className="inline-flex shrink-0 self-start items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:brightness-125 sm:self-auto"
              style={{
                borderColor: `${toolsColor}30`,
                backgroundColor: `${toolsColor}0d`,
                color: toolsColor,
              }}
            >
              Explorer les outils →
            </Link>
          </div>
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
