import { env } from "@infralens-config/env";
import type { Metadata } from "next";

// Get the base URL from environment variable or use localhost for development
const baseUrl =
  env.siteUrl ||
  (env.vercelUrl ? `https://${env.vercelUrl}` : "http://localhost:3000");

export const siteMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
