import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckResultCard } from "@infralens-components/results/check-result-card";
import { PrioritySummary } from "@infralens-components/results/priority-summary";
import { ScoreBadge } from "@infralens-components/results/score-badge";
import {
  EXAMPLE_CHECKS,
  EXAMPLE_HOSTNAME,
  EXAMPLE_SCORE,
  EXAMPLE_URL,
} from "@infralens-lib/example-report";

// Which of the shared EXAMPLE_CHECKS to show as example cards below the
// summary — a mix of pass/warning/fail, same as PrioritySummary reads from
// the same array above it.
const PREVIEW_CHECK_IDS = ["https", "headers", "robots"];

export function ResultsPreview() {
  const previewChecks = EXAMPLE_CHECKS.filter((check) =>
    PREVIEW_CHECK_IDS.includes(check.id),
  );

  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            See what a report looks like
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            A real InfraLens scan of this very site — captured once, not re-run
            on every visit.
          </p>
        </div>

        <Card className="border-2 border-dashed border-border bg-card/50">
          <CardHeader>
            <Badge
              variant="outline"
              className="w-fit border-brand-secondary/30 text-brand-secondary-hover"
            >
              Example — randy-code.dev
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreBadge score={EXAMPLE_SCORE} />
              <div className="flex-1 w-full min-w-0 space-y-1 text-center sm:text-left">
                <p className="font-semibold truncate">{EXAMPLE_HOSTNAME}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {EXAMPLE_URL}
                </p>
              </div>
            </div>

            <PrioritySummary checks={EXAMPLE_CHECKS} />

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                A few checks, straight from the real report
              </p>
              <div className="space-y-3">
                {previewChecks.map((check) => (
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
