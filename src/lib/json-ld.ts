import type { BlogPost } from "./blog";
import type { Project } from "./projects";

export function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Randy Rimbault",
    jobTitle: "Développeur Fullstack TypeScript",
    url: "https://randy-code.dev",
    description:
      "Développeur fullstack TypeScript. Sites vitrines, applications SaaS, SEO local.",
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

export function buildSoftwareApplicationSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.tagline,
    url:
      project.projectUrl ?? `https://randy-code.dev/projects/${project.slug}`,
    applicationCategory:
      project.type === "tool" ? "DeveloperApplication" : "WebApplication",
    author: {
      "@type": "Person",
      name: "Randy Rimbault",
      url: "https://randy-code.dev",
    },
  };
}
