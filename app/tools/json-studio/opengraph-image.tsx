import { renderToolOgImage } from "@/components/og/tool-og-image";
import { brand } from "@/lib/brand";

export const runtime = "nodejs";
export const alt = "JSON Studio — Randy Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Raw node data from lucide-react's braces icon (dist/esm/icons/braces.mjs),
// with Lucide's internal `key` field dropped — see tool-og-image.tsx.
const BRACES_ICON = [
  [
    "path",
    {
      d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
    },
  ],
  [
    "path",
    {
      d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
    },
  ],
] as const;

export default async function Image() {
  return renderToolOgImage({
    title: "JSON Studio",
    tagline: "Validate, format and inspect JSON instantly.",
    color: brand.colors.green[500],
    iconNodes: BRACES_ICON,
  });
}
