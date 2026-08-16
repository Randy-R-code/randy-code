import { ToolAboutSection } from "@/components/layout/tool-about-section";
import { ToolHeader } from "@/components/layout/tool-header";
import { ToolPageShell } from "@/components/layout/tool-page-shell";
import { CronBuilder } from "@/cron-builder/components/cron-builder";
import { CronReference } from "@/cron-builder/components/cron-reference";
import { brand } from "@/lib/brand";
import { Clock } from "lucide-react";
import type { Metadata, Viewport } from "next";

const ABOUT_ITEMS = [
  {
    title: "What is it?",
    content:
      "Cron Builder is a visual editor for standard five-field cron expressions. It helps you create and understand recurring schedules used by servers, scripts, CI jobs and automated tasks.",
  },
  {
    title: "How to use it",
    content: (
      <ol className="list-decimal space-y-1 pl-4">
        <li>
          Configure the schedule visually, or edit the expression directly.
        </li>
        <li>Check the human-readable description and next runs.</li>
        <li>Copy the expression once it matches what you need.</li>
      </ol>
    ),
  },
  {
    title: "Why use it?",
    content:
      "Cron syntax is compact but easy to misread. Cron Builder makes the schedule explicit before you use it, reducing guesswork and common timing mistakes.",
  },
];

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
        <div className="mx-auto w-full max-w-5xl">
          <ToolHeader
            icon={Clock}
            label="Developer Tool"
            title="Cron Builder"
            tagline="Build, validate, and understand cron expressions without memorizing the syntax."
            color={brand.colors.green[500]}
          />
          <CronBuilder />
          <CronReference />
          <ToolAboutSection
            title="About Cron Builder"
            intro="Build reliable schedules without memorizing cron syntax."
            items={ABOUT_ITEMS}
          />
        </div>
      </main>
    </ToolPageShell>
  );
}
