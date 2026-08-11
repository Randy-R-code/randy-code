import { CompareClient } from "@infralens-components/compare/compare-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Compare reports — InfraLens",
  description: "Compare two InfraLens JSON exports, entirely in your browser.",
  alternates: { canonical: "/tools/infralens/compare" },
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-8 md:py-12 lg:py-16">
        <div className="space-y-8 md:space-y-10">
          <div className="space-y-4">
            <Link
              href="/tools/infralens"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Compare reports
              </h1>
              <p className="text-zinc-400">
                Drop in two JSON reports exported from InfraLens to see what
                changed — score, category breakdown, and every check that
                improved or regressed. Everything happens in your browser;
                neither file is ever sent anywhere.
              </p>
            </div>
          </div>

          <CompareClient />
        </div>
      </div>
    </main>
  );
}
