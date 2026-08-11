import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import type { Metadata } from "next";
import Image from "next/image";
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
            <div className="flex items-center gap-2">
              <Image
                src="/infralens/brand/logo-symbol.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="sr-only">InfraLens</span>
            </div>
            <span
              className="inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${brand.colors.green[500]}18`,
                color: brand.colors.green[500],
              }}
            >
              Disponible
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">InfraLens</h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Outil open source d&apos;inspection technique de sites web : DNS,
            TLS, headers HTTP et sécurité, infrastructure, robots.txt et
            sitemap, en un seul rapport lisible.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <Link
              href="/tools/infralens"
              className="text-foreground underline underline-offset-2 hover:text-muted-foreground"
            >
              Ouvrir l&apos;outil
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/projects/infralens"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Étude de cas
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
