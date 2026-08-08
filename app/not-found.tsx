import { brand } from "@/lib/brand";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
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
          Retour à la carte
        </Link>
      </div>
    </main>
  );
}
