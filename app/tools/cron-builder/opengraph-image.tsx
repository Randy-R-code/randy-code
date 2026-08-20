import { Icon, renderToolOgImage } from "@/components/og/tool-og-image";
import { brand } from "@/lib/brand";
import { TOOL_CATEGORY_LABELS } from "@/lib/tools";

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

// Raw node data from lucide-react's check icon (dist/esm/icons/check.mjs).
const CHECK_ICON = [["path", { d: "M20 6 9 17l-5-5" }]] as const;

// Same default expression the tool itself opens with — real output, not a
// fabricated example.
const EXAMPLE_EXPRESSION = "0 9 * * 1-5";
const EXAMPLE_INTERPRETATION = "At 09:00, Monday through Friday";
const EXAMPLE_NEXT_RUNS = ["Mon · 09:00", "Tue · 09:00", "Wed · 09:00"];

const color = brand.colors.green[500];

const preview = (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: `${color}14`,
        border: `1px solid ${color}35`,
        borderRadius: 10,
        padding: "12px 16px",
      }}
    >
      <span
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 26,
          color: "#F4F8FC",
          letterSpacing: "0.03em",
        }}
      >
        {EXAMPLE_EXPRESSION}
      </span>
      <Icon nodes={CHECK_ICON} color={color} size={20} />
    </div>

    <span
      style={{
        display: "flex",
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: 16,
        color: "#A9B8C7",
        lineHeight: 1.4,
        marginTop: 14,
      }}
    >
      {EXAMPLE_INTERPRETATION}
    </span>

    <div
      style={{
        display: "flex",
        height: 1,
        background: "rgba(255,255,255,0.08)",
        margin: "20px 0",
      }}
    />

    <span
      style={{
        display: "flex",
        fontFamily: "Inter",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#7C8B99",
        marginBottom: 12,
      }}
    >
      Next runs
    </span>

    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {EXAMPLE_NEXT_RUNS.map((run) => (
        <div
          key={run}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <div
            style={{
              display: "flex",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: color,
            }}
          />
          <span
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: 16,
              color: "#DCE4EC",
            }}
          >
            {run}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default async function Image() {
  return renderToolOgImage({
    title: "Cron Builder",
    tagline: "Build, validate and understand cron expressions.",
    color,
    iconNodes: CLOCK_ICON,
    label: TOOL_CATEGORY_LABELS["developer-utilities"],
    preview,
  });
}
