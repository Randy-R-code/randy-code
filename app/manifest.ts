import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Randy Code — Développeur Fullstack TypeScript",
    short_name: "Randy Code",
    description:
      "Portfolio interactif de Randy Rimbault, développeur fullstack freelance TypeScript / Next.js.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b10",
    theme_color: "#070b10",
    orientation: "any",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
