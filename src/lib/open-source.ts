export interface OpenSourceProject {
  name: string;
  description: string;
  tags: string[];
  href?: string;
  githubUrl: string;
  npmUrl?: string;
  articleSlug?: string;
}

export const openSourceProjects: OpenSourceProject[] = [
  {
    name: "RepoCheckup",
    description:
      "CLI zero-config qui inspecte un repository JavaScript/TypeScript — configuration, outillage, tests et CI — et signale les incohérences qu'un reviewer expérimenté relèverait.",
    tags: ["CLI", "TypeScript", "npm"],
    githubUrl: "https://github.com/Randy-R-code/repo-checkup",
    npmUrl: "https://www.npmjs.com/package/repo-checkup",
    articleSlug: "construire-moins-de-projets-vraiment-utiles",
  },
  {
    name: "CookieCheckup",
    description:
      "Un outil open source qui simule le cycle de vie d'un cookie HTTP : acceptation, stockage, matching des requêtes et accès JavaScript.",
    tags: ["Next.js", "React", "TypeScript"],
    href: "https://cookie-checkup.vercel.app",
    githubUrl: "https://github.com/Randy-R-code/cookie-checkup",
    articleSlug: "construire-moins-de-projets-vraiment-utiles",
  },
];
