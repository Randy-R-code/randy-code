import { describe, expect, it } from "vitest";
import { getFeaturedProjects, getProject, projects } from "../projects";

describe("projects", () => {
  it("is not empty", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("each project has required fields", () => {
    for (const project of projects) {
      expect(project.slug).toBeTruthy();
      expect(project.name).toBeTruthy();
      expect(project.tagline).toBeTruthy();
      expect(project.problem).toBeTruthy();
      expect(project.solution).toBeTruthy();
      expect(project.result).toBeTruthy();
      expect(project.technologies.length).toBeGreaterThan(0);
    }
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getProject", () => {
  it("returns a project for a valid slug", () => {
    const project = getProject("liflow");
    expect(project).toBeDefined();
    expect(project?.slug).toBe("liflow");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});

describe("getFeaturedProjects", () => {
  it("only returns projects marked as featured", () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});
