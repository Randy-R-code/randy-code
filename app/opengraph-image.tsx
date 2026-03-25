import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Randy Rimbault — Développeur Fullstack Freelance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [logoData, fontBold, fontRegular] = await Promise.all([
    readFile(join(process.cwd(), "public/logo-r.png"), "base64"),
    readFile(join(process.cwd(), "assets/Inter-Bold.woff")),
    readFile(join(process.cwd(), "assets/Inter-Regular.woff")),
  ]);

  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0a0d16",
        position: "relative",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Blue radial glow — top left */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Blue radial glow — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)",
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
          background:
            "linear-gradient(180deg, #3b82f6 0%, #2563eb 60%, transparent 100%)",
          display: "flex",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "72px 80px 72px 88px",
          gap: 72,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            width: 180,
            height: 180,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 0 60px rgba(59,130,246,0.35)",
          }}
        >
          {}
          <img
            src={logoSrc}
            alt=""
            width={180}
            height={180}
            style={{ display: "flex" }}
          />
        </div>

        {/* Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: 20,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontFamily: "Inter",
              fontWeight: 400,
              color: "#3b82f6",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            RANDY RIMBAULT
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontFamily: "Inter",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Développeur Fullstack Freelance
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontFamily: "Inter",
              fontWeight: 400,
              color: "#94a3b8",
              lineHeight: 1.4,
              maxWidth: 560,
            }}
          >
            SaaS · SEO local · Outils sur mesure — des produits pensés pour être
            utiles et durables.
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {["Next.js", "TypeScript", "SaaS", "SEO"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "6px 18px",
                  borderRadius: 8,
                  fontSize: 16,
                  fontFamily: "Inter",
                  fontWeight: 400,
                  color: "#64748b",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom URL */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 80,
          display: "flex",
          fontSize: 18,
          fontFamily: "Inter",
          fontWeight: 400,
          color: "#334155",
          letterSpacing: "0.05em",
        }}
      >
        randy-code.dev
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
