import { ScoreBadge } from "@infralens-components/results/score-badge";
import { Badge } from "@infralens-components/ui/badge";
import { Card, CardContent, CardHeader } from "@infralens-components/ui/card";
import { CATEGORY_LABELS } from "@infralens-lib/checks/category-labels";
import { GlobalScore } from "@infralens-lib/checks/types";
import { cn } from "@infralens-lib/utils";
import { CircleCheckBig, TriangleAlert } from "lucide-react";

// Static, hand-picked numbers — not derived from a real analysis. Master
// plan §6.3: "un exemple statique crédible", clearly labeled as a
// demonstration so it's never confused with a real report. Check cards
// below reuse the exact same status-badge styling as the real
// CheckResultCard (src/components/results/check-result-card.tsx) so this
// preview isn't just thematically similar to a real report but pixel
// consistent with one.
const MOCK_SCORE: GlobalScore = {
  score: 84,
  grade: "B",
  categories: [
    { category: "http-security", score: 21, maxScore: 25 },
    { category: "network-dns", score: 17, maxScore: 20 },
    { category: "infrastructure", score: 20, maxScore: 20 },
    { category: "website-structure", score: 12, maxScore: 15 },
    { category: "metadata-stack", score: 8, maxScore: 10 },
    { category: "performance", score: 6, maxScore: 10 },
  ],
  scoredCount: 16,
  excludedCount: 2,
  strongestCategory: "infrastructure",
  topPriorityCategory: "performance",
};

const STATUS_STYLE = {
  pass: {
    icon: CircleCheckBig,
    label: "Pass",
    className: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
  },
  warning: {
    icon: TriangleAlert,
    label: "Warning",
    className: "text-amber-500 border-amber-500/20 bg-amber-500/10",
  },
} as const;

const MOCK_CHECKS = [
  {
    id: "https",
    label: "HTTPS & TLS",
    status: "pass",
    summary:
      "HTTPS is properly configured with a valid, non-expiring TLS certificate.",
    points: 6,
  },
  {
    id: "dns-security",
    label: "DNS Security",
    status: "pass",
    summary: "SPF and DMARC records are both present.",
    points: 7,
  },
  {
    id: "headers",
    label: "HTTP Security Headers",
    status: "warning",
    summary:
      "Content-Security-Policy is present but still allows unsafe-inline scripts.",
    points: 4,
  },
] as const;

export function ResultsPreview() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            See what a report looks like
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            A shortened example — no need to run a real analysis to see the
            shape of it.
          </p>
        </div>

        <Card className="border-2 border-dashed border-zinc-700 bg-zinc-900/50">
          <CardHeader>
            <Badge
              variant="outline"
              className="w-fit border-brand-secondary/30 text-brand-secondary-hover"
            >
              Example report — not a real analysis
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreBadge score={MOCK_SCORE} />
              <div className="flex-1 w-full space-y-2">
                <p className="text-sm text-zinc-400">example.com</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                  {MOCK_SCORE.categories.map((c) => (
                    <div
                      key={c.category}
                      className="flex justify-between text-xs text-zinc-400"
                    >
                      <span>{CATEGORY_LABELS[c.category]}</span>
                      <span>
                        {c.score}/{c.maxScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                A few checks, same as the real report
              </p>
              {MOCK_CHECKS.map((check) => {
                const style = STATUS_STYLE[check.status];
                const Icon = style.icon;
                return (
                  <div
                    key={check.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-zinc-100">
                        {check.label}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-400 font-mono">
                          +{check.points} pts
                        </span>
                        <Badge
                          variant="outline"
                          className={cn("border", style.className)}
                        >
                          <Icon className="size-3 mr-1.5" aria-hidden="true" />
                          {style.label}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400">{check.summary}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
