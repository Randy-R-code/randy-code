/** Shared between the history panel and the webhooks event list — both show a coarse relative age for a timestamp. */
export function relativeTime(timestamp: number): string {
  const diffSeconds = Math.round((Date.now() - timestamp) / 1000);
  if (diffSeconds < 60) return "just now";
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}
