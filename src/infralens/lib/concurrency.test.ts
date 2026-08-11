import { describe, expect, it } from "vitest";
import { mapWithConcurrencyLimit } from "./concurrency";

describe("mapWithConcurrencyLimit", () => {
  it("returns results in the same order as the input, regardless of completion order", async () => {
    const delays = [30, 10, 20, 0];

    const results = await mapWithConcurrencyLimit(delays, 4, async (ms, i) => {
      await new Promise((resolve) => setTimeout(resolve, ms));
      return i;
    });

    expect(results).toEqual([0, 1, 2, 3]);
  });

  it("never runs more than `limit` calls concurrently", async () => {
    let active = 0;
    let maxActive = 0;

    await mapWithConcurrencyLimit(Array.from({ length: 10 }), 3, async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active--;
    });

    expect(maxActive).toBeLessThanOrEqual(3);
  });

  it("processes every item exactly once", async () => {
    const seen: number[] = [];

    await mapWithConcurrencyLimit([1, 2, 3, 4, 5], 2, async (item) => {
      seen.push(item);
    });

    expect(seen.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles an empty list", async () => {
    const results = await mapWithConcurrencyLimit([], 5, async () => 1);

    expect(results).toEqual([]);
  });

  it("propagates a rejection from fn", async () => {
    await expect(
      mapWithConcurrencyLimit([1, 2, 3], 2, async (item) => {
        if (item === 2) throw new Error("boom");
        return item;
      }),
    ).rejects.toThrow("boom");
  });
});
