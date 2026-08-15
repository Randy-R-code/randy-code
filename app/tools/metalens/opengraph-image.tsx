import { renderToolOgImage } from "@/components/og/tool-og-image";
import { brand } from "@/lib/brand";

export const runtime = "nodejs";
export const alt = "MetaLens — Randy Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Raw node data from lucide-react's scan-search icon
// (dist/esm/icons/scan-search.mjs), with Lucide's internal `key` field
// dropped — see tool-og-image.tsx.
const SCAN_SEARCH_ICON = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["circle", { cx: "12", cy: "12", r: "3" }],
  ["path", { d: "m16 16-1.9-1.9" }],
] as const;

export default async function Image() {
  return renderToolOgImage({
    title: "MetaLens",
    tagline:
      "Inspect metadata, social cards and indexing signals from any public web page.",
    color: brand.colors.green[500],
    iconNodes: SCAN_SEARCH_ICON,
  });
}
