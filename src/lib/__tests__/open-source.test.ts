import { describe, expect, it } from "vitest";
import { openSourceProjects } from "../open-source";

describe("openSourceProjects", () => {
  it("is not empty", () => {
    expect(openSourceProjects.length).toBeGreaterThan(0);
  });

  it("each project has required fields", () => {
    for (const project of openSourceProjects) {
      expect(project.name).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.tags.length).toBeGreaterThan(0);
      expect(project.githubUrl).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it("has unique names", () => {
    const names = openSourceProjects.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
