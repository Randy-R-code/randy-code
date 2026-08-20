import { Icon, renderToolOgImage } from "@/components/og/tool-og-image";
import { brand } from "@/lib/brand";
import { TOOL_CATEGORY_LABELS } from "@/lib/tools";

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

// Raw node data from lucide-react's check icon (dist/esm/icons/check.mjs).
const CHECK_ICON = [["path", { d: "M20 6 9 17l-5-5" }]] as const;

const color = brand.colors.green[500];

// Same fields the real MetaLens report surfaces first (title/description/
// og:image/canonical) — a representative subset, not the full report.
const METADATA_ROWS = ["title", "description", "og:image", "canonical"];

// Real randy-code.dev title/description (app/layout.tsx), the same values
// MetaLens itself reports when analyzing this site — a fabricated example
// here would mean an actual analysis contradicts its own OG card, exactly
// what example-report.ts already avoids for InfraLens. The description is
// truncated to a real prefix, the way a search engine snippet would.
const preview = (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    {/* Mirrors the real tool's own "Search preview" card */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: brand.colors.surface[1],
        border: `1px solid ${brand.colors.border.subtle}`,
        borderRadius: 10,
        padding: "14px 16px",
      }}
    >
      <span
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontSize: 13,
          color: brand.colors.text.secondary,
        }}
      >
        randy-code.dev
      </span>
      <span
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 18,
          color: brand.colors.blue[300],
          marginTop: 4,
        }}
      >
        Randy Rimbault — Développeur fullstack TypeScript
      </span>
      <span
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontSize: 14,
          color: brand.colors.text.secondary,
          lineHeight: 1.4,
          marginTop: 4,
        }}
      >
        Développeur fullstack TypeScript. Sites vitrines, applications SaaS…
      </span>
    </div>

    <div
      style={{
        display: "flex",
        height: 1,
        background: "rgba(255,255,255,0.08)",
        margin: "20px 0",
      }}
    />

    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      {METADATA_ROWS.map((label) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 15,
              color: brand.colors.text.secondary,
            }}
          >
            {label}
          </span>
          <Icon nodes={CHECK_ICON} color={color} size={15} />
        </div>
      ))}
    </div>
  </div>
);

export default async function Image() {
  return renderToolOgImage({
    title: "MetaLens",
    tagline:
      "Inspect metadata, social cards and indexing signals from any public web page.",
    color,
    iconNodes: SCAN_SEARCH_ICON,
    label: TOOL_CATEGORY_LABELS["web-api"],
    preview,
  });
}
