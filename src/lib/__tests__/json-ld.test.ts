import { describe, expect, it } from "vitest";
import type { BlogPost } from "../blog";
import { games } from "../games";
import {
  buildArticleSchema,
  buildPersonSchema,
  buildSoftwareApplicationSchema,
  buildVideoGameSchema,
} from "../json-ld";
import { projects } from "../projects";

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
    expect(schema.url).toBe(`https://randy-code.dev/articles/${post.slug}`);
    expect(schema.author["@type"]).toBe("Person");
  });

  it("round-trips through JSON.stringify without breaking on special characters", () => {
    const schema = buildArticleSchema(post);
    const parsed = JSON.parse(JSON.stringify(schema));
    expect(parsed.headline).toBe(post.title);
  });
});

describe("buildVideoGameSchema", () => {
  it("links the store listing without rating or price claims", () => {
    const schema = buildVideoGameSchema(games[0]);
    expect(schema["@type"]).toBe("VideoGame");
    expect(schema.url).toBe(`https://randy-code.dev/games/${games[0].slug}`);
    expect(schema.downloadUrl).toBe(games[0].stores.googlePlay);
    expect(schema).not.toHaveProperty("offers");
    expect(schema).not.toHaveProperty("aggregateRating");
  });
});

describe("buildSoftwareApplicationSchema", () => {
  it("exposes the Google Play listing as downloadUrl when there is one", () => {
    const flonexa = projects.find((p) => p.slug === "flonexa");
    const liflow = projects.find((p) => p.slug === "liflow");
    if (!flonexa || !liflow) throw new Error("fixture projects missing");
    expect(buildSoftwareApplicationSchema(flonexa).downloadUrl).toBe(
      flonexa.playStoreUrl,
    );
    expect(buildSoftwareApplicationSchema(liflow)).not.toHaveProperty(
      "downloadUrl",
    );
  });
});
