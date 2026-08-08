import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Randy Code — Développeur Fullstack TypeScript";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const services = [
  {
    title: "Sites vitrines",
    desc: "Rapides, SEO-ready,\npensés pour convertir",
    color: "#4AA7FF",
  },
  {
    title: "Applications SaaS",
    desc: "Auth, paiement, IA —\nde l'idée à la prod",
    color: "#14B894",
  },
  {
    title: "Applications mobiles",
    desc: "Expo & React Native,\nbackend temps réel",
    color: "#2388F2",
  },
  {
    title: "SEO local",
    desc: "Google Maps, pages\nlocales optimisées",
    color: "#35D3AD",
  },
];

export default async function Image() {
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
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage:
            "linear-gradient(rgba(74,167,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,167,255,0.04) 1px, transparent 1px)",
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
            "radial-gradient(circle, rgba(35,136,242,0.20) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Green glow — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(53,211,173,0.08) 0%, transparent 70%)",
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
            "linear-gradient(180deg, #4AA7FF 0%, #2388F2 60%, transparent 100%)",
          display: "flex",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "64px 80px 64px 88px",
          gap: 0,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            fontSize: 16,
            fontFamily: "Inter",
            fontWeight: 400,
            color: "#4AA7FF",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          RANDY CODE
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#F4F8FC",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Développeur Fullstack TypeScript
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontFamily: "Inter",
            fontWeight: 400,
            color: "#A9B8C7",
            marginBottom: 52,
          }}
        >
          Randy Rimbault · SaaS · Mobile · SEO local — des produits pensés pour
          être utiles et durables.
        </div>

        {/* Service blocks */}
        <div style={{ display: "flex", gap: 16 }}>
          {services.map((service) => (
            <div
              key={service.title}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(148,163,184,0.12)",
                borderRadius: 14,
                padding: "20px 20px",
                gap: 8,
              }}
            >
              {/* Color accent */}
              <div
                style={{
                  display: "flex",
                  width: 28,
                  height: 3,
                  borderRadius: 2,
                  background: service.color,
                  marginBottom: 2,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 19,
                  fontFamily: "Inter",
                  fontWeight: 700,
                  color: "#F4F8FC",
                }}
              >
                {service.title}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  fontFamily: "Inter",
                  fontWeight: 400,
                  color: "#74879A",
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}
              >
                {service.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom URL */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 80,
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
      ...size,
      fonts: [
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
