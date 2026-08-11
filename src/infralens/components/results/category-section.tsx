import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATEGORY_LABELS } from "@infralens-lib/checks/category-labels";
import { groupChecksByCategory } from "@infralens-lib/checks/category-sections";
import { CategoryScore, CheckResult } from "@infralens-lib/checks/types";
import { CheckResultCard } from "./check-result-card";

function countsFor(checks: CheckResult[]) {
  return {
    pass: checks.filter((c) => c.status === "pass").length,
    warning: checks.filter((c) => c.status === "warning").length,
    fail: checks.filter((c) => c.status === "fail").length,
  };
}

export function CategorySections({
  categories,
  checks,
}: {
  categories: CategoryScore[];
  checks: CheckResult[];
}) {
  const sections = groupChecksByCategory(categories, checks);

  return (
    <Accordion
      type="multiple"
      defaultValue={sections.map((s) => s.category.category)}
      className="rounded-lg border border-border bg-background/50 px-4"
    >
      {sections.map(({ category, checks: categoryChecks }) => {
        const counts = countsFor(categoryChecks);
        const percentage =
          category.maxScore > 0
            ? Math.round((category.score / category.maxScore) * 100)
            : 0;

        return (
          <AccordionItem
            key={category.category}
            value={category.category}
            id={`category-${category.category}`}
            className="scroll-mt-24"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-1 flex-col gap-2 pr-4 text-left sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">
                    {CATEGORY_LABELS[category.category]}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {category.score}/{category.maxScore}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${CATEGORY_LABELS[category.category]} score: ${percentage}%`}
                    className="h-1.5 w-24 rounded bg-white/10"
                  >
                    <div
                      className="h-1.5 rounded bg-muted-foreground"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {counts.pass} pass · {counts.warning} warn · {counts.fail}{" "}
                    fail
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {categoryChecks.map((result) => (
                  <CheckResultCard key={result.id} result={result} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
