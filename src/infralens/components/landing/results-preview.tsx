import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckResultCard } from "@infralens-components/results/check-result-card";
import { PrioritySummary } from "@infralens-components/results/priority-summary";
import { ScoreBadge } from "@infralens-components/results/score-badge";
import {
  MOCK_CHECKS,
  MOCK_HOSTNAME,
  MOCK_SCORE,
  MOCK_URL,
} from "@infralens-lib/mock-report";

// Which of the shared MOCK_CHECKS to show as example cards below the
// summary — a mix of pass/warning/fail, same as PrioritySummary reads from
// the same array above it.
const EXAMPLE_CHECK_IDS = ["https", "headers", "robots"];

export function ResultsPreview() {
  const exampleChecks = MOCK_CHECKS.filter((check) =>
    EXAMPLE_CHECK_IDS.includes(check.id),
  );

  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            See what a report looks like
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            A shortened example — no need to run a real analysis to see the
            shape of it.
          </p>
        </div>

        <Card className="border-2 border-dashed border-border bg-card/50">
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
              <div className="flex-1 w-full min-w-0 space-y-1 text-center sm:text-left">
                <p className="font-semibold truncate">{MOCK_HOSTNAME}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {MOCK_URL}
                </p>
              </div>
            </div>

            <PrioritySummary checks={MOCK_CHECKS} />

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                A few checks, same as the real report
              </p>
              <div className="space-y-3">
                {exampleChecks.map((check) => (
                  <CheckResultCard key={check.id} result={check} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
