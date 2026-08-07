const heroContent = {
  eyebrow: "Développeur TypeScript",
  headline:
    "Développeur TypeScript, je construis des applications web et des outils métier pensés pour des usages réels.",
  tagline: "React, Next.js et TypeScript — du prototype au produit déployé.",
  seoTitle: "Ce que je construis",
  seoItems: [
    "Applications SaaS complètes — authentification, paiement, multi-tenant",
    "Applications mobiles avec Expo & React Native, connectées au même backend",
    "Outils web utiles et outils métier fondés sur des besoins réels",
    "Interfaces soignées, du prototype au produit déployé",
  ],
  seoClose:
    "Je travaille principalement avec Next.js, TypeScript et Tailwind CSS pour construire des projets fiables et évolutifs.",
};

export function HeroText() {
  const { eyebrow, headline, tagline } = heroContent;
  return (
    <header className="mb-10">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
        {eyebrow}
      </p>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl">
        {headline}
      </h1>
      <p className="mt-3 max-w-lg text-base text-zinc-400">{tagline}</p>
    </header>
  );
}

export function SeoBlock() {
  const { seoTitle, seoItems, seoClose } = heroContent;
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
