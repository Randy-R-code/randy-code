import liflow from "../../content/posts/creer-application-saas-retour-experience-liflow";
import aiDev from "../../content/posts/ia-developpement-web-workflow-coder-sans-perdre-controle";
import infralens from "../../content/posts/infralens-outil-open-source-analyse-performance-web";
import rebuilding from "../../content/posts/nextjs-16-recommencer-application-saas-zero";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601
  tags: string[];
  coverImage?: string;
  readingTime: number; // minutes, computed automatically
  content: string; // HTML
}

// Post files omit readingTime — it's computed here
export type PostData = Omit<BlogPost, "readingTime">;

function computeReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Pour ajouter un article : créer content/posts/[slug].ts et l'importer ici
const rawPosts: PostData[] = [infralens, aiDev, rebuilding, liflow];

export const posts: BlogPost[] = rawPosts.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
