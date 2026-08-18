export type FindingSeverity =
  | "success"
  | "warning"
  | "missing"
  | "invalid"
  | "info";

export type MetadataFinding = {
  id: string;
  severity: FindingSeverity;
  title: string;
  description: string;
  field?: string;
};

export type PageIcon = {
  rel: string;
  url: string;
  type?: string;
  sizes?: string;
};

export type HreflangEntry = {
  language: string;
  url: string;
};

export type OpenGraphMetadata = {
  title?: string;
  description?: string;
  image?: string;
  imageCount: number;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
};

export type TwitterMetadata = {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
  site?: string;
  creator?: string;
};

export type SearchPreviewData = {
  hostname: string;
  title?: string;
  description?: string;
};

export type SocialPreviewData = {
  hostname: string;
  title?: string;
  description?: string;
  image?: string;
  usesFallback: boolean;
};

export type MetadataAnalysis = {
  requestedUrl: string;
  finalUrl: string;
  redirectCount: number;

  page: {
    title?: string;
    description?: string;
    canonical?: string;
    robots: string[];
    viewport?: string;
    lang?: string;
  };

  openGraph: OpenGraphMetadata;
  twitter: TwitterMetadata;

  icons: PageIcon[];
  manifest?: string;
  hreflang: HreflangEntry[];

  previews: {
    search: SearchPreviewData;
    social: SocialPreviewData;
  };

  findings: MetadataFinding[];
};

/** Raw values pulled straight out of the parsed document, before URL resolution and finding derivation. */
export type RawMetadata = {
  titles: string[];
  description?: { content: string; duplicateCount: number };
  canonical?: { href: string; duplicateCount: number };
  robots: string[];
  viewport?: string;
  lang?: string;
  baseHref?: string;

  openGraph: {
    title?: string;
    description?: string;
    images: string[];
    url?: string;
    type?: string;
    siteName?: string;
    locale?: string;
  };

  twitter: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    site?: string;
    creator?: string;
  };

  icons: PageIcon[];
  manifest?: string;
  hreflang: HreflangEntry[];
};
