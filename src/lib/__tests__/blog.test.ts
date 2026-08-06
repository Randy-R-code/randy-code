import { describe, expect, it } from "vitest";
import { formatDate, getPost, posts } from "../blog";

describe("posts", () => {
  it("is not empty", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it("is sorted by date descending", () => {
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date) >= new Date(posts[i].date)).toBe(true);
    }
  });

  it("each post has required fields and a computed reading time", () => {
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.readingTime).toBeGreaterThan(0);
    }
  });

  it("has unique slugs", () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getPost", () => {
  it("returns a post for a valid slug", () => {
    const post = getPost("liflow-refonte-souvenirs-familiaux");
    expect(post).toBeDefined();
    expect(post?.slug).toBe("liflow-refonte-souvenirs-familiaux");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPost("does-not-exist")).toBeUndefined();
  });
});

describe("formatDate", () => {
  it("formats an ISO date in French", () => {
    expect(formatDate("2026-05-16")).toBe("16 mai 2026");
  });
});
