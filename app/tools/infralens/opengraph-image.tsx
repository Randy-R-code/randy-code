import { CATEGORY_LABELS } from "@infralens-lib/checks/category-labels";
import { formatCategoryScore } from "@infralens-lib/checks/format-category-score";
import { GlobalScore } from "@infralens-lib/checks/types";
import {
  EXAMPLE_CHECKS,
  EXAMPLE_HOSTNAME,
  EXAMPLE_SCORE,
} from "@infralens-lib/example-report";
import { readFileSync } from "fs";
import { ImageResponse } from "next/og";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "InfraLens — Website inspection tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Sourced from src/infralens/lib/example-report.ts — the same real
// randy-code.dev scan shown in results-preview.tsx on the landing, so a
// visitor who saw this card never sees a different-looking "example" once
// they click through. next/og (satori) can't render the real React
// components or read CSS custom properties, so the two mini check rows
// below are picked by id from EXAMPLE_CHECKS, and grade colors are
// duplicated as raw hex here (matching ScoreBadge's Tailwind classes) — but
// indexed by the real derived EXAMPLE_SCORE.grade, so this can't silently
// go stale the way a single hardcoded hex tied to one assumed letter could.
const GRADE_COLOR: Record<GlobalScore["grade"], string> = {
  A: "#34d399", // emerald-400
  B: "#a3e635", // lime-400
  C: "#facc15", // yellow-400
  D: "#fb923c", // orange-400
  E: "#f87171", // red-400
};
const gradeColor = GRADE_COLOR[EXAMPLE_SCORE.grade];
const OG_CHECK_IDS = ["https", "headers"] as const;
const ogChecks = OG_CHECK_IDS.map(
  (id) => EXAMPLE_CHECKS.find((check) => check.id === id)!,
);

export default async function OgImage() {
  const fontBold = readFileSync(
    join(process.cwd(), "public/infralens/fonts/Geist-Bold.otf"),
  );
  const fontSemiBold = readFileSync(
    join(process.cwd(), "public/infralens/fonts/Geist-SemiBold.otf"),
  );
  const logoSymbol = `data:image/png;base64,${readFileSync(
    join(process.cwd(), "public/infralens/brand/logo-symbol.png"),
  ).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        background: "#09090b",
        width: "100%",
        height: "100%",
        display: "flex",
        fontFamily: "Geist",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle green glow — top-left */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(20,184,148,0.12) 0%, transparent 70%)",
          display: "flex",
        }}
      />
      {/* Subtle blue glow — bottom-right (secondary accent) */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: 300,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(35,136,242,0.07) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* ── LEFT SECTION ─────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 52px 56px 72px",
          width: 520,
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Logo mark + name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            {}
            <img src={logoSymbol} width={38} height={38} alt="" />
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#71717a",
                letterSpacing: "0.02em",
              }}
            >
              InfraLens
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span
              style={{
                fontSize: 54,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              Inspect any
            </span>
            <span
              style={{
                fontSize: 54,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              website&apos;s
            </span>
            <span
              style={{
                fontSize: 54,
                fontWeight: 700,
                color: "#4aa7ff",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              infrastructure.
            </span>
          </div>
        </div>

        {/* Footer area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 2,
              background: "#4aa7ff",
              display: "flex",
            }}
          />

          {/* Mini check rows — same Pass/Warning badge treatment as the
              real CheckResultCard, so this mirrors an actual check instead
              of a generic category tag. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {ogChecks.map((check) => {
              const color = check.status === "pass" ? "#10b981" : "#f59e0b";
              return (
                <div
                  key={check.id}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: "#a1a1aa",
                      fontWeight: 600,
                      display: "flex",
                    }}
                  >
                    {check.label}
                  </span>
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: 6,
                      border: `1px solid ${color}40`,
                      background: `${color}1a`,
                      color,
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                    }}
                  >
                    {check.status === "pass" ? "Pass" : "Warning"}
                  </span>
                </div>
              );
            })}
          </div>

          <span style={{ fontSize: 13, color: "#3f3f46", fontWeight: 600 }}>
            Built for developers · Open source · Free
          </span>
        </div>
      </div>

      {/* Vertical divider */}
      <div
        style={{
          width: 1,
          background: "#1c1c1f",
          margin: "48px 0",
          display: "flex",
          flexShrink: 0,
        }}
      />

      {/* ── RIGHT SECTION ────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 68px 48px 44px",
          gap: 12,
        }}
      >
        {/* URL bar with score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#34d399",
              display: "flex",
              flexShrink: 0,
            }}
          />
          <span
            style={{ color: "#52525b", fontSize: 13, fontWeight: 600, flex: 1 }}
          >
            {EXAMPLE_HOSTNAME}
          </span>
          {/* Score badge — mirrors ScoreBadge's grade-color mapping */}
          <div
            style={{
              background: `${gradeColor}1a`,
              border: `1px solid ${gradeColor}40`,
              borderRadius: 6,
              padding: "3px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: gradeColor,
              }}
            >
              {EXAMPLE_SCORE.grade}
            </span>
            <span style={{ fontSize: 12, color: gradeColor, opacity: 0.75 }}>
              {EXAMPLE_SCORE.score} / 100
            </span>
          </div>
        </div>

        {/* Category bars — same shape as the real report and the
            results-preview demo, not a flat check list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 6,
          }}
        >
          {EXAMPLE_SCORE.categories.map((c) => (
            <div
              key={c.category}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #1c1c1f",
                paddingBottom: 12,
              }}
            >
              <span style={{ fontSize: 15, color: "#a1a1aa", fontWeight: 600 }}>
                {CATEGORY_LABELS[c.category]}
              </span>
              <span style={{ fontSize: 15, color: "#52525b", fontWeight: 600 }}>
                {formatCategoryScore(c.score, c.maxScore)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: fontBold, weight: 700 },
        { name: "Geist", data: fontSemiBold, weight: 600 },
      ],
    },
  );
}
