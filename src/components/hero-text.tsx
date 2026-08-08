import { ExternalLink } from "lucide-react";
import Link from "next/link";

const heroContent = {
  eyebrow: "Développeur TypeScript",
  headline:
    "Développeur TypeScript, je construis des applications web et des outils métier pensés pour des usages réels.",
  tagline: "React, Next.js et TypeScript — du prototype au produit déployé.",
};

export function HeroText() {
  const { eyebrow, headline, tagline } = heroContent;
  return (
    <header className="mb-10">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400">
        {eyebrow}
      </p>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl">
        {headline}
      </h1>
      <p className="mt-3 max-w-lg text-base text-zinc-400">{tagline}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-85"
        >
          Voir mes projets →
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/30 hover:text-white"
          style={{ borderColor: "oklch(1 0 0 / 14%)" }}
        >
          Me contacter
        </Link>
        <a
          href="https://github.com/Randy-R-code"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
        >
          <ExternalLink size={11} />
          GitHub
        </a>
      </div>
    </header>
  );
}
