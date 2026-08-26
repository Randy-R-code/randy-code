import { posts } from "@/lib/blog";
import { projects } from "@/lib/projects";
import { tools } from "@/lib/tools";

export const dynamic = "force-static";

const BASE_URL = "https://randy-code.dev";

export async function GET() {
  const toolLines = tools
    .map(
      (tool) =>
        `- [${tool.name}](${BASE_URL}${tool.href}): ${tool.description}`,
    )
    .join("\n");

  const projectLines = projects
    .map(
      (project) =>
        `- [${project.name}](${BASE_URL}/projects/${project.slug}): ${project.tagline}`,
    )
    .join("\n");

  const articleLines = posts
    .map(
      (post) =>
        `- [${post.title}](${BASE_URL}/articles/${post.slug}): ${post.description}`,
    )
    .join("\n");

  const txt = `# Randy Code

> Développeur fullstack TypeScript. Sites vitrines, applications SaaS, apps mobiles, SEO local — des produits pensés pour être utiles et durables.

Portfolio de Randy Rimbault : études de cas de projets (produits, clients, expérimentations), une collection d'outils développeur gratuits et open source, et des articles techniques en français sur le développement web.

## Outils
${toolLines}

## Projets
${projectLines}

## Articles
${articleLines}

## Pages
- [À propos](${BASE_URL}/about): parcours, stack technique et méthode.
- [Contact](${BASE_URL}/contact): formulaire de contact.
- [Lab](${BASE_URL}/lab): expérimentations et boilerplates internes.
- [Confidentialité](${BASE_URL}/privacy): politique de confidentialité et sous-traitants.
`;

  return new Response(txt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
