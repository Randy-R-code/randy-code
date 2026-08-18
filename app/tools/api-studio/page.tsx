import { ApiStudioPage as ApiStudioTabs } from "@/api-studio/components/api-studio-page";
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
      "API Studio is a focused HTTP workspace: build and send a request through a secured backend proxy, or generate a temporary URL and inspect real webhook traffic (Stripe, GitHub, ...) sent to it — both without fighting browser CORS restrictions or deploying anything.",
  },
  {
    title: "How to use it",
    content: (
      <ol className="list-decimal space-y-1 pl-4">
        <li>
          Request: pick a method, enter a URL, configure params, headers, auth
          or a body, and send it.
        </li>
        <li>
          Webhooks: create a temporary endpoint, point a service at it, and
          inspect what arrives — then Replay an event straight into the Request
          tab.
        </li>
        <li>
          Generate ready-to-use fetch or curl code, or revisit past requests
          from local history.
        </li>
      </ol>
    ),
  },
  {
    title: "Why use it?",
    content:
      "Testing an API shouldn't require installing a desktop app. API Studio runs directly from your browser and keeps your request history local — requests are sent through a secured backend proxy that reuses the same SSRF-hardened outbound fetch built for InfraLens, for both Request and Webhook replay, so it's safe to point at arbitrary public URLs.",
  },
];

export const metadata: Metadata = {
  title: "API Studio — Randy Code",
  description:
    "Build, send, receive, and inspect HTTP requests directly from your browser. A focused request client and webhook inspector with local history and instant fetch/curl code generation.",
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
            tagline="Build, send, receive, and inspect HTTP requests."
            color={brand.colors.green[500]}
          />
          <ApiStudioTabs />
          <ToolAboutSection
            title="About API Studio"
            intro="A focused HTTP request client and webhook inspector, built for fast debugging and inspection."
            items={ABOUT_ITEMS}
          />
        </div>
      </main>
    </ToolPageShell>
  );
}
