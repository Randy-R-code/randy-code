import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import {
  TOOL_CATEGORY_LABELS,
  tools,
  type ToolCategory,
  type ToolEntry,
} from "@/lib/tools";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tools Station — Randy Code",
  description:
    "Outils développeur créés par Randy Rimbault. InfraLens, l'analyseur technique de sites web open source.",
  alternates: { canonical: "/tools" },
};

const CATEGORY_ORDER: ToolCategory[] = ["web-api", "developer-utilities"];

function ToolCard({ tool }: { tool: ToolEntry }) {
  return (
    <section
      className="flex flex-col rounded-2xl border p-8"
      style={{
        borderColor: `${brand.colors.green[500]}30`,
        background: brand.colors.surface[2],
      }}
    >
      <div
        className={`mb-4 flex items-center ${tool.logo || tool.icon ? "justify-between" : "justify-end"}`}
      >
        {tool.logo && (
          <div className="flex items-center gap-2">
            <Image
              src={tool.logo.src}
              alt={tool.logo.alt}
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="sr-only">{tool.name}</span>
          </div>
        )}
        {tool.icon && (
          <div className="flex items-center gap-2">
            <tool.icon
              className="h-5 w-5"
              style={{ color: brand.colors.green[500] }}
            />
            <span className="sr-only">{tool.name}</span>
          </div>
        )}
        <span
          className="inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${brand.colors.green[500]}18`,
            color: brand.colors.green[500],
          }}
        >
          {tool.status}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-foreground">{tool.name}</h2>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">
        {tool.description}
      </p>
      <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 text-xs text-muted-foreground">
        <Link
          href={tool.href}
          className="text-foreground underline underline-offset-2 hover:text-muted-foreground"
        >
          Ouvrir l&apos;outil
        </Link>
        {tool.caseStudyHref && (
          <>
            <span aria-hidden="true">·</span>
            <Link
              href={tool.caseStudyHref}
              className="underline underline-offset-2 hover:text-foreground"
            >
              Étude de cas
            </Link>
          </>
        )}
      </p>
    </section>
  );
}

export default function ToolsPage() {
  return (
    <PageShell
      label="Tools Station"
      title="Outils"
      tagline="Des outils réellement utilisables, pas des démonstrations."
      color={brand.colors.green[500]}
      icon="wrench"
    >
      <div className="flex flex-col gap-10">
        {CATEGORY_ORDER.map((category) => {
          const categoryTools = tools.filter((t) => t.category === category);
          if (categoryTools.length === 0) return null;

          return (
            <div key={category}>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {TOOL_CATEGORY_LABELS[category]}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
