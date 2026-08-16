import { ToolHeader } from "@/components/layout/tool-header";
import { ToolPageShell } from "@/components/layout/tool-page-shell";
import { JsonStudio } from "@/json-studio/components/json-studio";
import { brand } from "@/lib/brand";
import { Braces } from "lucide-react";
import type { Metadata, Viewport } from "next";

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
        </div>
      </main>
    </ToolPageShell>
  );
}
