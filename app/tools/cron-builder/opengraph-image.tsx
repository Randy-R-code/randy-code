import { renderToolOgImage } from "@/components/og/tool-og-image";
import { brand } from "@/lib/brand";

export const runtime = "nodejs";
export const alt = "Cron Builder — Randy Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Raw node data from lucide-react's clock icon (dist/esm/icons/clock.mjs),
// with Lucide's internal `key` field dropped — see tool-og-image.tsx.
const CLOCK_ICON = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 6v6l4 2" }],
] as const;

export default async function Image() {
  return renderToolOgImage({
    title: "Cron Builder",
    tagline:
      "Build, validate, and understand cron expressions without memorizing the syntax.",
    color: brand.colors.green[500],
    iconNodes: CLOCK_ICON,
  });
}
