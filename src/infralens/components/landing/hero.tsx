"use client";

import { GitHubIcon } from "@infralens-components/github-icon";
import { Button } from "@infralens-components/ui/button";
import { Card, CardContent } from "@infralens-components/ui/card";
import { Input } from "@infralens-components/ui/input";
import { siteConfig } from "@infralens-config/site-config";
import { parseAnalysisError } from "@infralens-lib/checks/parse-error";
import { ChecksResponse } from "@infralens-lib/checks/types";
import { BookOpen, Scale, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { runInfraChecks } from "../../../../app/tools/infralens/actions/run-checks";

// Master plan §6.2: fill the field only, never trigger an analysis
// automatically — the user still has to press Analyze themselves.
const QUICK_EXAMPLES = ["example.com", "github.com", "vercel.com"];

type HeroProps = {
  onResults?: (results: ChecksResponse) => void;
  onAnalysisStart?: () => void;
  isLoading?: boolean;
};

export function Hero({
  onResults,
  onAnalysisStart,
  isLoading: externalIsLoading,
}: HeroProps) {
  const [url, setUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  // Use external loading state if provided, otherwise use internal
  const isLoading = externalIsLoading ?? isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    onAnalysisStart?.();

    startTransition(async () => {
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

      try {
        const results = await runInfraChecks(new URL(normalizedUrl).toString());
        onResults?.(results);

        // Scroll to results after a short delay
        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } catch (error) {
        onResults?.(parseAnalysisError(error, normalizedUrl));
      }
    });
  };

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 sm:px-8 md:px-12 py-8 md:py-12 lg:py-16"
    >
      <div className="w-full max-w-4xl space-y-6 md:space-y-8">
        {/* Branding */}
        <div className="text-center space-y-4 md:space-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/infralens/brand/logo-horizontal.png"
            alt="InfraLens"
            className="h-16 sm:h-20 w-auto mx-auto"
          />
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-brand-secondary">
            Open-source website inspection tool
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 max-w-2xl mx-auto">
            Inspect a website&apos;s infrastructure in seconds.
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto">
            Analyze DNS, TLS, security headers, metadata, hosting and technical
            signals in one readable report.
          </p>
        </div>

        {/* Search Form */}
        <Card className="border-2 border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col min-[26.25rem]:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                <Input
                  id="url-input"
                  name="url"
                  placeholder="https://example.com"
                  type="text"
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 h-12 text-base bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-brand-secondary focus:ring-brand-secondary/30"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="h-12 min-[26.25rem]:px-8 w-full min-[26.25rem]:w-auto border border-brand-accent/40 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent-hover disabled:opacity-50"
              >
                {isLoading ? "Analyzing..." : "Analyze website"}
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-zinc-400">Try:</span>
              {QUICK_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setUrl(`https://${example}`)}
                  className="px-2.5 py-1 rounded-full border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Secondary actions */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link
            href={siteConfig.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <GitHubIcon size={16} />
            View source on GitHub
          </Link>
          <Link
            href="/tools/infralens/docs"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <BookOpen className="size-4" />
            Read the documentation
          </Link>
          <Link
            href="/tools/infralens/privacy"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ShieldCheck className="size-4" />
            Privacy
          </Link>
          <Link
            href={siteConfig.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Scale className="size-4" />
            License
          </Link>
        </div>

        {/* Reassurance */}
        <p className="text-center text-xs sm:text-sm text-zinc-400">
          No account · No tracking · Passive checks only
        </p>
      </div>
    </section>
  );
}
