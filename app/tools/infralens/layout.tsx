import { siteMetadata } from "@infralens-lib/metadata";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: "#14b894",
};

// Does not wrap `children` in ToolPageShell (unlike the other tools' own
// page.tsx) — a layout wraps not-found.tsx too, and this segment's 404
// deliberately skips the "Retour aux outils" link for a cleaner single-CTA
// page. Every other InfraLens page applies ToolPageShell itself instead.
export default function InfraLensLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
