import type { BlogPost } from "./blog";

export function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Randy Rimbault",
    jobTitle: "Développeur Fullstack Freelance",
    url: "https://randy-code.dev",
    description:
      "Développeur fullstack freelance spécialisé TypeScript / Next.js. Sites vitrines, applications SaaS, SEO local.",
    knowsAbout: [
      "TypeScript",
      "Next.js",
      "SEO local",
      "SaaS",
      "Développement web",
      "React",
      "Prisma",
    ],
  };
}

export function buildArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Randy Rimbault",
      url: "https://randy-code.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Randy Rimbault",
      url: "https://randy-code.dev",
    },
    url: `https://randy-code.dev/articles/${post.slug}`,
  };
}
