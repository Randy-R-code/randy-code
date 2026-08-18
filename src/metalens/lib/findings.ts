import { DESCRIPTION_GUIDANCE, TITLE_GUIDANCE } from "./constants";
import type { MetadataFinding, RawMetadata } from "./types";

type FindingsInput = {
  raw: RawMetadata;
  title?: string;
  description?: string;
  canonical?: string;
  finalUrl: string;
  ogUrl?: string;
  ogImage?: string;
};

/**
 * Targeted, conservative findings only — no global score (spec §43,
 * non-negotiable #5). Each check is independent and observable directly
 * from parsed metadata; nothing here claims to predict search/social
 * platform behavior (spec §129).
 */
export function buildFindings(input: FindingsInput): MetadataFinding[] {
  const { raw, title, description, canonical, finalUrl, ogUrl, ogImage } =
    input;
  const findings: MetadataFinding[] = [];

  // Title
  if (!title) {
    findings.push({
      id: "title-missing",
      severity: "missing",
      title: "Title is missing",
      description: "No <title> element was found on this page.",
      field: "title",
    });
  } else {
    if (raw.titles.length > 1) {
      findings.push({
        id: "title-duplicate",
        severity: "info",
        title: "Multiple <title> elements found",
        description: `${raw.titles.length} <title> elements were found — the first one was used.`,
        field: "title",
      });
    }
    if (title.length < TITLE_GUIDANCE.short) {
      findings.push({
        id: "title-short",
        severity: "info",
        title: "Title is short",
        description: `This title is ${title.length} characters, which is short and may not be descriptive enough.`,
        field: "title",
      });
    } else if (title.length > TITLE_GUIDANCE.long) {
      findings.push({
        id: "title-long",
        severity: "info",
        title: "Title is long",
        description:
          "This title is unusually long and may be truncated in some interfaces.",
        field: "title",
      });
    }
  }

  // Description
  if (!description) {
    findings.push({
      id: "description-missing",
      severity: "missing",
      title: "Meta description is missing",
      description: 'No <meta name="description"> content was found.',
      field: "description",
    });
  } else {
    if ((raw.description?.duplicateCount ?? 0) > 1) {
      findings.push({
        id: "description-duplicate",
        severity: "info",
        title: "Multiple meta descriptions found",
        description: `${raw.description?.duplicateCount} description tags were found — the first non-empty one was used.`,
        field: "description",
      });
    }
    if (description.length < DESCRIPTION_GUIDANCE.short) {
      findings.push({
        id: "description-short",
        severity: "info",
        title: "Description is short",
        description: `This description is ${description.length} characters, which is short.`,
        field: "description",
      });
    } else if (description.length > DESCRIPTION_GUIDANCE.long) {
      findings.push({
        id: "description-long",
        severity: "info",
        title: "Description is long",
        description:
          "This description is unusually long and may be truncated in some interfaces.",
        field: "description",
      });
    }
  }

  // Canonical
  if (!canonical) {
    if (raw.canonical?.href) {
      findings.push({
        id: "canonical-malformed",
        severity: "invalid",
        title: "Canonical URL could not be resolved",
        description: `"${raw.canonical.href}" is not a valid URL.`,
        field: "canonical",
      });
    } else {
      findings.push({
        id: "canonical-missing",
        severity: "missing",
        title: "Canonical URL is missing",
        description: 'No <link rel="canonical"> was found.',
        field: "canonical",
      });
    }
  } else {
    if ((raw.canonical?.duplicateCount ?? 0) > 1) {
      findings.push({
        id: "canonical-duplicate",
        severity: "info",
        title: "Multiple canonical links found",
        description: `${raw.canonical?.duplicateCount} canonical links were found — the first one was used.`,
        field: "canonical",
      });
    }
    if (canonical !== finalUrl) {
      findings.push({
        id: "canonical-differs",
        severity: "info",
        title: "Canonical differs from the fetched URL",
        description:
          "This may be intentional (e.g. a paginated or parameterized page pointing to a primary version).",
        field: "canonical",
      });
    }
  }

  // Robots
  const robotsLower = raw.robots.map((directive) => directive.toLowerCase());
  if (robotsLower.length === 0) {
    findings.push({
      id: "robots-not-specified",
      severity: "info",
      title: "Robots directive not specified",
      description:
        "No robots meta directive detected. Indexing and link following are allowed by default.",
      field: "robots",
    });
  }
  if (robotsLower.includes("noindex")) {
    findings.push({
      id: "robots-noindex",
      severity: "warning",
      title: "This page declares noindex",
      description:
        "Search engines that respect this directive should not index this page.",
      field: "robots",
    });
  }
  if (robotsLower.includes("nofollow")) {
    findings.push({
      id: "robots-nofollow",
      severity: "warning",
      title: "This page declares nofollow",
      description:
        "Search engines that respect this directive should not follow links from this page.",
      field: "robots",
    });
  }

  // Open Graph
  if (!raw.openGraph.title) {
    findings.push({
      id: "og-title-missing",
      severity: "missing",
      title: "Open Graph title is missing",
      description: "No og:title was found.",
      field: "openGraph.title",
    });
  }
  if (!raw.openGraph.description) {
    findings.push({
      id: "og-description-missing",
      severity: "missing",
      title: "Open Graph description is missing",
      description: "No og:description was found.",
      field: "openGraph.description",
    });
  }
  if (!ogImage) {
    findings.push({
      id: "og-image-missing",
      severity: "missing",
      title: "Open Graph image is missing",
      description: "No social preview image was found.",
      field: "openGraph.image",
    });
  }

  // Twitter / X
  if (!raw.twitter.card) {
    findings.push({
      id: "twitter-card-missing",
      severity: "info",
      title: "Twitter card type is not set",
      description: "No twitter:card was found.",
      field: "twitter.card",
    });
  }
  if (!raw.twitter.title && raw.openGraph.title) {
    findings.push({
      id: "twitter-title-fallback",
      severity: "info",
      title: "Twitter title falls back to Open Graph",
      description: "No twitter:title was found — og:title is used instead.",
      field: "twitter.title",
    });
  }
  if (!raw.twitter.image && ogImage) {
    findings.push({
      id: "twitter-image-fallback",
      severity: "info",
      title: "Twitter image falls back to Open Graph",
      description:
        "No twitter:image was found — the Open Graph image is used instead.",
      field: "twitter.image",
    });
  }
  if (!raw.twitter.site) {
    findings.push({
      id: "twitter-site-missing",
      severity: "info",
      title: "Twitter site is not set",
      description: "No twitter:site was found.",
      field: "twitter.site",
    });
  }
  if (!raw.twitter.creator) {
    findings.push({
      id: "twitter-creator-missing",
      severity: "info",
      title: "Twitter creator is not set",
      description: "No twitter:creator was found.",
      field: "twitter.creator",
    });
  }

  // URL consistency
  if (canonical && ogUrl && canonical !== ogUrl) {
    findings.push({
      id: "canonical-og-url-mismatch",
      severity: "info",
      title: "Canonical and Open Graph URL differ",
      description: "This may be intentional.",
      field: "openGraph.url",
    });
  }

  // Language
  if (!raw.lang) {
    findings.push({
      id: "lang-missing",
      severity: "missing",
      title: "Document language is not declared",
      description: "No lang attribute was found on <html>.",
      field: "lang",
    });
  }

  return findings;
}
