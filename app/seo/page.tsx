import { PageShell } from "@/components/layout/page-shell";
import { Globe, MapPin, Search, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO District — Randy World",
  description:
    "Référencement local et création de sites vitrines pour artisans et PME partout en France. Audit SEO, Google Maps, sites performants.",
};

const services = [
  {
    icon: MapPin,
    title: "SEO local",
    desc: "Référencement Google Maps, fiches GMB, pages locales optimisées. Pour les artisans et PME qui veulent être trouvés dans leur ville.",
    color: "#10b981",
  },
  {
    icon: Globe,
    title: "Sites vitrines",
    desc: "Sites rapides, accessibles et indexables. Construits avec Next.js pour des scores Lighthouse > 95.",
    color: "#10b981",
  },
  {
    icon: Search,
    title: "Audit SEO",
    desc: "Analyse complète : structure, contenu, performances, backlinks. Un plan d'action concret pour progresser.",
    color: "#10b981",
  },
  {
    icon: TrendingUp,
    title: "Stratégie de contenu",
    desc: "Pages cibles, cocon sémantique, blog optimisé. Du contenu qui attire et convertit sur le long terme.",
    color: "#10b981",
  },
];

const cities = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Bordeaux",
  "Nantes",
  "Lille",
  "Strasbourg",
  "Rennes",
  "Montpellier",
  "Nice",
  "Perpignan",
  "Grenoble",
  "Dijon",
  "Rouen",
];

export default function SeoPage() {
  return (
    <PageShell
      label="SEO District"
      title="SEO local & sites vitrines"
      tagline="Être trouvé sur Google par les bons clients, au bon moment."
      color="#10b981"
      icon="globe"
    >
      {/* Services */}
      <section className="mb-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="rounded-xl border p-5"
              style={{
                borderColor: "#10b98118",
                background: "oklch(0.13 0.012 252)",
              }}
            >
              <div
                className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon size={14} style={{ color }} />
              </div>
              <h2 className="mb-1.5 text-sm font-semibold text-white">
                {title}
              </h2>
              <p className="text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zones géographiques */}
      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold text-white">
          Toute la France
        </h2>
        <p className="mb-4 text-sm text-zinc-400">
          Je travaille en 100&nbsp;% remote — peu importe où vous êtes en
          France.
        </p>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <span
              key={city}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs"
              style={{
                borderColor: "#10b98120",
                background: "oklch(0.13 0.012 252)",
                color: "#a1a1aa",
              }}
            >
              <MapPin size={10} style={{ color: "#10b981" }} />
              {city}
            </span>
          ))}
        </div>
      </section>

      {/* Approche */}
      <section className="mb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Technique d'abord",
              desc: "Structure propre, temps de chargement optimisé, balisage sémantique correct. Les bases que Google récompense.",
            },
            {
              title: "Contenu ciblé",
              desc: "Pages pensées pour les requêtes réelles de vos clients, pas pour faire du volume.",
            },
            {
              title: "Résultats durables",
              desc: "Le SEO bien fait prend du temps mais construit une visibilité qui ne disparaît pas du jour au lendemain.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border p-5"
              style={{
                borderColor: "#10b98118",
                background: "oklch(0.13 0.012 252)",
              }}
            >
              <p className="mb-1.5 text-sm font-semibold text-white">
                {item.title}
              </p>
              <p className="text-xs leading-relaxed text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: "#10b98120" }}
      >
        <h2 className="text-lg font-semibold text-white">
          Vous voulez plus de visibilité locale ?
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Audit gratuit de votre présence en ligne. Je vous dis exactement où
          vous en êtes et comment progresser.
        </p>
        <a
          href="/about"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "#10b98118",
            color: "#10b981",
            border: "1px solid #10b98130",
          }}
        >
          Demander un audit gratuit →
        </a>
      </div>
    </PageShell>
  );
}
