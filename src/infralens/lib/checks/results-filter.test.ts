import { describe, expect, it } from "vitest";
import { filterChecks } from "./results-filter";
import { CheckResult } from "./types";

function check(id: string, status: CheckResult["status"]): CheckResult {
  return {
    id,
    label: id,
    category: "http-security",
    status,
    durationMs: 1,
  };
}

const checks = [
  check("a", "pass"),
  check("b", "warning"),
  check("c", "fail"),
  check("d", "info"),
  check("e", "unavailable"),
  check("f", "error"),
];

describe("filterChecks", () => {
  it("all returns every check unchanged", () => {
    expect(filterChecks(checks, "all")).toEqual(checks);
  });

  it("needs-attention returns fail and warning only", () => {
    expect(filterChecks(checks, "needs-attention").map((c) => c.id)).toEqual([
      "b",
      "c",
    ]);
  });

  it("passed returns pass only", () => {
    expect(filterChecks(checks, "passed").map((c) => c.id)).toEqual(["a"]);
  });

  it("informational returns info only", () => {
    expect(filterChecks(checks, "informational").map((c) => c.id)).toEqual([
      "d",
    ]);
  });

  it("unavailable returns unavailable and error", () => {
    expect(filterChecks(checks, "unavailable").map((c) => c.id)).toEqual([
      "e",
      "f",
    ]);
  });
});
