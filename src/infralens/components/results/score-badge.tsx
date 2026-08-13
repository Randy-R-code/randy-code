import { GlobalScore } from "@infralens-lib/checks/types";
import { cn } from "@infralens-lib/utils";

// Deliberately cautious wording — grades are a visual aid over a set of
// public signals, not a certification, so labels avoid absolute-sounding
// terms like "Excellent" or "Critical".
const SCORE_GRADES = [
  {
    min: 90,
    grade: "A",
    label: "Strong configuration signals",
    color: "text-emerald-400",
  },
  {
    min: 75,
    grade: "B",
    label: "Good, with improvements available",
    color: "text-lime-400",
  },
  {
    min: 60,
    grade: "C",
    label: "Mixed configuration",
    color: "text-yellow-400",
  },
  {
    min: 40,
    grade: "D",
    label: "Several important improvements",
    color: "text-orange-400",
  },
  {
    min: 0,
    grade: "E",
    label: "Major public configuration issues detected",
    color: "text-red-400",
  },
] as const;

type ScoreBadgeProps = {
  score: GlobalScore;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const gradeInfo =
    SCORE_GRADES.find((g) => score.score >= g.min) ??
    SCORE_GRADES[SCORE_GRADES.length - 1];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl font-bold",
          gradeInfo.color,
        )}
      >
        {gradeInfo.grade}
      </div>
      <span className="text-sm text-muted-foreground text-center max-w-48">
        {score.score}/100 · {gradeInfo.label}
      </span>
    </div>
  );
}
