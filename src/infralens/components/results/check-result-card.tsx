"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CheckResult } from "@infralens-lib/checks/types";
import { cn } from "@infralens-lib/utils";
import {
  ChevronDown,
  CircleAlert,
  CircleCheckBig,
  CircleHelp,
  CircleSlash,
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { CopyButton } from "./copy-button";
import { RecommendationCard } from "./recommendation-card";
import { humanizeKey, RenderValue } from "./render-value";

const statusConfig = {
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
  fail: {
    icon: CircleX,
    label: "Fail",
    className: "text-red-400 border-red-400/20 bg-red-400/10",
  },
  info: {
    icon: Info,
    label: "Info",
    className: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  },
  unavailable: {
    icon: CircleSlash,
    label: "Unavailable",
    className:
      "text-muted-foreground border-muted-foreground/20 bg-muted-foreground/10",
  },
  error: {
    icon: CircleAlert,
    label: "Error",
    className: "text-orange-400 border-orange-400/20 bg-orange-400/10",
  },
};

// Falls back to a neutral, non-alarming badge for any status this build
// doesn't recognize — e.g. a `localStorage` history entry saved before
// Phase 4's status vocabulary changed (was "ok"/"warning"/"error").
const unknownStatusConfig = {
  icon: CircleHelp,
  label: "Unknown",
  className:
    "text-muted-foreground border-muted-foreground/20 bg-muted-foreground/10",
};

function hasDetail(result: CheckResult): boolean {
  return !!(
    (result.evidence && result.evidence.length > 0) ||
    (result.data && Object.keys(result.data as object).length > 0) ||
    (result.limitations && result.limitations.length > 0) ||
    result.recommendation
  );
}

export function CheckResultCard({ result }: { result: CheckResult }) {
  const [open, setOpen] = useState(false);
  const config = statusConfig[result.status] ?? unknownStatusConfig;
  const Icon = config.icon;
  const expandable = hasDetail(result);

  return (
    <Card className="border-border bg-background/50">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg flex items-center gap-1.5 min-w-0">
              <span className="truncate">{result.label}</span>
              <CopyButton
                value={`${result.label}: ${result.summary ?? result.status}`}
                label="Copy value"
              />
            </CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              {result.scored &&
                typeof result.scoreContribution === "number" && (
                  <span className="text-xs text-muted-foreground font-mono">
                    +{result.scoreContribution} pts
                  </span>
                )}
              <Badge
                variant="outline"
                className={cn("border", config.className)}
                aria-label={`Status: ${config.label}`}
              >
                <Icon className="size-3 mr-1.5" aria-hidden="true" />
                {config.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {result.summary && (
            <p className="text-sm text-muted-foreground mb-2">
              {result.summary}
            </p>
          )}
          {result.durationMs > 0 && (
            <p className="text-xs text-muted-foreground mb-2">
              Completed in {result.durationMs}ms
            </p>
          )}

          {expandable && (
            <>
              <CollapsibleTrigger
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label={open ? "Hide details" : "Show details"}
              >
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    open && "rotate-180",
                  )}
                  aria-hidden="true"
                />
                {open ? "Hide details" : "Show details"}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-3 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {result.evidence && result.evidence.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                      Evidence
                    </p>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                      {result.evidence
                        .filter((item) => !item.sensitive)
                        .map((item, i) => (
                          <div key={i} className="contents">
                            <dt className="text-muted-foreground">
                              {item.label}:
                            </dt>
                            <dd className="text-foreground wrap-break-word">
                              <RenderValue value={item.value} />
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                )}

                {result.data !== undefined &&
                  result.data !== null &&
                  Object.keys(result.data as object).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                        Details
                      </p>
                      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                        {Object.entries(result.data as Record<string, unknown>)
                          .filter(([, v]) => v !== undefined && v !== null)
                          .map(([key, value]) => (
                            <div key={key} className="contents">
                              <dt className="text-muted-foreground">
                                {humanizeKey(key)}:
                              </dt>
                              <dd className="text-foreground">
                                <RenderValue value={value} />
                              </dd>
                            </div>
                          ))}
                      </dl>
                    </div>
                  )}

                {result.limitations && result.limitations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                      Limitations
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                      {result.limitations.map((limitation, i) => (
                        <li key={i}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendation && (
                  <RecommendationCard recommendation={result.recommendation} />
                )}
              </CollapsibleContent>
            </>
          )}
        </CardContent>
      </Collapsible>
    </Card>
  );
}
