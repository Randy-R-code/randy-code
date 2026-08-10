import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tools Station — Randy Code",
  description:
    "Outils développeur créés par Randy Rimbault. InfraLens, l'analyseur technique de sites web open source.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <PageShell
      label="Tools Station"
      title="Outils"
      tagline="Des outils réellement utilisables, pas des démonstrations."
      color={brand.colors.green[500]}
      icon="wrench"
    >
      <section className="mb-12">
        <div
          className="rounded-2xl border p-8"
          style={{
            borderColor: `${brand.colors.green[500]}30`,
            background: brand.colors.surface[2],
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span
              className="inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${brand.colors.green[500]}18`,
                color: brand.colors.green[500],
              }}
            >
              Disponible
            </span>
            <Link
              href="/tools/infralens"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
            >
              Lancer l&apos;outil <ArrowRight size={10} />
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-white">InfraLens</h2>
          <p className="mt-2 max-w-lg text-sm text-zinc-400">
            Outil open source d&apos;inspection technique de sites web : DNS,
            TLS, headers HTTP et sécurité, infrastructure, robots.txt et
            sitemap, en un seul rapport lisible.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
            <Link
              href="/tools/infralens"
              className="text-white underline underline-offset-2 hover:text-zinc-300"
            >
              Ouvrir InfraLens
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/projects/infralens"
              className="underline underline-offset-2 hover:text-zinc-300"
            >
              Voir l&apos;étude de cas
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
