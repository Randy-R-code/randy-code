import { renderToolOgImage } from "@/components/og/tool-og-image";
import { brand } from "@/lib/brand";

export const runtime = "nodejs";
export const alt = "API Studio — Randy Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Raw node data from lucide-react's send icon (dist/esm/icons/send.mjs),
// with Lucide's internal `key` field dropped — see tool-og-image.tsx.
const SEND_ICON = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
    },
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939" }],
] as const;

const color = brand.colors.green[500];

// Static, deterministic example data — never a live request during OG
// generation (spec's explicit requirement).
const preview = (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "Inter",
        fontSize: 14,
        color: brand.colors.text.secondary,
      }}
    >
      <span
        style={{
          display: "flex",
          fontWeight: 700,
          color,
        }}
      >
        POST
      </span>
      <span style={{ display: "flex" }}>https://api.example.com/users</span>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "Inter",
        fontSize: 13,
        color: brand.colors.text.secondary,
        marginTop: 10,
      }}
    >
      <span style={{ display: "flex", fontWeight: 600, color }}>200 OK</span>
      <span style={{ display: "flex" }}>· 184 ms · 4.2 KB</span>
    </div>

    <div
      style={{
        display: "flex",
        height: 1,
        background: "rgba(255,255,255,0.08)",
        margin: "18px 0",
      }}
    />

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter",
        fontSize: 15,
        lineHeight: 1.6,
        color: brand.colors.text.secondary,
      }}
    >
      <span style={{ display: "flex" }}>{"{"}</span>
      <span style={{ display: "flex", paddingLeft: 20 }}>
        <span style={{ color }}>&quot;id&quot;</span>: 42,
      </span>
      <span style={{ display: "flex", paddingLeft: 20 }}>
        <span style={{ color }}>&quot;status&quot;</span>: &quot;created&quot;
      </span>
      <span style={{ display: "flex" }}>{"}"}</span>
    </div>

    <div
      style={{
        display: "flex",
        height: 1,
        background: "rgba(255,255,255,0.08)",
        margin: "18px 0",
      }}
    />

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "Inter",
        fontSize: 12,
        color: brand.colors.text.secondary,
      }}
    >
      <span style={{ display: "flex", fontWeight: 600, color }}>Webhooks</span>
      <span style={{ display: "flex" }}>
        randy-code.dev/.../webhooks/••••••
      </span>
    </div>
  </div>
);

export default async function Image() {
  return renderToolOgImage({
    title: "API Studio",
    tagline: "Build, send, receive, and inspect HTTP requests.",
    color,
    iconNodes: SEND_ICON,
    preview,
  });
}
