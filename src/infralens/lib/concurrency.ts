/**
 * Runs `fn` over `items` with at most `limit` calls in flight at once — a
 * concurrency pool instead of an unbounded `Promise.all`. Order of
 * `results` matches `items`; a rejected `fn` call
 * propagates like `Promise.all` would (callers that want isolation should
 * catch inside `fn`, same as this project's checks already do).
 */
export async function mapWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++;
      results[current] = await fn(items[current], current);
    }
  }

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workerCount }, worker));

  return results;
}
