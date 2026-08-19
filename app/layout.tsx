import { AppBackground } from "@/components/layout/app-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { brand } from "@/lib/brand";
import { buildPersonSchema } from "@/lib/json-ld";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ServiceWorkerRegistration from "./components/service-worker-registration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: brand.colors.background,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://randy-code.dev"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Randy Code",
  },
  title: "Randy Rimbault — Développeur fullstack TypeScript",
  description:
    "Développeur fullstack TypeScript. Sites vitrines, applications SaaS, apps mobiles, SEO local — des produits pensés pour être utiles et durables.",
  openGraph: {
    title: "Randy Rimbault — Développeur fullstack TypeScript",
    description:
      "Développeur fullstack TypeScript. Sites vitrines, applications SaaS, apps mobiles, SEO local — des produits pensés pour être utiles et durables.",
    url: "/",
    siteName: "Randy Code",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Randy Rimbault — Développeur fullstack TypeScript",
    description:
      "Développeur fullstack TypeScript. Sites vitrines, applications SaaS, apps mobiles, SEO local.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildPersonSchema()),
          }}
        />
        <AppBackground />
        <SiteHeader />
        <ServiceWorkerRegistration />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <SiteFooter />

        <Analytics />
      </body>
    </html>
  );
}
