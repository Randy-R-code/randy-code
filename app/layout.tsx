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
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "R-code",
  },
  title: "Randy Rimbault — Développeur Fullstack Freelance",
  description:
    "Développeur fullstack freelance spécialisé TypeScript / Next.js. Sites vitrines, applications SaaS, SEO local — des produits pensés pour être utiles et durables.",
  twitter: {
    card: "summary_large_image",
    title: "Randy Rimbault — Développeur Fullstack Freelance",
    description:
      "Développeur fullstack freelance spécialisé TypeScript / Next.js. Sites vitrines, applications SaaS, SEO local.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Randy Rimbault",
  jobTitle: "Développeur Fullstack Freelance",
  url: "https://randy-code.dev",
  description:
    "Développeur fullstack freelance spécialisé TypeScript / Next.js. Sites vitrines, applications SaaS, SEO local.",
  knowsAbout: [
    "TypeScript",
    "Next.js",
    "SEO local",
    "SaaS",
    "Développement web",
    "React",
    "Prisma",
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
