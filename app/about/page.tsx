import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import { Code2, Lightbulb, Package, Wrench, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Base — Randy Code",
  description:
    "Randy Rimbault, développeur fullstack TypeScript. Parcours, vision, stack technique et contact.",
  alternates: { canonical: "/about" },
};

const stackTiers = [
  {
    label: "Principal",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "shadcn/ui"],
  },
  {
    label: "Backend et données",
    items: ["Node.js", "Prisma", "PostgreSQL", "Neon", "Upstash", "Zod"],
  },
  {
    label: "Produit et infrastructure",
    items: [
      "Better Auth",
      "Stripe",
      "Resend",
      "Mux",
      "Inngest",
      "Vercel",
      "Scaleway",
    ],
  },
  {
    label: "Expérimentations",
    items: ["OpenAI", "Mistral", "Anthropic"],
  },
];

const values = [
  {
    icon: Code2,
    title: "Pragmatique",
    desc: "Je choisis les outils adaptés au problème, pas les plus tendance. La simplicité est une feature.",
  },
  {
    icon: Wrench,
    title: "Produit-first",
    desc: "Je code pour résoudre un problème business. La technique est au service de la valeur livrée.",
  },
  {
    icon: Lightbulb,
    title: "Autonome",
    desc: "Je prends des initiatives. Vous n'avez pas à tout spécifier — je sais ce qu'il faut faire.",
  },
];

const domains = [
  {
    icon: Wrench,
    title: "Mécanique",
    tagline: "Diagnostic & précision",
    intro:
      "La mécanique m'a appris à lire un problème avant d'agir, à comprendre les systèmes dans leur ensemble et à ne jamais négliger les détails. Travailler sur des véhicules haut de gamme, c'est accepter qu'il n'y a pas de place pour l'approximation.",
    points: [
      "Diagnostic et réparation sur véhicules haut de gamme",
      "Respect strict des normes constructeur",
      "Lecture de schémas et documentation technique",
      "Culture du détail et de la fiabilité",
    ],
  },
  {
    icon: Zap,
    title: "Électricité & installations",
    tagline: "Terrain & mise en œuvre",
    intro:
      "Les travaux d'électricité et les installations terrain m'ont confronté aux contraintes du monde réel : les plans ne correspondent jamais exactement à ce qu'on trouve sur place. Ça forme une vraie capacité d'adaptation.",
    points: [
      "Câblage, raccordement et mise en service",
      "Fabrication et installation d'enseignes lumineuses",
      "Travaux de rénovation et interventions chantier",
      "Adaptation aux contraintes terrain",
    ],
  },
  {
    icon: Package,
    title: "Logistique",
    tagline: "Flux & organisation",
    intro:
      "La logistique et la gestion de stock m'ont apporté une vraie vision de l'organisation, des flux, des priorités et de l'importance des petits détails dans un système bien pensé. Aujourd'hui encore, ça influence ma façon de concevoir un projet ou une interface.",
    points: [
      "Gestion complète d'entrepôt et optimisation des stocks",
      "Réception, stockage, expédition",
      "Coordination avec les équipes de production",
      "Suivi des commandes et respect des délais",
    ],
  },
  {
    icon: Code2,
    title: "Développement web",
    tagline: "Applications & produits",
    intro:
      "Le développement web est venu compléter ce parcours de façon naturelle. Construire des outils utiles, comprendre les besoins réels, livrer quelque chose de fiable — c'est exactement ce que j'ai cherché à faire dans chaque poste avant ça.",
    points: [
      "Formation autodidacte structurée depuis 2025",
      "Applications fullstack TypeScript / Next.js",
      "Projets SaaS de A à Z en autonomie complète",
      "Veille technique et amélioration continue",
    ],
  },
];

const lessons = [
  "Un bon outil doit être simple à comprendre et facile à utiliser",
  "Les vrais problèmes sont souvent très concrets, pas théoriques",
  "La rigueur compte autant que la créativité",
  "Un système mal pensé crée vite des frictions inutiles",
  "Ce qui est fiable et clair vaut souvent plus que ce qui est impressionnant",
];

