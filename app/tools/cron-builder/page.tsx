import { ToolHeader } from "@/components/layout/tool-header";
import { ToolPageShell } from "@/components/layout/tool-page-shell";
import { CronBuilder } from "@/cron-builder/components/cron-builder";
import { CronReference } from "@/cron-builder/components/cron-reference";
import { brand } from "@/lib/brand";
import { Clock } from "lucide-react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Cron Builder — Randy Code",
  description:
    "Build, validate, and understand cron expressions with a visual editor and upcoming execution preview.",
  alternates: { canonical: "/tools/cron-builder" },
};

// Matches InfraLens's own tool-page theme color — the mobile browser chrome
// should read "tools" consistently across the whole /tools family.
export const viewport: Viewport = {
  themeColor: brand.colors.green[500],
};

export default function CronBuilderPage() {
  return (
    <ToolPageShell>
      <main className="flex min-h-screen flex-col bg-background px-6 pb-16 text-foreground">
        <div className="mx-auto w-full max-w-4xl">
          <ToolHeader
            icon={Clock}
            label="Developer Tool"
            title="Cron Builder"
            tagline="Build, validate, and understand cron expressions without memorizing the syntax."
            color={brand.colors.green[500]}
          />
          <CronBuilder />
          <CronReference />
        </div>
      </main>
    </ToolPageShell>
  );
}
