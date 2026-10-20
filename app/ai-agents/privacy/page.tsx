import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Agents — Privacy Policy | Randy Code",
  description:
    "Privacy policy of the private AI Agents integration and its use of Google services.",
  alternates: { canonical: "/ai-agents/privacy" },
};

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-zinc-300">
        {children}
      </div>
    </section>
  );
}

export default function AiAgentsPrivacyPage() {
  return (
    <main lang="en" className="flex-1 px-6 pt-8 pb-16">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft size={12} />
          Randy Code
        </Link>

        <header className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            AI Agents — Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Last updated: <time dateTime="2026-10-20">October 20, 2026</time>
          </p>
        </header>

        <Block title="Overview">
          <p>
            AI Agents is a private integration that lets personal AI assistants
            interact with Google services on behalf of authorized users. It is
            not a publicly available service.
          </p>
        </Block>

        <Block title="Google data accessed">
          <p>
            Depending on the permissions granted, the assistants may access
            Gmail, Google Calendar, Google Drive, Google Docs, Google Sheets and
            Google Contacts. This data is used only to carry out the requests of
            authorized users.
          </p>
        </Block>

        <Block title="Storage, sharing and AI processing">
          <p>
            OAuth credentials are kept in the private server environment hosting
            the assistants, and access is restricted to authorized users.
          </p>
          <p>
            Data needed to carry out a request may be sent to the providers of
            the AI models used by the assistants. Google data is not sold and is
            not used for advertising.
          </p>
          <p>
            AI Agents&apos; use and transfer of information received from Google
            APIs adheres to the Google API Services User Data Policy, including
            the Limited Use requirements.
          </p>
        </Block>

        <Block title="Retention, deletion and revoking access">
          <p>
            Retention depends on the assistants&apos; configuration. You may
            request deletion of data kept by the integration by contacting us.
          </p>
          <p>
            You can revoke the permissions granted to AI Agents at any time from{" "}
            <a
              href="https://myaccount.google.com/connections"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white"
            >
              myaccount.google.com/connections
            </a>
            . Revoking stops new access but does not automatically delete data
            already kept.
          </p>
        </Block>

        <Block title="Contact">
          <p>
            <a
              href="mailto:contact@randy-code.dev"
              className="underline underline-offset-2 hover:text-white"
            >
              contact@randy-code.dev
            </a>
          </p>
        </Block>
      </div>
    </main>
  );
}
