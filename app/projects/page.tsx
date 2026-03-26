import { PageShell } from "@/components/layout/page-shell";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects City — Randy World",
  description:
    "Projets réalisés par Randy Rimbault, développeur fullstack TypeScript. InfraLens, sites clients et applications sur mesure.",
};

const projects = [
  {
    title: "Site vitrine — Spécialiste automobile",
    tags: ["Next.js", "TypeScript", "SEO local", "Perpignan"],
    problem:
      "Artisan spécialisé en reprogrammation de clés, calculateurs ECU et recharge de climatisation, sans présence web pour capter des clients locaux.",
    solution:
      "Site vitrine optimisé SEO local avec pages de services dédiées, fiche Google Maps et structure pensée pour le référencement sur les requêtes métier.",
    result: "Site terminé, mise en ligne imminente.",
    link: null,
  },
  {
    title: "Liflow",
    tags: ["Next.js", "TypeScript", "Stripe", "Mistral AI", "Prisma"],
    problem:
      "Pas d'outil simple pour centraliser ses idées, notes, fichiers et todos au même endroit, avec chiffrement et accès multi-utilisateurs.",
    solution:
      "Application SaaS complète avec auth, abonnements Stripe, chiffrement de bout en bout et IA intégrée via Mistral pour enrichir le contenu.",
    result: "Application en développement actif, disponible sur liflow.app.",
    link: "https://liflow.app",
  },
  {
    title: "InfraLens",
    tags: ["Next.js", "TypeScript", "Node.js", "Vercel"],
    problem:
      "Les développeurs et DevOps doivent jongler entre plusieurs outils pour inspecter DNS, headers HTTP et TLS d'un site.",
    solution:
      "Application web qui centralise l'analyse complète d'une URL : DNS, headers HTTP et paramètres TLS en un seul endroit.",
    result: "Outil utilisé au quotidien, disponible sur infralens.dev.",
    link: "https://infralens.dev",
  },
];

export default function ProjectsPage() {
  return (
    <PageShell
      label="Projects City"
      title="Projets réalisés"
      tagline="Des problèmes réels, des solutions concrètes, des résultats mesurables."
      color="#22d3ee"
      icon="building2"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col gap-4 rounded-xl border p-6"
            style={{
              borderColor: "#22d3ee18",
              background: "oklch(0.13 0.012 252)",
            }}
          >
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                  style={{ backgroundColor: "#22d3ee12", color: "#22d3ee" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-base font-semibold text-white">
              {project.title}
            </h2>

            <div className="flex flex-col gap-2.5 text-sm">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Problème
                </span>
                <p className="mt-0.5 text-zinc-400">{project.problem}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Solution
                </span>
                <p className="mt-0.5 text-zinc-400">{project.solution}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Résultat
                </span>
                <p className="mt-0.5 font-medium text-zinc-300">
                  {project.result}
                </p>
              </div>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: "#22d3ee" }}
              >
                Voir le projet <ExternalLink size={11} />
              </a>
            )}
          </article>
        ))}
      </div>

      <div
        className="mt-12 rounded-xl border p-6"
        style={{ borderColor: "#22d3ee20" }}
      >
        <h2 className="text-lg font-semibold text-white">
          Un projet en tête ?
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Discutons-en. Je travaille avec des entrepreneurs et des équipes pour
          transformer des idées en produits qui fonctionnent.
        </p>
        <a
          href="/about"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "#22d3ee18",
            color: "#22d3ee",
            border: "1px solid #22d3ee30",
          }}
        >
          Me contacter →
        </a>
      </div>
    </PageShell>
  );
}
