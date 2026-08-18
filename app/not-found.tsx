import { brand } from "@/lib/brand";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    // min-h-screen, not flex-1 — this sits between SiteHeader/SiteFooter in
    // the root layout, and flex-1 only gets whatever height is left over
    // after those, which on a page with this many footer nav columns left
    // almost nothing to center within (content hugging the header on top,
    // footer on the bottom). min-h-screen is the same fix already used by
    // InfraLens's own not-found.tsx, confirmed clean there.
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center">
        <p
          className="mb-4 font-mono text-7xl font-bold"
          style={{ color: brand.colors.blue[400] }}
        >
          404
        </p>
        <h1 className="mb-2 text-2xl font-bold text-white">Page introuvable</h1>
        <p className="mb-8 text-sm text-zinc-400">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-blue-500/30 hover:text-white"
          style={{
            borderColor: `${brand.colors.blue[400]}30`,
            background: brand.colors.surface[2],
          }}
        >
          <ArrowLeft size={14} />
          {/* WorldMap only renders md:block+ (src/components/map/world-map.tsx) — see the same fix in page-shell.tsx. */}
          <span className="hidden md:inline">Retour à la carte</span>
          <span className="md:hidden">Retour à l&apos;accueil</span>
        </Link>
      </div>
    </main>
  );
}
