import { ToolAboutSection } from "@/components/layout/tool-about-section";
import { ToolHeader } from "@/components/layout/tool-header";
import { ToolPageShell } from "@/components/layout/tool-page-shell";
import { brand } from "@/lib/brand";
import { MetaLens } from "@/metalens/components/metalens";
import { ScanSearch } from "lucide-react";
import type { Metadata, Viewport } from "next";

const ABOUT_ITEMS = [
  {
    title: "What is it?",
    content:
      "MetaLens inspects a public page's metadata — title, description, Open Graph tags, Twitter cards, canonical URL and more — and shows exactly how it will appear in search results and social shares.",
  },
  {
    title: "How to use it",
    content: (
      <ol className="list-decimal space-y-1 pl-4">
        <li>Enter a public URL and run the analysis.</li>
        <li>Review the search and social previews, plus every field.</li>
        <li>Check the findings for anything missing or misconfigured.</li>
      </ol>
    ),
  },
  {
    title: "Why use it?",
    content:
      "Metadata shapes how a page is described in search results and how it looks when shared on social platforms. MetaLens surfaces what's actually there — and what's missing — before it becomes a silent problem.",
  },
];

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
          <ToolAboutSection
            title="About MetaLens"
            intro="Understand the metadata behind any web page at a glance."
            color={brand.colors.green[500]}
            items={ABOUT_ITEMS}
          />
        </div>
      </main>
    </ToolPageShell>
  );
}
