import { parse, type HTMLElement } from "node-html-parser";
import type { PageIcon, RawMetadata } from "./types";

/** `undefined` for empty/whitespace-only values — a tag existing with no useful content is not "present" (spec §38). */
function nonEmpty(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Real-world pages sometimes use `name=` instead of `property=` for Open
 * Graph tags (and, more rarely, the reverse for Twitter) — check both
 * attributes, case-insensitively, rather than assuming spec-correct markup.
 */
function getMetaContent(root: HTMLElement, key: string): string | undefined {
  for (const meta of root.querySelectorAll("meta")) {
    const attrKey = (
      meta.getAttribute("property") ?? meta.getAttribute("name")
    )?.toLowerCase();
    if (attrKey === key) {
      const content = nonEmpty(meta.getAttribute("content"));
      if (content) return content;
    }
  }
  return undefined;
}

function getAllMetaContent(root: HTMLElement, key: string): string[] {
  const values: string[] = [];
  for (const meta of root.querySelectorAll("meta")) {
    const attrKey = (
      meta.getAttribute("property") ?? meta.getAttribute("name")
    )?.toLowerCase();
    if (attrKey === key) {
      const content = nonEmpty(meta.getAttribute("content"));
      if (content) values.push(content);
    }
  }
  return values;
}

function relTokens(link: HTMLElement): string[] {
  return (link.getAttribute("rel") ?? "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Extracts every metadata field MetaLens needs from a single parse pass
 * (spec §153). Purely structural — no URL resolution (relative hrefs are
 * returned as-is; `resolve-urls.ts` handles that against the final
 * response URL and any `<base href>`).
 */
export function parseHtmlMetadata(html: string): RawMetadata {
  const root = parse(html, { lowerCaseTagName: true });

  const titles = root
    .querySelectorAll("title")
    .map((el) => nonEmpty(el.text))
    .filter((t): t is string => t !== undefined);

  const descriptions = getAllMetaContent(root, "description");
  const canonicalLinks = root
    .querySelectorAll("link")
    .filter((link) => relTokens(link).includes("canonical"))
    .map((link) => nonEmpty(link.getAttribute("href")))
    .filter((href): href is string => href !== undefined);

  const robotsContent = getMetaContent(root, "robots");
  const robots = robotsContent
    ? robotsContent
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean)
    : [];

  const icons: PageIcon[] = root
    .querySelectorAll("link")
    .filter((link) => {
      const tokens = relTokens(link);
      return (
        tokens.includes("icon") ||
        tokens.includes("apple-touch-icon") ||
        tokens.includes("apple-touch-icon-precomposed")
      );
    })
    .map((link) => ({
      rel: link.getAttribute("rel") ?? "",
      url: link.getAttribute("href") ?? "",
      type: nonEmpty(link.getAttribute("type")),
      sizes: nonEmpty(link.getAttribute("sizes")),
    }))
    .filter((icon) => icon.url !== "");

  const hreflang = root
    .querySelectorAll("link")
    .filter(
      (link) =>
        relTokens(link).includes("alternate") &&
        nonEmpty(link.getAttribute("hreflang")) &&
        nonEmpty(link.getAttribute("href")),
    )
    .map((link) => ({
      language: link.getAttribute("hreflang") as string,
      url: link.getAttribute("href") as string,
    }));

  const manifestHref = root
    .querySelectorAll("link")
    .find((link) => relTokens(link).includes("manifest"))
    ?.getAttribute("href");

  return {
    titles,
    description: descriptions[0]
      ? { content: descriptions[0], duplicateCount: descriptions.length }
      : undefined,
    canonical: canonicalLinks[0]
      ? { href: canonicalLinks[0], duplicateCount: canonicalLinks.length }
      : undefined,
    robots,
    viewport: getMetaContent(root, "viewport"),
    lang: nonEmpty(root.querySelector("html")?.getAttribute("lang")),
    baseHref: nonEmpty(root.querySelector("base")?.getAttribute("href")),

    openGraph: {
      title: getMetaContent(root, "og:title"),
      description: getMetaContent(root, "og:description"),
      images: getAllMetaContent(root, "og:image"),
      url: getMetaContent(root, "og:url"),
      type: getMetaContent(root, "og:type"),
      siteName: getMetaContent(root, "og:site_name"),
      locale: getMetaContent(root, "og:locale"),
    },

    twitter: {
      card: getMetaContent(root, "twitter:card"),
      title: getMetaContent(root, "twitter:title"),
      description: getMetaContent(root, "twitter:description"),
      image: getMetaContent(root, "twitter:image"),
      site: getMetaContent(root, "twitter:site"),
      creator: getMetaContent(root, "twitter:creator"),
    },

    icons,
    manifest: nonEmpty(manifestHref),
    hreflang,
  };
}
