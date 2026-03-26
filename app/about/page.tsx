import { ContactForm } from "@/components/contact-form";
import { PageShell } from "@/components/layout/page-shell";
import { Code2, ExternalLink, Lightbulb, Wrench } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Base — Randy World",
  description:
    "Randy Rimbault, développeur fullstack TypeScript freelance. Parcours, vision, stack technique et contact.",
};

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Node.js",
  "Prisma",
  "PostgreSQL",
  "Redis",
  "Better Auth",
  "Zod",
  "Resend",
  "Stripe",
  "Vercel",
  "Scaleway",
  "Neon",
  "OpenAI",
  "Mistral",
  "Anthropic",
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

export default function AboutPage() {
  return (
    <PageShell
      label="About Base"
      title="Randy Rimbault"
      tagline="Développeur fullstack TypeScript. Je construis des produits qui fonctionnent."
      color="#ec4899"
      icon="user"
    >
      {/* Bio */}
      <section className="mb-12">
        <div
          className="rounded-xl border p-6"
          style={{
            borderColor: "#ec489918",
            background: "oklch(0.13 0.012 252)",
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
        <div className="grid gap-4 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border p-5"
              style={{
                borderColor: "#ec489918",
                background: "oklch(0.13 0.012 252)",
              }}
            >
              <div
                className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#ec489918" }}
              >
                <Icon size={14} style={{ color: "#ec4899" }} />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white">
                {title}
              </h3>
              <p className="text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Stack technique
        </h2>
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium text-zinc-300"
              style={{
                borderColor: "#ec489918",
                background: "oklch(0.13 0.012 252)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="mb-2 text-xl font-semibold text-white">Me contacter</h2>
        <p className="mb-6 text-sm text-zinc-400">
          Vous avez un projet, une question ou juste envie d&apos;échanger ? Je
          réponds vite.
        </p>
        <ContactForm />
        <div className="mt-4 flex items-center gap-3">
          <a
            href="https://github.com/Randy-R-code"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ExternalLink size={11} />
            GitHub — Randy-R-code
          </a>
        </div>
      </section>
    </PageShell>
  );
}
