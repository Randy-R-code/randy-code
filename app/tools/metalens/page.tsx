import { ToolHeader } from "@/components/layout/tool-header";
import { ToolPageShell } from "@/components/layout/tool-page-shell";
import { brand } from "@/lib/brand";
import { MetaLens } from "@/metalens/components/metalens";
import { ScanSearch } from "lucide-react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "MetaLens — Randy Code",
  description:
    "Inspect page metadata, Open Graph tags, Twitter cards, canonical URLs, robots directives and more.",
  alternates: { canonical: "/tools/metalens" },
};

export const viewport: Viewport = {
  themeColor: brand.colors.green[500],
};

export default function MetaLensPage() {
  return (
    <ToolPageShell>
      <main className="flex min-h-screen flex-col bg-background px-6 pb-16 text-foreground">
        <div className="mx-auto w-full max-w-5xl">
          <ToolHeader
            icon={ScanSearch}
            label="Developer Tool"
            title="MetaLens"
            tagline="Inspect metadata, social cards and indexing signals from any public web page."
            color={brand.colors.green[500]}
          />
          <MetaLens />
        </div>
      </main>
    </ToolPageShell>
  );
}
