import { ApiStudioWorkspace } from "@/api-studio/components/api-studio-workspace";
import { ToolAboutSection } from "@/components/layout/tool-about-section";
import { ToolHeader } from "@/components/layout/tool-header";
import { ToolPageShell } from "@/components/layout/tool-page-shell";
import { brand } from "@/lib/brand";
import { Send } from "lucide-react";
import type { Metadata, Viewport } from "next";

const ABOUT_ITEMS = [
  {
    title: "What is it?",
    content:
      "API Studio is a focused HTTP request client: build a request, send it through a secured backend proxy, and inspect the response — status, timing, size, headers and body — without fighting browser CORS restrictions.",
  },
  {
    title: "How to use it",
    content: (
      <ol className="list-decimal space-y-1 pl-4">
        <li>
          Pick a method, enter a URL, and configure params, headers, auth or a
          body.
        </li>
        <li>Send the request and review the response.</li>
        <li>
          Generate ready-to-use fetch or curl code, or revisit it later from
          local history.
        </li>
      </ol>
    ),
  },
  {
    title: "Why use it?",
    content:
      "Testing an API shouldn't require installing a desktop app. API Studio runs entirely in the browser, keeps your request history local, and reuses the same SSRF-hardened outbound proxy built for InfraLens — so it's safe to point at arbitrary public URLs.",
  },
];

export const metadata: Metadata = {
  title: "API Studio — Randy Code",
  description:
    "Build, send, and inspect HTTP requests directly from your browser. A focused request client with local history and instant fetch/curl code generation.",
  alternates: { canonical: "/tools/api-studio" },
};

export const viewport: Viewport = {
  themeColor: brand.colors.green[500],
};

export default function ApiStudioPage() {
  return (
    <ToolPageShell>
      <main className="flex min-h-screen flex-col overflow-x-hidden bg-background px-6 pb-16 text-foreground">
        <div className="mx-auto w-full max-w-5xl">
          <ToolHeader
            icon={Send}
            label="Developer Tool"
            title="API Studio"
            tagline="Build, send, and inspect HTTP requests."
            color={brand.colors.green[500]}
          />
          <ApiStudioWorkspace />
          <ToolAboutSection
            title="About API Studio"
            intro="A focused HTTP request client, built for fast debugging and inspection."
            items={ABOUT_ITEMS}
          />
        </div>
      </main>
    </ToolPageShell>
  );
}
