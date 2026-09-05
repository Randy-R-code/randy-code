export interface OpenSourceProject {
  name: string;
  description: string;
  tags: string[];
  href?: string;
  githubUrl: string;
  npmUrl?: string;
}

export const openSourceProjects: OpenSourceProject[] = [
  {
    name: "RepoCheckup",
    description:
      "CLI zero-config qui inspecte un repository JavaScript/TypeScript — configuration, outillage, tests et CI — et signale les incohérences qu'un reviewer expérimenté relèverait.",
    tags: ["CLI", "TypeScript", "npm"],
    githubUrl: "https://github.com/Randy-R-code/repo-checkup",
    npmUrl: "https://www.npmjs.com/package/repo-checkup",
  },
];
