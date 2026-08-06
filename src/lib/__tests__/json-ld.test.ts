import { describe, expect, it } from "vitest";
import type { BlogPost } from "../blog";
import { buildArticleSchema, buildPersonSchema } from "../json-ld";

describe("buildPersonSchema", () => {
  it("returns a valid schema.org Person", () => {
    const schema = buildPersonSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Person");
    expect(schema.name).toBe("Randy Rimbault");
    expect(schema.url).toBe("https://randy-code.dev");
    expect(schema.knowsAbout.length).toBeGreaterThan(0);
  });
});

describe("buildArticleSchema", () => {
  const post: BlogPost = {
    slug: "un-article-de-test",
    title: 'Un titre avec des "guillemets" & un <tag>',
    description: "Une description de test.",
    date: "2026-01-01",
    tags: ["Test"],
    readingTime: 3,
    content: "<p>Contenu</p>",
  };

  it("returns a valid schema.org Article derived from the post", () => {
    const schema = buildArticleSchema(post);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe(post.title);
    expect(schema.datePublished).toBe(post.date);
    expect(schema.url).toBe(`https://randy-code.dev/blog/${post.slug}`);
    expect(schema.author["@type"]).toBe("Person");
  });

  it("round-trips through JSON.stringify without breaking on special characters", () => {
    const schema = buildArticleSchema(post);
    const parsed = JSON.parse(JSON.stringify(schema));
    expect(parsed.headline).toBe(post.title);
  });
});
