import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

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
            <a
              href="https://infralens.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
            >
              infralens.dev <ExternalLink size={10} />
            </a>
          </div>

          <h2 className="text-2xl font-bold text-white">InfraLens</h2>
          <p className="mt-2 max-w-lg text-sm text-zinc-400">
            Outil open source d&apos;inspection technique de sites web : DNS,
            TLS, headers HTTP et sécurité, infrastructure, robots.txt et
            sitemap, en un seul rapport lisible.
          </p>
          <p className="mt-4 text-xs text-zinc-400">
            Aujourd&apos;hui disponible sur infralens.dev. Une intégration
            directe sur randy-code.dev/tools/infralens est prévue dans une phase
            ultérieure.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
