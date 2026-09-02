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
  async headers() {
    // React utilise eval() en mode dev pour reconstruire les call stacks
    // (jamais en production — cf. son propre avertissement console), et
    // @vercel/analytics et @vercel/speed-insights chargent leur script de
    // debug depuis va.vercel-scripts.com en dev (en prod ils passent par
    // /_vercel/... en same-origin, déjà couvert par 'self'). On assouplit
    // script-src uniquement ici pour retirer le bruit console en local,
    // sans toucher à la CSP réellement servie en production.
    const scriptSrc =
      process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com"
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
            // script-src keeps 'unsafe-inline': removing it needs either
            // per-request nonces (Next.js requires dynamic rendering for
            // that — this site is ~100% statically prerendered, so that
            // would drop CDN caching/SSG sitewide) or the experimental SRI
            // feature, which doesn't cover React/Next's own inline
            // hydration scripts. Not worth the tradeoff here.
            // img-src allows https: on top of 'self' — MetaLens renders
            // social-preview images from arbitrary analyzed pages, already
            // gated to http(s) by isSafeExternalUrl() before reaching <img>.
            value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
