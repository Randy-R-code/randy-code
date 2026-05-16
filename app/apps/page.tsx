import { PageShell } from "@/components/layout/page-shell";
import { AlarmClock, Brain, ExternalLink, Lock, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apps Station — Randy Code",
  description:
    "Applications SaaS développées par Randy Rimbault. Liflow et InfraLens — produits construits avec Next.js, TypeScript et Mistral AI.",
};

const liflowFeatures = [
  {
    icon: Zap,
    label: "Capture rapide",
    desc: "Un souvenir ajouté en moins de 10 secondes",
  },
  {
    icon: Lock,
    label: "100 % privé",
    desc: "Aucun contenu public, zéro algorithme",
  },
  {
    icon: AlarmClock,
    label: "Daily Memory",
    desc: "Un souvenir du passé remonté chaque matin",
  },
  {
    icon: Brain,
    label: "Récits IA",
    desc: "Histoires auto-générées par Mistral AI",
  },
];

export default function AppsPage() {
  return (
    <PageShell
      label="Apps Station"
      title="Applications & SaaS"
      tagline="Des produits pensés pour scaler, pas juste pour fonctionner."
      color="#8b5cf6"
      icon="rocket"
    >
      {/* Featured: Liflow */}
      <section className="mb-8">
        <div
          className="relative overflow-hidden rounded-2xl border p-8"
          style={{
            borderColor: "#8b5cf630",
            background: "oklch(0.13 0.012 252)",
          }}
        >
          <div
            className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: "#8b5cf6" }}
          />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <span
                className="inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: "#8b5cf620", color: "#8b5cf6" }}
              >
                Projet en cours
              </span>
              <a
                href="https://liflow.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
              >
                liflow.app <ExternalLink size={10} />
              </a>
            </div>

            <h2 className="text-2xl font-bold text-white">Liflow</h2>
            <p className="mt-2 max-w-lg text-sm text-zinc-400">
              Application mobile-first pour capturer et revivre les souvenirs
              familiaux. Timeline privée et chronologique, rappels automatiques
              du passé, récits générés par IA — sans algorithme ni réseau
              social.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {liflowFeatures.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="rounded-xl border p-3"
                  style={{
                    borderColor: "#8b5cf618",
                    background: "oklch(0.11 0.01 252)",
                  }}
                >
                  <Icon
                    size={14}
                    className="mb-1.5"
                    style={{ color: "#8b5cf6" }}
                  />
                  <p className="text-xs font-semibold text-white">{label}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500">Stack :</span>
              {[
                "Next.js",
                "TypeScript",
                "Better Auth",
                "Prisma",
                "PostgreSQL",
                "Upstash",
                "Mux",
                "Mistral AI",
                "Stripe",
                "Scaleway",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md px-2 py-0.5 text-[10px] font-medium text-zinc-300"
                  style={{ background: "oklch(0.18 0.012 252)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* InfraLens */}
      <section className="mb-12">
        <div
          className="rounded-2xl border p-8"
          style={{
            borderColor: "#8b5cf618",
            background: "oklch(0.13 0.012 252)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span
              className="inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: "#8b5cf618", color: "#a78bfa" }}
            >
              Disponible
            </span>
            <a
              href="https://infralens.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              infralens.dev <ExternalLink size={10} />
            </a>
          </div>

          <h2 className="text-2xl font-bold text-white">InfraLens</h2>
          <p className="mt-2 max-w-lg text-sm text-zinc-400">
            Outil d&apos;inspection de sites web pour développeurs et DevOps.
            Analyse DNS, headers HTTP et paramètres TLS en un seul endroit.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500">Stack :</span>
            {[
              "React",
              "Next.js",
              "TypeScript",
              "Tailwind CSS",
              "shadcn/ui",
              "Node.js",
              "Vercel",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-md px-2 py-0.5 text-[10px] font-medium text-zinc-300"
                style={{ background: "oklch(0.18 0.012 252)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: "#8b5cf620" }}
      >
        <h2 className="text-lg font-semibold text-white">
          Vous avez une idée de SaaS ?
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Je peux vous accompagner de la conception à la mise en production.
        </p>
        <a
          href="/about"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "#8b5cf618",
            color: "#8b5cf6",
            border: "1px solid #8b5cf630",
          }}
        >
          Discutons-en →
        </a>
      </div>
    </PageShell>
  );
}
