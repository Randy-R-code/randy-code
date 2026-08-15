import { PageShell } from "@/components/layout/page-shell";
import { CronBuilder } from "@/cron-builder/components/cron-builder";
import { CronReference } from "@/cron-builder/components/cron-reference";
import { brand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Builder — Randy Code",
  description:
    "Build, validate, and understand cron expressions with a visual editor and upcoming execution preview.",
  alternates: { canonical: "/tools/cron-builder" },
};

export default function CronBuilderPage() {
  return (
    <PageShell
      label="Developer Tool"
      title="Cron Builder"
      tagline="Build, validate, and understand cron expressions without memorizing the syntax."
      color={brand.colors.green[500]}
      icon="clock"
    >
      <CronBuilder />
      <CronReference />
    </PageShell>
  );
}
