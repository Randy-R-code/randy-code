import { buildFindings } from "./findings";
import { effectiveBase, resolveMetadataUrl } from "./resolve-urls";
import type { MetadataAnalysis, RawMetadata } from "./types";

type BuildAnalysisInput = {
  requestedUrl: string;
  finalUrl: string;
  redirectCount: number;
  raw: RawMetadata;
};

/**
 * Assembles the typed, UI-ready `MetadataAnalysis` from a parsed document's
 * raw metadata — resolves every relative URL (honoring `<base href>`) and
 * derives the indicative previews and findings. Pure: no network access,
 * so this is fully unit-testable against static HTML fixtures.
 */
export function buildAnalysis(input: BuildAnalysisInput): MetadataAnalysis {
  const { requestedUrl, finalUrl, redirectCount, raw } = input;
  const base = effectiveBase(finalUrl, raw.baseHref);
  const hostname = new URL(finalUrl).hostname;

  const title = raw.titles[0];
  const description = raw.description?.content;
  const canonical = resolveMetadataUrl(raw.canonical?.href, base);
  const ogUrl = resolveMetadataUrl(raw.openGraph.url, base);
  const ogImage = resolveMetadataUrl(raw.openGraph.images[0], base);
  const twitterImage = resolveMetadataUrl(raw.twitter.image, base);

  const icons = raw.icons.map((icon) => ({
    ...icon,
    url: resolveMetadataUrl(icon.url, base) ?? icon.url,
  }));
  const hreflang = raw.hreflang.map((entry) => ({
    ...entry,
    url: resolveMetadataUrl(entry.url, base) ?? entry.url,
  }));
  const manifest = resolveMetadataUrl(raw.manifest, base);

  const socialImage = twitterImage ?? ogImage;
  const socialTitle = raw.twitter.title ?? raw.openGraph.title ?? title;
  const socialDescription =
    raw.twitter.description ?? raw.openGraph.description ?? description;
  const usesFallback = !raw.twitter.title && !raw.twitter.image;

  const analysis: MetadataAnalysis = {
    requestedUrl,
    finalUrl,
    redirectCount,

    page: {
      title,
      description,
      canonical,
      robots: raw.robots,
      viewport: raw.viewport,
      lang: raw.lang,
    },

    openGraph: {
      title: raw.openGraph.title,
      description: raw.openGraph.description,
      image: ogImage,
      imageCount: raw.openGraph.images.length,
      url: ogUrl,
      type: raw.openGraph.type,
      siteName: raw.openGraph.siteName,
      locale: raw.openGraph.locale,
    },

    twitter: {
      card: raw.twitter.card,
      title: raw.twitter.title,
      description: raw.twitter.description,
      image: twitterImage,
      site: raw.twitter.site,
      creator: raw.twitter.creator,
    },

    icons,
    manifest,
    hreflang,

    previews: {
      search: {
        hostname,
        title,
        description,
      },
      social: {
        hostname,
        title: socialTitle,
        description: socialDescription,
        image: socialImage,
        usesFallback,
      },
    },

    findings: [],
  };

  analysis.findings = buildFindings({
    raw,
    title,
    description,
    canonical,
    finalUrl,
    ogUrl,
    ogImage,
  });

  return analysis;
}
