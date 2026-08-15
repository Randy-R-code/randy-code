"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CATEGORY_LABELS } from "@infralens-lib/checks/category-labels";
import { CATEGORY_MAX_WEIGHTS } from "@infralens-lib/checks/scoring-config";
import { CheckCategory, GlobalScore } from "@infralens-lib/checks/types";
import Link from "next/link";

const CATEGORY_ORDER: CheckCategory[] = [
  "http-security",
  "network-dns",
  "infrastructure",
  "website-structure",
  "metadata-stack",
  "performance",
];

export function WhyScoreDialog({ score }: { score: GlobalScore }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
        >
          Why this score?
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>How the Score is Calculated</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Understanding InfraLens scoring system
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-foreground">
          <p>
            Every check has its own point weight (not its category) — a
            category&apos;s total is simply the sum of its checks&apos; weights,
            so an all-informational category like Infrastructure has no fixed
            budget of its own.
          </p>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">
              Category totals (when every check runs normally):
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {CATEGORY_ORDER.map((category) => (
                <li key={category}>
                  {CATEGORY_LABELS[category]}: {CATEGORY_MAX_WEIGHTS[category]}{" "}
                  point{CATEGORY_MAX_WEIGHTS[category] === 1 ? "" : "s"}
                  {CATEGORY_MAX_WEIGHTS[category] === 0 && " (informational)"}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Status Points:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Pass: 100% of the check&apos;s weight</li>
              <li>Warning: 60% of the check&apos;s weight</li>
              <li>Fail: 0% of the check&apos;s weight</li>
              <li>
                Info / Not applicable / Inconclusive / Unavailable / Error:
                excluded from the score entirely — a neutral note, a genuinely
                uncertain result, or a check that couldn&apos;t run doesn&apos;t
                count for or against the site
              </li>
            </ul>
          </div>
          <div className="space-y-1 rounded border border-border bg-background/50 p-3">
            <p className="font-semibold text-foreground">This analysis:</p>
            <p className="text-muted-foreground">
              {score.scoredCount} check{score.scoredCount === 1 ? "" : "s"}{" "}
              counted toward the score
              {score.excludedCount > 0 &&
                `, ${score.excludedCount} excluded (couldn't run or informational only)`}
              .
            </p>
            {score.strongestCategory && (
              <p className="text-muted-foreground">
                Strongest area:{" "}
                {CATEGORY_LABELS[score.strongestCategory] ??
                  score.strongestCategory}
                .
              </p>
            )}
            {score.topPriorityCategory && (
              <p className="text-muted-foreground">
                Most worth improving:{" "}
                {CATEGORY_LABELS[score.topPriorityCategory] ??
                  score.topPriorityCategory}
                .
              </p>
            )}
          </div>
          <p className="text-muted-foreground">
            Limits: checks rely on what a site publicly exposes and can miss
            context only the site owner would know. See the{" "}
            <Link
              href="/tools/infralens/docs"
              className="underline underline-offset-4 hover:text-foreground"
            >
              documentation
            </Link>{" "}
            for how each check works.
          </p>
          <p className="pt-2 text-muted-foreground">
            The final score represents an overall infrastructure health
            indicator, not a security certification.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
