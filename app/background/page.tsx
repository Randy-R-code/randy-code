import { PageShell } from "@/components/layout/page-shell";
import { Code2, Package, Wrench, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background — Randy World",
  description:
    "Avant le code : mécanique, électricité, installations terrain et logistique. Un profil technique construit sur plusieurs années d'expériences concrètes.",
};

const color = "#94a3b8";

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
      "Applications full-stack TypeScript / Next.js",
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

export default function BackgroundPage() {
  return (
    <PageShell
      label="Background"
      title="Un profil technique complet"
      tagline="De l'atelier à l'entrepôt, du chantier au code — plusieurs années d'expériences concrètes."
      color={color}
      icon="hardHat"
    >
      {/* Intro */}
      <section className="mb-12">
        <div
          className="rounded-xl border p-6"
          style={{
            borderColor: "#94a3b818",
            background: "oklch(0.13 0.012 252)",
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
      </section>

      {/* Domaines */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Domaines de compétences
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {domains.map(({ icon: Icon, title, tagline, intro, points }) => (
            <div
              key={title}
              className="rounded-xl border p-5"
              style={{
                borderColor: "#94a3b818",
                background: "oklch(0.13 0.012 252)",
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#94a3b818" }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="text-xs text-zinc-500">{tagline}</p>
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
                    <span className="mt-0.5 text-zinc-600">—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Leçons */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Ce que mon parcours m&apos;a appris
        </h2>
        <div
          className="rounded-xl border p-6"
          style={{
            borderColor: "#94a3b818",
            background: "oklch(0.13 0.012 252)",
          }}
        >
          <ul className="space-y-2.5">
            {lessons.map((lesson) => (
              <li
                key={lesson}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-0.5 text-zinc-600">—</span>
                {lesson}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
