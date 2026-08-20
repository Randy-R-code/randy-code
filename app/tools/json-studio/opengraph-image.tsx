import { Icon, renderToolOgImage } from "@/components/og/tool-og-image";
import { brand } from "@/lib/brand";
import { TOOL_CATEGORY_LABELS } from "@/lib/tools";

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

// Raw node data from lucide-react's circle-check icon
// (dist/esm/icons/circle-check.mjs) — same icon as JsonStatus's "Valid
// JSON" badge in the real tool.
const CIRCLE_CHECK_ICON = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m9 12 2 2 4-4" }],
] as const;

const color = brand.colors.green[500];

// Same type-color mapping as json-tree-node.tsx (string/number/boolean),
// so the preview's syntax coloring matches the real tool exactly rather
// than an approximation.
const PUNCTUATION = "#6B7A89";
const KEY_COLOR = brand.colors.text.secondary;
const STRING_COLOR = brand.colors.green[400];
const NUMBER_COLOR = brand.colors.blue[400];
const BOOLEAN_COLOR = brand.colors.functional.warning;

function codeTextStyle(textColor: string) {
  return {
    display: "flex" as const,
    fontFamily: "Inter",
    fontSize: 17,
    color: textColor,
    letterSpacing: "0.01em",
  };
}

const preview = (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    {/* Valid JSON badge — same pill as JsonStatus in the real tool */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        alignSelf: "flex-start",
        background: `${color}18`,
        borderRadius: 8,
        padding: "6px 12px",
        marginBottom: 18,
      }}
    >
      <Icon nodes={CIRCLE_CHECK_ICON} color={color} size={15} />
      <span
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 13,
          color,
        }}
      >
        Valid JSON
      </span>
    </div>

    {/* Compact formatted JSON, mirroring the tree panel's own coloring */}
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex" }}>
        <span style={codeTextStyle(PUNCTUATION)}>{"{"}</span>
      </div>
      <div style={{ display: "flex", paddingLeft: 20 }}>
        <span style={codeTextStyle(KEY_COLOR)}>&quot;name&quot;</span>
        <span style={{ ...codeTextStyle(PUNCTUATION), marginRight: 6 }}>
          {":"}
        </span>
        <span style={codeTextStyle(STRING_COLOR)}>&quot;Randy Code&quot;</span>
        <span style={codeTextStyle(PUNCTUATION)}>{","}</span>
      </div>
      <div style={{ display: "flex", paddingLeft: 20 }}>
        <span style={codeTextStyle(KEY_COLOR)}>&quot;tools&quot;</span>
        <span style={{ ...codeTextStyle(PUNCTUATION), marginRight: 6 }}>
          {":"}
        </span>
        <span style={codeTextStyle(NUMBER_COLOR)}>{"4"}</span>
        <span style={codeTextStyle(PUNCTUATION)}>{","}</span>
      </div>
      <div style={{ display: "flex", paddingLeft: 20 }}>
        <span style={codeTextStyle(KEY_COLOR)}>&quot;active&quot;</span>
        <span style={{ ...codeTextStyle(PUNCTUATION), marginRight: 6 }}>
          {":"}
        </span>
        <span style={codeTextStyle(BOOLEAN_COLOR)}>{"true"}</span>
      </div>
      <div style={{ display: "flex" }}>
        <span style={codeTextStyle(PUNCTUATION)}>{"}"}</span>
      </div>
    </div>
  </div>
);

export default async function Image() {
  return renderToolOgImage({
    title: "JSON Studio",
    tagline: "Validate, format and inspect JSON instantly.",
    color,
    iconNodes: BRACES_ICON,
    label: TOOL_CATEGORY_LABELS["developer-utilities"],
    preview,
  });
}
