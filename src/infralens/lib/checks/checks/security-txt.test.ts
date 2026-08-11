import { beforeEach, describe, expect, it, vi } from "vitest";

const { safeFetch, readBodyText } = vi.hoisted(() => ({
  safeFetch: vi.fn(),
  readBodyText: vi.fn(),
}));

vi.mock("@infralens-lib/security/safe-fetch", () => ({
  safeFetch,
  readBodyText,
}));

const { runSecurityTxtCheck } = await import("./security-txt");

function context() {
  return {
    url: "https://example.com/",
    hostname: "example.com",
    timeout: 1000,
    shared: { page: null, dns: { a: [], aaaa: [], durationMs: 0 } },
  };
}

function future(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function past(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

beforeEach(() => {
  safeFetch.mockReset();
  readBodyText.mockReset();
});

describe("runSecurityTxtCheck", () => {
  it("passes when found with a valid, non-expired Expires field", async () => {
    safeFetch.mockResolvedValue({ status: 200 });
    readBodyText.mockResolvedValue(
      `Contact: mailto:security@example.com\nExpires: ${future(180)}\n`,
    );

    const result = await runSecurityTxtCheck(context());

    expect(result.status).toBe("pass");
    expect(result.data?.present).toBe(true);
    expect(result.data?.expired).toBe(false);
  });

  it("fails when the Expires field is in the past", async () => {
    safeFetch.mockResolvedValue({ status: 200 });
    readBodyText.mockResolvedValue(
      `Contact: mailto:security@example.com\nExpires: ${past(10)}\n`,
    );

    const result = await runSecurityTxtCheck(context());

    expect(result.status).toBe("fail");
    expect(result.data?.expired).toBe(true);
    expect(result.recommendation?.id).toBe("security-txt-expired");
  });

  it("warns when present but missing the Expires field", async () => {
    safeFetch.mockResolvedValue({ status: 200 });
    readBodyText.mockResolvedValue("Contact: mailto:security@example.com\n");

    const result = await runSecurityTxtCheck(context());

    expect(result.status).toBe("warning");
    expect(result.data?.hasExpires).toBe(false);
    expect(result.recommendation?.id).toBe("security-txt-missing-expires");
  });

  it("warns when the Expires field value is not a parseable date", async () => {
    safeFetch.mockResolvedValue({ status: 200 });
    readBodyText.mockResolvedValue(
      "Contact: mailto:security@example.com\nExpires: not-a-date\n",
    );

    const result = await runSecurityTxtCheck(context());

    expect(result.status).toBe("warning");
    expect(result.data?.hasExpires).toBe(false);
    expect(result.recommendation?.id).toBe("security-txt-missing-expires");
  });

  it("warns when security.txt is not found at either location", async () => {
    safeFetch.mockResolvedValue({ status: 404 });

    const result = await runSecurityTxtCheck(context());

    expect(result.status).toBe("warning");
    expect(result.data?.present).toBe(false);
    expect(result.recommendation?.id).toBe("missing-security-txt");
  });
});
