import { ContactForm } from "@/components/contact-form";
import { GitHubIcon } from "@/components/github-icon";
import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Randy Code",
  description:
    "Contactez Randy Rimbault, développeur fullstack TypeScript, pour discuter d'un projet.",
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
      <div className="mb-6">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
          Contact direct
        </p>
        <a
          href="mailto:contact@randy-code.dev"
          className="inline-flex items-center gap-1.5 text-sm text-blue-400 underline underline-offset-2 transition-colors hover:text-blue-300"
        >
          <Mail size={14} />
          contact@randy-code.dev
        </a>
      </div>
      <ContactForm />
      <div className="mt-4 flex items-center gap-3">
        <a
          href="https://github.com/Randy-R-code"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
        >
          <GitHubIcon size={11} />
          GitHub
        </a>
      </div>
    </PageShell>
  );
}
