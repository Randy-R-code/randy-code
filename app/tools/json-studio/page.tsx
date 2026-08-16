import { ToolAboutSection } from "@/components/layout/tool-about-section";
import { ToolHeader } from "@/components/layout/tool-header";
import { ToolPageShell } from "@/components/layout/tool-page-shell";
import { JsonStudio } from "@/json-studio/components/json-studio";
import { brand } from "@/lib/brand";
import { Braces } from "lucide-react";
import type { Metadata, Viewport } from "next";

const ABOUT_ITEMS = [
  {
    title: "What is it?",
    content:
      "JSON Studio is a browser-based workspace for formatting, validating and exploring JSON data. It highlights syntax errors immediately and turns raw JSON into a readable, collapsible tree.",
  },
  {
    title: "How to use it",
    content: (
      <ol className="list-decimal space-y-1 pl-4">
        <li>Paste, type, or drop in a JSON file.</li>
        <li>Format or minify it, and browse the tree view.</li>
        <li>Copy or download the result.</li>
      </ol>
    ),
  },
  {
    title: "Why use it?",
    content:
      "Raw JSON is hard to scan and easy to break with a missing comma or bracket. JSON Studio catches syntax errors instantly and makes nested structures easy to read — useful for APIs, config files, and app payloads.",
  },
];

export const metadata: Metadata = {
  title: "JSON Studio — Randy Code",
  description:
    "Format, validate, minify and inspect JSON directly in your browser.",
  alternates: { canonical: "/tools/json-studio" },
};

export const viewport: Viewport = {
  themeColor: brand.colors.green[500],
};

export default function JsonStudioPage() {
  return (
    <ToolPageShell>
      <main className="flex min-h-screen flex-col bg-background px-6 pb-16 text-foreground">
        <div className="mx-auto w-full max-w-5xl">
          <ToolHeader
            icon={Braces}
            label="Developer Tool"
            title="JSON Studio"
            tagline="Validate, format and inspect JSON instantly."
            color={brand.colors.green[500]}
          />
          <JsonStudio />
          <ToolAboutSection
            title="About JSON Studio"
            intro="Work with JSON quickly, clearly and with confidence."
            color={brand.colors.green[500]}
            items={ABOUT_ITEMS}
          />
        </div>
      </main>
    </ToolPageShell>
  );
}
