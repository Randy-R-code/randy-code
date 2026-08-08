import { ContactForm } from "@/components/contact-form";
import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Randy Code",
  description:
    "Contactez Randy Rimbault, développeur fullstack TypeScript freelance, pour discuter d'un projet.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell
      label="Contact"
      title="Me contacter"
      tagline="Un projet, une question ou juste envie d'échanger ? Je réponds vite."
      color={brand.colors.blue[400]}
      icon="mail"
    >
      <ContactForm />
      <div className="mt-4 flex items-center gap-3">
        <a
          href="https://github.com/Randy-R-code"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
        >
          <ExternalLink size={11} />
          GitHub — Randy-R-code
        </a>
      </div>
    </PageShell>
  );
}
