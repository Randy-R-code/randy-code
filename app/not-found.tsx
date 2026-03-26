import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center">
        <p
          className="mb-4 font-mono text-7xl font-bold"
          style={{ color: "#22d3ee" }}
        >
          404
        </p>
        <h1 className="mb-2 text-2xl font-bold text-white">Zone introuvable</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-cyan-500/30 hover:text-white"
          style={{
            borderColor: "#22d3ee20",
            background: "oklch(0.13 0.012 252)",
          }}
        >
          <ArrowLeft size={14} />
          Retour à la map
        </Link>
      </div>
    </main>
  );
}
