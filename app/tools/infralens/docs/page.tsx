import { Badge } from "@infralens-components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@infralens-components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Documentation — InfraLens",
  description: "Learn how InfraLens checks work and what each result means",
  alternates: { canonical: "/tools/infralens/docs" },
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-8 md:py-12 lg:py-16">
        <div className="space-y-8 md:space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <Link
              href="/tools/infralens"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Documentation
              </h1>
              <p className="text-zinc-400">
                Comprehensive documentation for all InfraLens checks. Each check
                is executed server-side using Next.js server actions, designed
                to be fast, non-intrusive, read-only, and safe for production
                websites. All checks run in parallel for optimal performance.
              </p>
            </div>
          </div>

          {/* Overview */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Overview</CardTitle>
              <CardDescription className="text-zinc-400">
                InfraLens performs 18 independent checks across 6 categories to
                analyze the technical exposure and configuration of a website.
                Each check is modular, type-safe, and focuses on a specific
                aspect of infrastructure, security, or configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Check Status
                </h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-700 text-emerald-400"
                    >
                      Pass
                    </Badge>
                    <span>Check ran and found no issue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-yellow-700 text-yellow-400"
                    >
                      Warning
                    </Badge>
                    <span>Check found issues that should be addressed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-red-700 text-red-400"
                    >
                      Fail
                    </Badge>
                    <span>Check ran and found a real configuration gap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-blue-700 text-blue-400"
                    >
                      Info
                    </Badge>
                    <span>Neutral note — doesn&apos;t affect the score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-zinc-600 text-zinc-400"
                    >
                      Unavailable
                    </Badge>
                    <span>
                      Couldn&apos;t be determined (e.g. an optional third-party
                      lookup was down) — doesn&apos;t affect the score
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-orange-700 text-orange-400"
                    >
                      Error
                    </Badge>
                    <span>
                      The check itself failed to run (network/timeout) —
                      doesn&apos;t affect the score
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network & DNS */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Network & DNS</CardTitle>
              <CardDescription className="text-zinc-400">
                DNS records, security, and hosting information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  DNS Records
                </h3>
                <p className="text-sm text-zinc-400 mb-3">
                  InfraLens uses Node.js native DNS resolution to retrieve and
                  analyze common DNS records. Results are cached in-memory to
                  optimize performance. This provides visibility into hosting
                  setup, email configuration, and domain delegation.
                </p>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p>
                    <strong>A / AAAA:</strong> Map domain names to IPv4/IPv6
                    addresses
                  </p>
                  <p>
                    <strong>CNAME:</strong> Canonical name records for aliases
                  </p>
                  <p>
                    <strong>MX:</strong> Mail Exchange records for email routing
                  </p>
                  <p>
                    <strong>TXT:</strong> Text records for various purposes
                  </p>
                  <p>
                    <strong>NS:</strong> Name Server records for domain
                    delegation
                  </p>
                  <p>
                    <strong>CAA:</strong> Restricts which Certificate
                    Authorities may issue certificates for the domain — shown as
                    evidence, absence isn&apos;t treated as a problem since
                    it&apos;s the common default
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  DNS Security
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  This check focuses on email and domain security signals:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>
                    <strong>SPF:</strong> Sender Policy Framework for email
                    authentication — also flags multiple SPF records, which RFC
                    7208 treats as invalid
                  </li>
                  <li>
                    <strong>DMARC:</strong> Domain-based Message Authentication
                    — its policy (none/quarantine/reject) is reported, with
                    p=none flagged as weaker enforcement
                  </li>
                  <li>
                    <strong>DKIM:</strong> DomainKeys Identified Mail signatures
                    — checked only at a handful of commonly-used selector names,
                    since the actual selector isn&apos;t published anywhere. Not
                    finding one there is reported as inconclusive, never as
                    &quot;DKIM is missing&quot;
                  </li>
                  <li>
                    <strong>DNSSEC:</strong> not evaluated — Node&apos;s
                    built-in DNS resolver doesn&apos;t support the DS/DNSKEY
                    lookups DNSSEC validation requires, so this is reported as
                    such rather than implied absent
                  </li>
                </ul>
                <p className="text-sm text-zinc-400 mt-2">
                  Missing SPF/DMARC records may expose the domain to spoofing or
                  delivery issues.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  IP & Hosting Information
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens uses the ipapi.co API (optional) to identify public
                  IP address, Autonomous System Number (ASN), hosting provider,
                  geographic location, and IPv6 availability. This provides a
                  high-level view of where and how the site is hosted. The API
                  key is optional—the service works without it but with rate
                  limits.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* HTTP & Security */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">HTTP & Security</CardTitle>
              <CardDescription className="text-zinc-400">
                Security headers and HTTPS/TLS configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Security Headers
                </h3>
                <p className="text-sm text-zinc-400 mb-3">
                  InfraLens checks six recommended HTTP security headers — not
                  just whether they&apos;re present, but whether their value is
                  actually safe (e.g. a Content-Security-Policy that still
                  allows <code>unsafe-inline</code> counts as weak, not strong).
                  A check passes only when every header is present with a safe
                  value; missing or weak headers trigger actionable
                  recommendations.
                </p>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      Content-Security-Policy
                    </Badge>
                    Prevents XSS attacks by controlling which resources can be
                    loaded — flagged as weak if it allows unsafe-inline,
                    unsafe-eval, or a wildcard source
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      X-Frame-Options / frame-ancestors
                    </Badge>
                    Prevents clickjacking by controlling iframe embedding —
                    either header is accepted
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      Strict-Transport-Security (HSTS)
                    </Badge>
                    Forces HTTPS connections and prevents downgrade attacks —
                    flagged as weak below a 300-second max-age
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      X-Content-Type-Options
                    </Badge>
                    Prevents MIME type sniffing attacks
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      Referrer-Policy
                    </Badge>
                    Controls how much referrer information is sent with requests
                    — flagged as weak on unsafe-url
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      Permissions-Policy
                    </Badge>
                    Restricts which browser features and APIs the page can use
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  HTTPS & TLS
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  This check verifies whether HTTPS is properly enforced and
                  opens its own raw TLS connection to inspect the certificate —
                  an invalid certificate fails the check, and one expiring
                  within 30 days triggers a warning:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>HTTPS availability</li>
                  <li>HTTP to HTTPS redirection</li>
                  <li>Negotiated TLS protocol version</li>
                  <li>Certificate issuer</li>
                  <li>Certificate validity and expiration date</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Redirect Behavior
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens follows redirect chains (up to 10 redirects) to
                  detect misconfigurations, including excessive redirects,
                  redirect loops, and a chain that downgrades from HTTPS back to
                  HTTP partway through (treated as a failure). Each hop&apos;s
                  URL and status code is recorded, and a hostname change between
                  the first hop and the final URL is surfaced as informational
                  evidence. Clean redirect chains improve security, performance,
                  and SEO.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  security.txt
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  InfraLens checks for the presence of a security.txt file
                  according to RFC 9116. This file provides security researchers
                  with contact information and vulnerability disclosure
                  policies. The check verifies:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>
                    Presence at /.well-known/security.txt or /security.txt
                  </li>
                  <li>Required Contact field</li>
                  <li>
                    Required Expires field, and whether that date has already
                    passed (an expired file is treated as a failure per RFC
                    9116)
                  </li>
                  <li>
                    Other optional fields (Encryption, Acknowledgments, etc.)
                  </li>
                </ul>
                <p className="text-sm text-zinc-400 mt-2">
                  A properly configured security.txt helps security researchers
                  report vulnerabilities responsibly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Infrastructure</CardTitle>
              <CardDescription className="text-zinc-400">
                Firewall detection and network analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Firewall / WAF Detection
                </h3>
                <p className="text-sm text-zinc-400">
                  This check looks for known header fingerprints (Cloudflare,
                  Fastly, Akamai, AWS CloudFront, Sucuri, and similar) that
                  suggest a WAF or CDN may be in front of the site. This is
                  always a probabilistic signal, never a confirmed detection — a
                  real WAF can hide its fingerprint, and a header alone
                  doesn&apos;t prove active filtering. It&apos;s informational
                  only and never counts toward the score either way.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Website Structure */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Website Structure</CardTitle>
              <CardDescription className="text-zinc-400">
                robots.txt, sitemaps, and link analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">robots.txt</h3>
                <p className="text-sm text-zinc-400">
                  InfraLens checks for the presence of robots.txt, HTTP status,
                  and basic syntax validity, and reports whether it disallows
                  all crawlers under User-agent: * (an indexing signal, not a
                  vulnerability) and which Sitemap: URLs it declares. robots.txt
                  controls crawler access and indexing behavior.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">Sitemap</h3>
                <p className="text-sm text-zinc-400">
                  This check tries the Sitemap: URL declared in robots.txt
                  first, then falls back to /sitemap.xml and /sitemap_index.xml
                  — at most 3 locations, never recursing into a sitemap
                  index&apos;s child sitemaps. Signals include presence, format
                  (XML / index), and basic URL count.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Linked Pages
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens extracts links from the initial HTML document with
                  lightweight regex-based parsing and categorizes them as
                  internal or external. Up to 10 links are checked with HEAD
                  requests to detect unreachable or broken links — this stays a
                  signal, not a crawler.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata & Stack */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">
                Metadata & Technology Stack
              </CardTitle>
              <CardDescription className="text-zinc-400">
                HTML metadata, social tags, and technology detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  HTML Metadata
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  Checks for title, meta description, charset, and viewport.
                  Missing metadata affects accessibility and SEO.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Social Tags
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens inspects Open Graph tags, Twitter Card metadata, and
                  social preview images.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Stack Detection
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  InfraLens analyzes HTTP headers and HTML content to detect
                  frontend frameworks, CMS platforms, analytics tools, and CDN
                  providers — every finding is labeled with a confidence level
                  rather than presented as certain: <strong>confirmed</strong>{" "}
                  (an infrastructure-level header, not spoofable by page
                  content), <strong>likely</strong> (a distinctive structural
                  fingerprint, e.g. a build-output path), or{" "}
                  <strong>possible</strong> (a single bare keyword match, the
                  weakest signal). This check is purely informational and never
                  affects the score.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Server Headers
                </h3>
                <p className="text-sm text-zinc-400">
                  This check looks for X-Powered-By exposure and other unusual
                  headers, and flags the Server header only when its value
                  discloses an actual version number (e.g. nginx/1.18.0) — a
                  generic value like &quot;nginx&quot; or &quot;cloudflare&quot;
                  alone isn&apos;t treated as an information leak.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Accessibility Hints
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  This is a lightweight static check, not a complete
                  accessibility audit — it looks at a handful of observable HTML
                  signals that affect screen readers and assistive technologies:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>
                    <strong>lang attribute:</strong> Presence on the HTML
                    element
                  </li>
                  <li>
                    <strong>h1 heading:</strong> Presence and count (should be
                    exactly one)
                  </li>
                  <li>
                    <strong>Image alt text:</strong> Missing alt attributes on
                    images
                  </li>
                  <li>
                    <strong>ARIA landmarks:</strong> Semantic HTML elements and
                    ARIA roles (header, nav, main, footer)
                  </li>
                  <li>
                    <strong>Skip links:</strong> Presence of skip navigation
                    links
                  </li>
                </ul>
                <p className="text-sm text-zinc-400 mt-2">
                  These are basic checks and do not replace comprehensive
                  accessibility audits, but they help identify common issues
                  that impact users with disabilities.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Signals */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Performance Signals</CardTitle>
              <CardDescription className="text-zinc-400">
                Lightweight performance metrics and reachability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Response Metrics
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  InfraLens collects performance signals from the server side —
                  it doesn&apos;t replace Lighthouse, WebPageTest, or field Core
                  Web Vitals, and never fabricates a metric it can&apos;t
                  actually measure:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>
                    Total response time (DNS + connect + TTFB + download
                    combined — connection setup and TTFB aren&apos;t separately
                    observable through a server-side fetch, so they&apos;re not
                    reported individually)
                  </li>
                  <li>
                    DNS lookup time for this analysis&apos;s own resolution
                  </li>
                  <li>Response size (Content-Length header or body size)</li>
                  <li>
                    Compression support (Content-Encoding: gzip, br, etc.) and
                    the Cache-Control header
                  </li>
                </ul>
                <p className="text-sm text-zinc-400 mt-2">
                  These are indicative signals from a single request, not
                  comprehensive performance audits. Results may vary based on
                  network conditions and server load.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Reachability Snapshot
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens checks the response already collected to verify
                  reachability, HTTP status code, and timeout handling. This
                  represents a single point-in-time snapshot of the
                  website&apos;s availability, not historical uptime tracking or
                  monitoring.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scoring */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Scoring System</CardTitle>
              <CardDescription className="text-zinc-400">
                How InfraLens calculates scores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Category Weights
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>HTTP & Security: 25 points</li>
                  <li>Network & DNS: 20 points</li>
                  <li>Infrastructure: 20 points</li>
                  <li>Website Structure: 15 points</li>
                  <li>Metadata & Stack: 10 points</li>
                  <li>Performance Signals: 10 points</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Status Points
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>Pass: 100% of category weight</li>
                  <li>Warning: 60% of category weight</li>
                  <li>Fail: 0% of category weight</li>
                  <li>
                    Info / Unavailable / Error: excluded from the score entirely
                    — never counted for or against the site
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Final Grade
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  Grades (A–E) are visual aids only, not security
                  certifications:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>90–100: A (Strong configuration signals)</li>
                  <li>75–89: B (Good, with improvements available)</li>
                  <li>60–74: C (Mixed configuration)</li>
                  <li>40–59: D (Several important improvements)</li>
                  <li>
                    &lt; 40: E (Major public configuration issues detected)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Comparing reports */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Comparing Reports</CardTitle>
              <CardDescription className="text-zinc-400">
                See what changed between two analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                The{" "}
                <Link
                  href="/tools/infralens/compare"
                  className="text-brand-secondary-hover hover:text-brand-secondary underline underline-offset-2"
                >
                  Compare
                </Link>{" "}
                page reads two JSON reports you export from InfraLens and shows
                the score change, category-by-category deltas, and every check
                that improved, regressed, or otherwise changed between them. It
                runs entirely in your browser — neither file is sent anywhere.
                Reports exported by an incompatible major version of InfraLens
                are refused with an explanation rather than compared as if they
                used the same vocabulary.
              </p>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Notes & Limitations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                <li>
                  <strong>Read-only:</strong> InfraLens performs passive
                  analysis only—no exploitation, intrusive scanning, or
                  modification of target systems.
                </li>
                <li>
                  <strong>Heuristic detection:</strong> Technology stack and
                  WAF/CDN detection are based on patterns and header
                  fingerprints, graded by confidence rather than presented as
                  certain, and never affect the score.
                </li>
                <li>
                  <strong>Network-dependent:</strong> Results may vary based on
                  network conditions, DNS resolver location, and server load.
                </li>
                <li>
                  <strong>Single snapshot:</strong> Reachability and performance
                  checks represent a single point in time, not historical
                  monitoring.
                </li>
                <li>
                  <strong>Indicators, not guarantees:</strong> Results should be
                  interpreted as indicators to guide further investigation, not
                  as definitive security assessments.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
