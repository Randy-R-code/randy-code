export const heroVariants = [
  {
    headline: "Développeur web — SaaS, SEO local & applications sur mesure",
    tagline:
      "Je conçois des sites et des applications utiles, pensés pour être rapides, clairs et réellement utilisés.",
    seoTitle: "Ce que je construis",
    seoItems: [
      "Sites web optimisés pour le SEO local (artisans, indépendants, PME)",
      "Applications SaaS avec authentification, paiement et gestion multi-utilisateurs",
      "Outils sur mesure pour simplifier des besoins concrets",
    ],
    seoClose:
      "Je travaille principalement avec Next.js, TypeScript et Prisma pour créer des projets fiables, évolutifs et performants.",
  },
  {
    headline:
      "Je conçois des applications web utiles et des sites qui génèrent des résultats",
    tagline: "SaaS, SEO local et outils sur mesure pour des besoins concrets.",
    seoTitle: "Ce que je fais",
    seoItems: [
      "Création d'applications SaaS complètes (authentification, paiement, multi-tenant)",
      "Développement de sites web pensés pour être visibles (SEO local)",
      "Conception d'outils simples pour résoudre des problèmes réels",
    ],
    seoClose:
      "Objectif : construire des produits efficaces, pas seulement du code.",
  },
  {
    headline: "Création de sites web et d'applications sur mesure",
    tagline:
      "SEO local, SaaS et outils adaptés aux besoins des indépendants et PME.",
    seoTitle: "Ce que je peux faire pour vous",
    seoItems: [
      "Créer un site web visible sur Google",
      "Développer une application adaptée à votre activité",
      "Mettre en place des solutions simples et efficaces",
    ],
    seoClose: "Chaque projet est pensé pour être utile, performant et durable.",
  },
];

interface HeroTextProps {
  variantIndex: number;
}

export function HeroText({ variantIndex }: HeroTextProps) {
  const { headline, tagline } = heroVariants[variantIndex];
  return (
    <header className="mb-10">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
        Développeur Fullstack Freelance
      </p>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl">
        {headline}
      </h1>
      <p className="mt-3 max-w-lg text-base text-zinc-400">{tagline}</p>
    </header>
  );
}

interface SeoBlockProps {
  variantIndex: number;
}

export function SeoBlock({ variantIndex }: SeoBlockProps) {
  const { seoTitle, seoItems, seoClose } = heroVariants[variantIndex];
  return (
    <section
      className="mt-12 border-t pt-10"
      style={{ borderColor: "oklch(1 0 0 / 6%)" }}
    >
      <h2 className="mb-4 text-lg font-semibold text-white">{seoTitle}</h2>
      <ul className="mb-3 flex flex-col gap-2">
        {seoItems.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm text-zinc-400"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/60" />
            {item}
          </li>
        ))}
      </ul>
      <p className="text-sm text-zinc-500">{seoClose}</p>
    </section>
  );
}
