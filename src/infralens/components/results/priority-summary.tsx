import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { derivePrioritySummary } from "@infralens-lib/checks/priority-summary";
import { CheckResult } from "@infralens-lib/checks/types";
import { CircleCheckBig, CircleSlash, TriangleAlert } from "lucide-react";

function PriorityRow({ check }: { check: CheckResult }) {
  return (
    <li className="flex items-start gap-2 text-sm text-foreground">
      <TriangleAlert
        className="size-4 shrink-0 text-amber-500 mt-0.5"
        aria-hidden="true"
      />
      <span>
        <span className="font-medium">{check.label}</span>
        {check.summary && (
          <span className="text-muted-foreground"> — {check.summary}</span>
        )}
      </span>
    </li>
  );
}

function PositiveRow({ check }: { check: CheckResult }) {
  return (
    <li className="flex items-start gap-2 text-sm text-foreground">
      <CircleCheckBig
        className="size-4 shrink-0 text-emerald-500 mt-0.5"
        aria-hidden="true"
      />
      <span>
        <span className="font-medium">{check.label}</span>
        {check.summary && (
          <span className="text-muted-foreground"> — {check.summary}</span>
        )}
      </span>
    </li>
  );
}

export function PrioritySummary({ checks }: { checks: CheckResult[] }) {
  const { positives, priorities, unavailableCount } =
    derivePrioritySummary(checks);

  if (positives.length === 0 && priorities.length === 0) {
    return null;
  }

  return (
    <Card className="border-border bg-background/50">
      <CardHeader>
        <CardTitle className="text-lg">At a glance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {priorities.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Worth fixing first
              </h4>
              <ul className="space-y-1.5">
                {priorities.map((c) => (
                  <PriorityRow key={c.id} check={c} />
                ))}
              </ul>
            </div>
          )}
          {positives.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Working well
              </h4>
              <ul className="space-y-1.5">
                {positives.map((c) => (
                  <PositiveRow key={c.id} check={c} />
                ))}
              </ul>
            </div>
          )}
        </div>
        {unavailableCount > 0 && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <CircleSlash className="size-3.5 shrink-0" aria-hidden="true" />
            {unavailableCount} check{unavailableCount === 1 ? "" : "s"} above{" "}
            {unavailableCount === 1 ? "isn't" : "aren't"} counted here
            (informational, unavailable, or a technical error) — see the
            categories below.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          This is a snapshot of public, automatically checkable signals, not a
          complete security or quality assessment.
        </p>
      </CardContent>
    </Card>
  );
}
