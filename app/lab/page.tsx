import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab Zone — Randy Code",
  description:
    "Expérimentations techniques de Randy : IA, prototypes, idées en cours. Un espace pour tester sans contraintes.",
  alternates: { canonical: "/lab" },
};

const experiments = [
  {
    id: "01",
    title: "Automatisation avec OpenClaw",
    status: "Usage quotidien",
    statusColor: brand.colors.blue[400],
    tags: ["OpenClaw", "Automation", "Assistant IA"],
    desc: "OpenClaw lit et trie mes mails automatiquement à heure fixe, gère un calendrier partagé, envoie des rappels et tient des listes. Deux fois par jour, il relit l'historique de nos conversations pour mettre sa mémoire à jour tout seul — au-delà de l'automatisation, c'est un assistant IA à part entière dans mon quotidien.",
  },
  {
    id: "02",
    title: "Boilerplate SaaS — Convex",
    status: "Réutilisé activement",
    statusColor: brand.colors.blue[400],
    tags: ["Convex", "TanStack Start", "SaaS Boilerplate"],
    desc: "Starter interne pour lancer un SaaS rapidement, réutilisé sur mes projets clients et produits : Convex remplace Prisma/PostgreSQL pour la base de données et le temps réel, avec auth, facturation, uploads et analytics déjà câblés.",
  },
  {
    id: "03",
    title: "Boilerplate mobile — Expo & Convex",
    status: "Réutilisé activement",
    statusColor: brand.colors.blue[400],
    tags: ["Expo", "React Native", "Convex", "Better Auth"],
    desc: "Deuxième starter interne, pensé mobile et réutilisé sur les mêmes projets : React Native (Expo) sur le même socle Convex/Better Auth que le boilerplate web, pour lancer une app aussi vite qu'un SaaS.",
  },
];

export default function LabPage() {
  return (
    <PageShell
      label="Lab Zone"
      title="Expérimentations"
      tagline="Des idées qu'on teste. Certaines deviennent des produits, d'autres restent des preuves de concept."
      color={brand.colors.blue[400]}
      icon="flask"
    >
      <div className="flex flex-col gap-3 sm:gap-5">
        {experiments.map((exp) => (
          <article
            key={exp.id}
            className="rounded-xl border p-6"
            style={{
              borderColor: `${brand.colors.blue[400]}18`,
              background: brand.colors.surface[2],
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: brand.colors.blue[400] }}
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
                    style={{ background: brand.colors.surface[3] }}
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
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Sur le radar
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "RAG sur documentation technique",
            "CLI pour scaffolding Next.js",
            "Dashboard analytics léger",
            "Générateur de contrats freelance",
            "Assistant portfolio IA (langage naturel)",
          ].map((idea) => (
            <span
              key={idea}
              className="rounded-lg border px-3 py-1.5 text-xs text-zinc-400"
              style={{
                borderColor: `${brand.colors.blue[400]}10`,
                background: brand.colors.surface[1],
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
