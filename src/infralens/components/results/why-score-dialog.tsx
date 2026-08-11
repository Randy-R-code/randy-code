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
import { GlobalScore } from "@infralens-lib/checks/types";
import Link from "next/link";

export function WhyScoreDialog({ score }: { score: GlobalScore }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-zinc-400 underline-offset-4 hover:underline hover:text-zinc-300"
        >
          Why this score?
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle>How the Score is Calculated</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Understanding InfraLens scoring system
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-zinc-300">
          <p>
            The score is calculated based on a weighted set of infrastructure
            checks: points earned ÷ points applicable to checks that actually
            ran, per category, then summed.
          </p>
          <p>
            Each check belongs to a category (Security, Performance, Headers,
            Network…). Each category contributes differently to the final score.
          </p>
          <div className="space-y-2">
            <p className="font-semibold text-zinc-200">Category Weights:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>HTTP & Security: 25 points</li>
              <li>Network & DNS: 20 points</li>
              <li>Infrastructure: 20 points</li>
              <li>Website Structure: 15 points</li>
              <li>Metadata & Stack: 10 points</li>
              <li>Performance: 10 points</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-zinc-200">Status Points:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Pass: 100% of category weight</li>
              <li>Warning: 60% of category weight</li>
              <li>Fail: 0% of category weight</li>
              <li>
                Info / Unavailable / Error: excluded from the score entirely — a
                neutral note or a check that couldn&apos;t run doesn&apos;t
                count for or against the site
              </li>
            </ul>
          </div>
          <div className="space-y-1 rounded border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="font-semibold text-zinc-200">This analysis:</p>
            <p className="text-zinc-400">
              {score.scoredCount} check{score.scoredCount === 1 ? "" : "s"}{" "}
              counted toward the score
              {score.excludedCount > 0 &&
                `, ${score.excludedCount} excluded (couldn't run or informational only)`}
              .
            </p>
            {score.strongestCategory && (
              <p className="text-zinc-400">
                Strongest area:{" "}
                {CATEGORY_LABELS[score.strongestCategory] ??
                  score.strongestCategory}
                .
              </p>
            )}
            {score.topPriorityCategory && (
              <p className="text-zinc-400">
                Most worth improving:{" "}
                {CATEGORY_LABELS[score.topPriorityCategory] ??
                  score.topPriorityCategory}
                .
              </p>
            )}
          </div>
          <p className="text-zinc-400">
            Limits: checks rely on what a site publicly exposes and can miss
            context only the site owner would know. See the{" "}
            <Link
              href="/tools/infralens/docs"
              className="underline underline-offset-4 hover:text-zinc-200"
            >
              documentation
            </Link>{" "}
            for how each check works.
          </p>
          <p className="pt-2 text-zinc-400">
            The final score represents an overall infrastructure health
            indicator, not a security certification.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
