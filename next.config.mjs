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
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
