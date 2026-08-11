import { CheckRunner } from "../types";

export const runAccessibilityCheck: CheckRunner<{
  hasLang: boolean;
  lang?: string;
  hasSkipLink: boolean;
  hasH1: boolean;
  h1Count: number;
  imagesWithoutAlt: number;
  totalImages: number;
  ariaLandmarks: string[];
}> = async ({ shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "accessibility",
      label: "Accessibility Hints",
      category: "metadata-stack",
      status: "error",
      summary: "Unable to analyze accessibility hints.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  const { html } = shared.page;

  const htmlLangMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const hasLang = !!htmlLangMatch;
  const lang = htmlLangMatch ? htmlLangMatch[1] : undefined;

  const skipLinkPatterns = [
    /href=["']#main/i,
    /href=["']#content/i,
    /href=["']#skip/i,
    /class=["'][^"']*skip[^"']*["']/i,
    /skip.{0,10}(to|link|nav)/i,
  ];
  const hasSkipLink = skipLinkPatterns.some((pattern) => pattern.test(html));

  const h1Matches = html.match(/<h1[^>]*>/gi) || [];
  const hasH1 = h1Matches.length > 0;
  const h1Count = h1Matches.length;

  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const totalImages = imgMatches.length;
  let imagesWithoutAlt = 0;
  for (const img of imgMatches) {
    if (!img.includes("alt=")) {
      imagesWithoutAlt++;
    }
  }

  const ariaLandmarks: string[] = [];
  const landmarkPatterns = [
    { pattern: /role=["']banner["']/i, name: "banner" },
    { pattern: /role=["']navigation["']/i, name: "navigation" },
    { pattern: /role=["']main["']/i, name: "main" },
    { pattern: /role=["']contentinfo["']/i, name: "contentinfo" },
    { pattern: /<header[^>]*>/i, name: "header" },
    { pattern: /<nav[^>]*>/i, name: "nav" },
    { pattern: /<main[^>]*>/i, name: "main" },
    { pattern: /<footer[^>]*>/i, name: "footer" },
  ];

  for (const { pattern, name } of landmarkPatterns) {
    if (pattern.test(html) && !ariaLandmarks.includes(name)) {
      ariaLandmarks.push(name);
    }
  }

  const issues: string[] = [];
  if (!hasLang) issues.push("missing lang attribute");
  if (!hasH1) issues.push("no h1 heading");
  if (h1Count > 1) issues.push(`multiple h1 (${h1Count})`);
  if (imagesWithoutAlt > 0)
    issues.push(`${imagesWithoutAlt} images without alt`);
  if (ariaLandmarks.length < 2) issues.push("few landmarks");

  let status: "pass" | "warning" | "fail" = "pass";
  let summary = "";

  if (issues.length === 0) {
    summary = "Good accessibility practices detected.";
  } else if (issues.length <= 2) {
    status = "warning";
    summary = `Minor issues: ${issues.join(", ")}.`;
  } else {
    // Several real accessibility gaps — a content finding, not a
    // technical failure of this check.
    status = "fail";
    summary = `Issues found: ${issues.join(", ")}.`;
  }

  return {
    id: "accessibility",
    label: "Accessibility Hints",
    category: "metadata-stack",
    status,
    summary,
    data: {
      hasLang,
      lang,
      hasSkipLink,
      hasH1,
      h1Count,
      imagesWithoutAlt,
      totalImages,
      ariaLandmarks,
    },
    limitations: [
      "This is a lightweight static check, not a complete accessibility audit — it only looks at a handful of observable HTML signals and can't evaluate keyboard navigation, color contrast, screen reader behavior, or anything that requires actually rendering the page.",
    ],
    durationMs: Math.round(performance.now() - start),
  };
};
