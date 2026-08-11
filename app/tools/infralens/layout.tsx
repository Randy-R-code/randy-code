import { ToolBackLink } from "@/components/layout/tool-back-link";
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
  return (
    <div className="infralens-scope">
      <div className="bg-zinc-900 px-6 pt-4 sm:px-8 md:px-12">
        <div className="mx-auto max-w-4xl">
          <ToolBackLink />
        </div>
      </div>
      {children}
    </div>
  );
}
