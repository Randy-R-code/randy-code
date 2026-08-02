import { PageShell } from "@/components/layout/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab Zone — Randy Code",
  description:
    "Expérimentations techniques de Randy : IA, prototypes, idées en cours. Un espace pour tester sans contraintes.",
};

const experiments = [
  {
    id: "01",
    title: "Automatisation avec OpenClaw",
    status: "Usage quotidien",
    statusColor: "#10b981",
    tags: ["OpenClaw", "Automation", "Assistant IA"],
    desc: "OpenClaw automatise mes tâches répétitives au quotidien : gestion des mails, prise de rendez-vous et rappels partagés, listes. Au-delà de l'automatisation, il fait aussi office d'assistant IA au jour le jour.",
  },
  {
    id: "02",
    title: "Boilerplate SaaS — Convex",
    status: "En cours",
    statusColor: "#f59e0b",
    tags: ["Convex", "TanStack Start", "SaaS Boilerplate"],
    desc: "Starter interne pour lancer un SaaS rapidement : Convex remplace Prisma/PostgreSQL pour la base de données et le temps réel, avec auth, facturation, uploads et analytics déjà câblés.",
  },
  {
    id: "03",
    title: "Boilerplate mobile — Expo & Convex",
    status: "En cours",
    statusColor: "#f59e0b",
    tags: ["Expo", "React Native", "Convex", "Better Auth"],
    desc: "Deuxième starter interne, pensé mobile : React Native (Expo) sur le même socle Convex/Better Auth que le boilerplate web, pour lancer une app aussi vite qu'un SaaS.",
  },
  {
    id: "04",
    title: "Génération de pages SEO locales",
    status: "En pause",
    statusColor: "#94a3b8",
    tags: ["LLM", "Next.js", "ISR"],
    desc: "Pipeline pour générer automatiquement des pages SEO locales à partir d'une base de données de villes et de métiers. En pause — reprendra avec le site vitrine automobile quand ce projet redémarrera.",
  },
  {
    id: "05",
    title: "Assistant portfolio IA",
    status: "En réflexion",
    statusColor: "#94a3b8",
    tags: ["Claude API", "Next.js", "Streaming"],
    desc: 'Un assistant intégré qui permet de naviguer dans le portfolio en langage naturel. "Montre-moi les projets SEO", "C\'est quoi Liflow".',
  },
];

export default function LabPage() {
  return (
    <PageShell
      label="Lab Zone"
      title="Expérimentations"
      tagline="Des idées qu'on teste. Certaines deviennent des produits, d'autres restent des preuves de concept."
      color="#f59e0b"
      icon="flask"
    >
      <div className="flex flex-col gap-5">
        {experiments.map((exp) => (
          <article
            key={exp.id}
            className="rounded-xl border p-6"
            style={{
              borderColor: "#f59e0b18",
              background: "oklch(0.13 0.012 252)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: "#f59e0b" }}
                >
                  Expérience #{exp.id}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `${exp.statusColor}15`,
                    color: exp.statusColor,
                  }}
                >
                  {exp.status}
                </span>
              </div>
              <div className="flex flex-wrap justify-end gap-1.5">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                    style={{ background: "oklch(0.18 0.012 252)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="mt-3 text-base font-semibold text-white">
              {exp.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {exp.desc}
            </p>
          </article>
        ))}
      </div>

      {/* Idées en attente */}
      <section className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Sur le radar
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "RAG sur documentation technique",
            "CLI pour scaffolding Next.js",
            "Dashboard analytics léger",
            "Générateur de contrats freelance",
          ].map((idea) => (
            <span
              key={idea}
              className="rounded-lg border px-3 py-1.5 text-xs text-zinc-500"
              style={{
                borderColor: "#f59e0b10",
                background: "oklch(0.11 0.01 252)",
              }}
            >
              {idea}
            </span>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
