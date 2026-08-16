import { brand } from "@/lib/brand";
import type { ReactNode } from "react";

interface ToolAboutItem {
  title: string;
  content: ReactNode;
}

interface ToolAboutSectionProps {
  title: string;
  intro: string;
  items: ToolAboutItem[];
}

/**
 * Compact "what/how/why" section shared by the lightweight /tools pages
 * (Cron Builder, JSON Studio, MetaLens, ...) — three short cards below the
 * tool itself, not a documentation area. InfraLens keeps its own larger
 * editorial content, but these cards share InfraLens's own neutral
 * `border-border bg-card/50` treatment (report/tool UI) rather than the
 * portfolio's saturated `surface[2]` cards (narrative UI) — see the other
 * tool-family components for the same convention.
 */
export function ToolAboutSection({
  title,
  intro,
  items,
}: ToolAboutSectionProps) {
  return (
    <section
      aria-labelledby="tool-about-heading"
      className="mt-16 border-t pt-10"
      style={{ borderColor: brand.colors.border.subtle }}
    >
      <h2
        id="tool-about-heading"
        className="mb-2 text-xl font-semibold text-white"
      >
        {title}
      </h2>
      <p className="mb-6 max-w-2xl text-sm text-zinc-400">{intro}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-border bg-card/50 p-5"
          >
            <h3 className="mb-1.5 text-sm font-semibold text-white">
              {item.title}
            </h3>
            <div className="text-sm leading-relaxed text-zinc-400">
              {item.content}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
