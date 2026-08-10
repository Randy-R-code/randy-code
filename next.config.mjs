/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/apps", destination: "/projects", permanent: true },
      { source: "/seo", destination: "/about", permanent: true },
      { source: "/background", destination: "/about", permanent: true },
      { source: "/blog", destination: "/articles", permanent: true },
      // Slugs énumérés explicitement — un wildcard /blog/:slug* entrerait
      // en collision avec les assets statiques servis sous public/blog/*.jpg
      {
        source: "/blog/liflow-refonte-souvenirs-familiaux",
        destination: "/articles/liflow-refonte-souvenirs-familiaux",
        permanent: true,
      },
      {
        source: "/blog/prix-site-web-2026",
        destination: "/articles/prix-site-web-2026",
        permanent: true,
      },
      {
        source: "/blog/beau-site-web-seo-google",
        destination: "/articles/beau-site-web-seo-google",
        permanent: true,
      },
      {
        source: "/blog/infralens-outil-open-source-analyse-performance-web",
        destination:
          "/articles/infralens-outil-open-source-analyse-performance-web",
        permanent: true,
      },
      {
        source:
          "/blog/ia-developpement-web-workflow-coder-sans-perdre-controle",
        destination:
          "/articles/ia-developpement-web-workflow-coder-sans-perdre-controle",
        permanent: true,
      },
      {
        source: "/blog/nextjs-16-recommencer-application-saas-zero",
        destination: "/articles/nextjs-16-recommencer-application-saas-zero",
        permanent: true,
      },
      {
        source: "/blog/creer-application-saas-retour-experience-liflow",
        destination:
          "/articles/creer-application-saas-retour-experience-liflow",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Phase 7 (RANDY_CODE_MASTER_PLAN.md) — InfraLens reste un dépôt séparé
    // (règle 3.6), exposé ici sous /tools/infralens/* via un simple proxy de
    // routing. INFRALENS_ORIGIN pointe vers infralens.dev aujourd'hui ; à
    // rebasculer vers l'URL de déploiement Vercel sous-jacente avant que ce
    // domaine ne soit retiré (décision déjà actée, master plan section 9.3),
    // sinon l'outil embarqué casserait avec le domaine.
    const infralensOrigin =
      process.env.INFRALENS_ORIGIN ?? "https://infralens.dev";

    return [
      {
        source: "/tools/infralens",
        destination: `${infralensOrigin}/tools/infralens`,
      },
      {
        source: "/tools/infralens/:path*",
        destination: `${infralensOrigin}/tools/infralens/:path*`,
      },
    ];
  },
  async headers() {
    // React utilise eval() en mode dev pour reconstruire les call stacks
    // (jamais en production — cf. son propre avertissement console). On
    // assouplit script-src uniquement ici pour retirer le bruit console en
    // local, sans toucher à la CSP réellement servie en production.
    const scriptSrc =
      process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline'";

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
