import { ToolPageShell } from "@/components/layout/tool-page-shell";
import { siteMetadata } from "@infralens-lib/metadata";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: "#14b894",
};

export default function InfraLensLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ToolPageShell>{children}</ToolPageShell>;
}
