import { GlobalScore } from "@infralens-lib/checks/types";
import { cn } from "@infralens-lib/utils";

// Deliberately cautious wording — grades are a visual aid over a set of
// public signals, not a certification, so labels avoid absolute-sounding
// terms like "Excellent" or "Critical". Keyed by the letter itself (not a
// re-derived score threshold) — `score.grade` is already the real engine's
// decision (`scoreToGrade` in `calculate-score.ts`), this table only maps
// that letter to display copy/color so the two can't silently diverge.
const GRADE_INFO: Record<
  GlobalScore["grade"],
  { label: string; color: string }
> = {
  A: { label: "Strong configuration signals", color: "text-emerald-400" },
  B: { label: "Good, with improvements available", color: "text-lime-400" },
  C: { label: "Mixed configuration", color: "text-yellow-400" },
  D: { label: "Several important improvements", color: "text-orange-400" },
  E: {
    label: "Major public configuration issues detected",
    color: "text-red-400",
  },
};

type ScoreBadgeProps = {
  score: GlobalScore;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const gradeInfo = GRADE_INFO[score.grade];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl font-bold",
          gradeInfo.color,
        )}
      >
        {score.grade}
      </div>
      <span className="text-sm text-muted-foreground text-center max-w-48">
        {score.score}/100 · {gradeInfo.label}
      </span>
    </div>
  );
}
