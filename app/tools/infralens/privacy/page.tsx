import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocalNav } from "@infralens-components/local-nav";
import { siteConfig } from "@infralens-config/site-config";
import Link from "next/link";

export const metadata = {
  title: "Privacy — InfraLens",
  description: "What InfraLens sends, stores, and contacts, in plain terms.",
  alternates: { canonical: "/tools/infralens/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-8 md:py-12 lg:py-16">
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4">
            <LocalNav />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Privacy
              </h1>
              <p className="text-muted-foreground">
                {siteConfig.name} has no account, no billing, and no ad
                tracking. This page explains exactly what data moves where — in
                plain terms, matching what the{" "}
                <Link
                  href={siteConfig.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-secondary-hover hover:text-brand-secondary underline underline-offset-2"
                >
                  source code
                </Link>{" "}
                actually does.
              </p>
            </div>
          </div>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl">
                What gets sent when you run an analysis
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                The URL you type is sent to InfraLens&apos;s own server, which
                performs the checks itself — not your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Checks (DNS lookups, HTTP requests, TLS handshakes) have to run
                server-side: your browser can&apos;t make most of these requests
                directly due to CORS, and running them client-side would expose
                your own IP address to every site you analyze. So the URL is
                sent to InfraLens&apos;s server via a single request, the server
                performs the checks against the target, and the report is
                returned to your browser. No account, cookie, or identifier is
                attached to that request beyond what&apos;s needed for rate
                limiting (below).
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl">
                Rate limiting and your IP
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Yes, your IP address is used — only to enforce a per-IP request
                limit, and only for a few seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Each analysis request is checked against a short-lived,
                in-memory counter keyed by your IP address, to prevent abuse
                (currently one analysis per 30 seconds). That counter lives only
                in the server&apos;s memory for the length of that window, is
                swept automatically once it expires, and is entirely wiped on
                every server restart or deploy — nothing is written to disk or a
                database.
              </p>
              <p>
                Current limitation, stated plainly: the IP is used as-is for
                that in-memory counter, not yet hashed. A production-grade rate
                limiter with a hashed/minimized key and an external store is
                planned (tracked as a later phase of this project) — this page
                will be updated when that lands.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl">
                Third-party services contacted
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                One: a public IP-info lookup, about the site you&apos;re
                analyzing — never about you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The Hosting &amp; IP check queries{" "}
                <span className="text-foreground">ipapi.co</span> with the
                resolved IP address of the site being analyzed, to report its
                hosting provider and network (ASN). That result is cached
                server-side for 15 minutes to avoid repeat lookups. Your own IP
                address is never sent to ipapi.co or any other third party. DNS
                lookups performed during checks use your server&apos;s
                configured DNS resolvers, the same way any server-side request
                would.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl">
                What&apos;s stored locally
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your last 10 analyses, in your browser only — nothing on
                InfraLens&apos;s servers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                InfraLens keeps no server-side record of any analysis once the
                report is returned to your browser. Instead, up to 10 recent
                reports are cached in your browser&apos;s{" "}
                <span className="text-foreground">localStorage</span> so you can
                revisit them — this never leaves your device and no other page
                or site can read it.
              </p>
              <p>
                Delete a single entry from the &quot;Recent analyses&quot; list
                on the homepage, or use &quot;Clear all&quot; to remove all of
                it at once. Clearing your browser&apos;s site data for InfraLens
                does the same thing. Malformed or outdated local data is
                discarded automatically rather than shown broken.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl">
                What the analyzed site can see
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Its own server logs, exactly as for any other visitor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Running an analysis makes real DNS, HTTP, and TLS connections to
                the target from InfraLens&apos;s server. The site being analyzed
                will see these requests in its own logs — the request IP will be
                InfraLens&apos;s server, not yours, but the requests themselves
                (paths fetched, headers sent) are real and will appear like any
                other visit. Only run analyses on sites you&apos;re authorized
                to inspect.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl">No tracking, by design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                No analytics scripts, no ad trackers, no cookies used for
                identification, no account system, no persistent server-side
                storage of your analyses. Server logs are limited to operational
                fields (event name, duration, error category) — never a full
                URL, raw headers, or your IP.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
