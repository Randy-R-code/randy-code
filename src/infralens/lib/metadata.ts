import type { Metadata } from "next";

// No metadataBase here — InfraLens is natively part of randy-code now, not a
// standalone deployment, so it inherits the root layout's real
// `https://randy-code.dev` metadataBase (app/layout.tsx) instead of
// resolving OG/Twitter image URLs against whatever Vercel deployment
// preview happened to build the page.
export const siteMetadata: Metadata = {
  title: "InfraLens — Website inspection tool",
  description:
    "Inspect, analyze and understand any website infrastructure. Built for developers.",
  openGraph: {
    title: "InfraLens — Website inspection tool",
    description:
      "Inspect, analyze and understand any website infrastructure. Built for developers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InfraLens — Website inspection tool",
    description:
      "Inspect, analyze and understand any website infrastructure. Built for developers.",
  },
};
