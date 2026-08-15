/** A category with no scoreable checks this report (either informational by design, like Infrastructure/WAF, or every normally-scoreable check was excluded for this specific report) has no earned/max fraction to show. */
export function formatCategoryScore(score: number, maxScore: number): string {
  return maxScore > 0 ? `${score}/${maxScore}` : "Info";
}
