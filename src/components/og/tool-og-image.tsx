import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";

const SIZE = { width: 1200, height: 630 };

/** A single Lucide `__iconNode` entry, stripped of its internal `key` field — see the note in each tool's opengraph-image.tsx. */
export type IconNode = readonly ["circle" | "path", Record<string, string>];

/**
 * Renders a Lucide icon from its raw node data rather than the React
 * component — satori (next/og's renderer) works from plain SVG elements,
 * and Lucide's exported components are simple enough that their node data
 * translates directly, giving the exact same icon shown in the tool's own
 * `ToolHeader` instead of a separately drawn approximation. Exported so a
 * tool's own preview fragment (see `preview` below) can draw small in-panel
 * icons (e.g. a validity checkmark) with the same technique.
 */
export function Icon({
  nodes,
  color,
  size,
}: {
  nodes: readonly IconNode[];
  color: string;
  size: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "flex" }}
    >
      {nodes.map(([tag, attrs], index) =>
        tag === "circle" ? (
          <circle key={index} cx={attrs.cx} cy={attrs.cy} r={attrs.r} />
        ) : (
          <path key={index} d={attrs.d} />
        ),
      )}
    </svg>
  );
}

/**
 * Shared OG card for the lightweight `/tools/*` family (Cron Builder, JSON
 * Studio, MetaLens, ...) — same dark/grid/glow language as the site's own
 * root `app/opengraph-image.tsx`, not a copy of InfraLens's bespoke
 * report-mockup card (that one mirrors InfraLens-specific score/category
 * data these tools don't have, and InfraLens keeps its own standalone
 * identity per the tool-family convention).
 */
export async function renderToolOgImage({
  title,
  tagline,
  color,
  iconNodes,
  label,
  preview,
}: {
  title: string;
  tagline: string;
  color: string;
  iconNodes: readonly IconNode[];
  /** Eyebrow text above the title — the tool's category (see
   * TOOL_CATEGORY_LABELS in src/lib/tools.ts), matching the same label
   * shown in the tool's own ToolHeader. */
  label: string;
  /** Tool-specific mini preview fragment (e.g. a compact cron/JSON/metadata
   * mockup) — the shared renderer owns the surrounding panel (border,
   * radius, background); the route only supplies the inner content. Tools
   * without a preview yet keep the original full-width single-column
   * layout. */
  preview?: ReactNode;
}) {
  const [fontBold, fontRegular] = await Promise.all([
    readFile(join(process.cwd(), "assets/Inter-Bold.woff")),
    readFile(join(process.cwd(), "assets/Inter-Regular.woff")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#070B10",
        position: "relative",
      }}
    >
      {/* Grid pattern — same density as the root OG card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow — tool's own accent color, top-left */}
      <div
        style={{
          position: "absolute",
          top: -140,
          left: -100,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          display: "flex",
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
          width: "100%",
          height: "100%",
          padding: "64px 88px",
        }}
      >
        {/* Left content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Icon + eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 76,
                height: 76,
                borderRadius: 18,
                background: `${color}1a`,
                border: `1px solid ${color}40`,
              }}
            >
              <Icon nodes={iconNodes} color={color} size={38} />
            </div>
            <span
              style={{
                display: "flex",
                fontSize: 16,
                fontFamily: "Inter",
                fontWeight: 700,
                color,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: preview ? 64 : 76,
              fontFamily: "Inter",
              fontWeight: 700,
              color: "#F4F8FC",
              letterSpacing: "-0.02em",
              marginBottom: 22,
            }}
          >
            {title}
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              fontSize: preview ? 22 : 26,
              fontFamily: "Inter",
              fontWeight: 400,
              color: "#A9B8C7",
              lineHeight: 1.45,
              // satori chokes on a style value that's explicitly `undefined`
              // (as opposed to the key being absent) — always give it a real
              // number. The left column is already width-constrained by the
              // preview panel's fixed width when one is present, so 560 is
              // just a safety cap there, not the binding constraint.
              maxWidth: preview ? 560 : 800,
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Right preview panel — same border/radius/surface across every
            tool that has one; only the inner fragment changes. */}
        {preview && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: 380,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 20,
                padding: "28px 28px 30px",
              }}
            >
              {preview}
            </div>
          </div>
        )}
      </div>

      {/* Bottom URL */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 88,
          display: "flex",
          fontSize: 16,
          fontFamily: "Inter",
          fontWeight: 700,
          color: "#A9B8C7",
          letterSpacing: "0.05em",
        }}
      >
        randy-code.dev
      </div>
    </div>,
    {
      ...SIZE,
      fonts: [
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