export default function AboutPage() {
  return (
    <PageShell
      label="About Base"
      title="Randy Rimbault"
      tagline="Développeur fullstack TypeScript. Je construis des produits qui fonctionnent."
      color={brand.colors.blue[400]}
      icon="user"
    >
      {/* Bio */}
      <section className="mb-12">
        <div
          className="rounded-xl border p-6"
          style={{
            borderColor: `${brand.colors.blue[400]}18`,
            background: brand.colors.surface[2],
          }}
        >
          <p className="text-sm leading-relaxed text-zinc-300">
            Autodidacte en développement web, j&apos;ai appris à coder en
            parallèle de mon activité professionnelle — en partant de
            JavaScript/React, puis en me spécialisant sur TypeScript et Next.js
            à travers des projets concrets dès le départ.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Je travaille sur des applications web complètes — des sites vitrines
            performants aux SaaS avec auth, facturation et IA intégrée. Mon
            approche : clarté du code, qualité de l&apos;expérience utilisateur,
            et livraison de valeur.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            En parallèle, je développe{" "}
            <span className="font-medium text-zinc-200">Liflow</span> et{" "}
            <span className="font-medium text-zinc-200">InfraLens</span>, deux
            projets produit qui me permettent de rester proche des contraintes
            réelles d&apos;un builder.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-white">Ma méthode</h2>
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border p-5"
              style={{
                borderColor: `${brand.colors.blue[400]}18`,
                background: brand.colors.surface[2],
              }}
            >
              <div
                className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${brand.colors.blue[400]}18` }}
              >
                <Icon size={14} style={{ color: brand.colors.blue[400] }} />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white">
                {title}
              </h3>
              <p className="text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parcours & expérience terrain */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Parcours &amp; expérience terrain
        </h2>
        <div
          className="mb-6 rounded-xl border p-6"
          style={{
            borderColor: `${brand.colors.blue[400]}18`,
            background: brand.colors.surface[2],
          }}
        >
          <p className="text-sm leading-relaxed text-zinc-300">
            Avant de me tourner sérieusement vers le développement web,
            j&apos;ai travaillé pendant plusieurs années dans des environnements
            très concrets : mécanique automobile, fabrication, installation
            électrique, logistique, gestion de stock et coordination de
            production.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            J&apos;ai évolué dans des postes où il fallait être à la fois
            autonome, rigoureux, adaptable — et capable de gérer des contraintes
            réelles au quotidien. Avec le temps, j&apos;ai réalisé que cette
            expérience terrain m&apos;a appris quelque chose de fondamental pour
            le dev : un bon outil ne doit pas seulement être bien fait, il doit
            surtout être{" "}
            <span className="font-medium text-zinc-200">
              clair, fiable et réellement utile
            </span>
            .
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {domains.map(({ icon: Icon, title, tagline, intro, points }) => (
            <div
              key={title}
              className="rounded-xl border p-5"
              style={{
                borderColor: `${brand.colors.blue[400]}18`,
                background: brand.colors.surface[2],
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${brand.colors.blue[400]}18` }}
                >
                  <Icon size={16} style={{ color: brand.colors.blue[400] }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="text-xs text-zinc-400">{tagline}</p>
                </div>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-zinc-400">
                {intro}
              </p>
              <ul className="space-y-1.5">
                {points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-xs text-zinc-400"
                  >
                    <span className="mt-0.5 text-zinc-400">—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-4 rounded-xl border p-6"
          style={{
            borderColor: `${brand.colors.blue[400]}18`,
            background: brand.colors.surface[2],
          }}
        >
          <h3 className="mb-3 text-sm font-semibold text-white">
            Ce que mon parcours m&apos;a appris
          </h3>
          <ul className="space-y-2.5">
            {lessons.map((lesson) => (
              <li
                key={lesson}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-0.5 text-zinc-400">—</span>
                {lesson}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Stack */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Stack technique
        </h2>
        <div className="flex flex-col gap-4">
          {stackTiers.map((tier) => (
            <div key={tier.label}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {tier.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tier.items.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium text-zinc-300"
                    style={{
                      borderColor: `${brand.colors.blue[400]}18`,
                      background: brand.colors.surface[2],
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="mb-2 text-xl font-semibold text-white">Me contacter</h2>
        <p className="mb-6 text-sm text-zinc-400">
          Vous avez un projet, une question ou juste envie d&apos;échanger ?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: `${brand.colors.blue[400]}18`,
            color: brand.colors.blue[400],
            border: `1px solid ${brand.colors.blue[400]}30`,
          }}
        >
          Écrivez-moi →
        </Link>
      </section>
    </PageShell>
  );
}
