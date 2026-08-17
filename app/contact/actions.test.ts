import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactState } from "./actions";

const sendMock = vi.fn().mockResolvedValue({ data: {}, error: null });
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const checkRateLimit = vi.fn();
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit }));
vi.mock("@/lib/rate-limit/identifier", () => ({
  getClientIdentifier: () => "1.2.3.4",
}));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));

const { sendContact } = await import("./actions");

function buildFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  fd.set("name", overrides.name ?? "Jane Doe");
  fd.set("email", overrides.email ?? "jane@example.com");
  fd.set("message", overrides.message ?? "Hello, I have a question.");
  fd.set("company", overrides.company ?? "");
  fd.set("startedAt", overrides.startedAt ?? String(Date.now() - 5000));
  return fd;
}

const initial: ContactState = {};

describe("sendContact", () => {
  beforeEach(() => {
    sendMock.mockClear();
    checkRateLimit.mockReset().mockResolvedValue({
      allowed: true,
      limit: 3,
      remaining: 2,
      resetAt: Date.now() + 900_000,
    });
  });

  it("reaches Resend for a legitimate, allowed submission", async () => {
    const result = await sendContact(initial, buildFormData());

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true });
  });

  it("never calls Resend when rate-limited", async () => {
    checkRateLimit.mockResolvedValue({
      allowed: false,
      limit: 3,
      remaining: 0,
      resetAt: Date.now() + 900_000,
      reason: "exceeded",
    });

    const result = await sendContact(initial, buildFormData());

    expect(sendMock).not.toHaveBeenCalled();
    expect(result.error).toMatch(/Trop de messages/);
  });

  it("never calls Resend when the honeypot field is filled, and fakes success", async () => {
    const result = await sendContact(
      initial,
      buildFormData({ company: "Acme Corp" }),
    );

    expect(sendMock).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("never calls Resend when submitted faster than a human could fill the form", async () => {
    const result = await sendContact(
      initial,
      buildFormData({ startedAt: String(Date.now()) }),
    );

    expect(sendMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("rejects an oversized message without calling Resend", async () => {
    const result = await sendContact(
      initial,
      buildFormData({ message: "a".repeat(5001) }),
    );

    expect(sendMock).not.toHaveBeenCalled();
    expect(result.error).toMatch(/dépasse la longueur/);
  });

  it("rejects a submission missing a required field", async () => {
    const formData = buildFormData();
    formData.delete("message");

    const result = await sendContact(initial, formData);

    expect(sendMock).not.toHaveBeenCalled();
    expect(result.error).toMatch(/obligatoires/);
  });

  it("rejects an invalid email address", async () => {
    const result = await sendContact(
      initial,
      buildFormData({ email: "not-an-email" }),
    );

    expect(sendMock).not.toHaveBeenCalled();
    expect(result.error).toMatch(/email invalide/i);
  });
});
