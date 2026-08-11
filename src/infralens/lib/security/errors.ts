/** Typed errors for target validation and safe fetching (master plan §21.5). Each carries a `userMessage` — the only text that should ever reach the UI; the `message` (Error's own) may be more precise for logs but must still never include a full URL or a raw resolved IP, per §8.9/§31.2. */

export class InvalidTargetError extends Error {
  readonly userMessage: string;
  constructor(message: string, userMessage = "This URL is not valid.") {
    super(message);
    this.name = "InvalidTargetError";
    this.userMessage = userMessage;
  }
}

export class BlockedTargetError extends Error {
  readonly userMessage: string;
  constructor(
    message: string,
    userMessage = "This target cannot be analyzed — it resolves to a non-public address.",
  ) {
    super(message);
    this.name = "BlockedTargetError";
    this.userMessage = userMessage;
  }
}

export class DnsResolutionError extends Error {
  readonly userMessage: string;
  constructor(
    message: string,
    userMessage = "This domain could not be resolved.",
  ) {
    super(message);
    this.name = "DnsResolutionError";
    this.userMessage = userMessage;
  }
}

export class RedirectLimitError extends Error {
  readonly userMessage: string;
  constructor(
    message: string,
    userMessage = "Too many redirects were followed for this target.",
  ) {
    super(message);
    this.name = "RedirectLimitError";
    this.userMessage = userMessage;
  }
}

export class ResponseTooLargeError extends Error {
  readonly userMessage: string;
  constructor(
    message: string,
    userMessage = "The response from this target was too large to analyze.",
  ) {
    super(message);
    this.name = "ResponseTooLargeError";
    this.userMessage = userMessage;
  }
}

/** True for any of this module's typed errors — used to decide whether an error's `userMessage` is safe to surface as-is. */
export function isSecurityError(
  error: unknown,
): error is
  | InvalidTargetError
  | BlockedTargetError
  | DnsResolutionError
  | RedirectLimitError
  | ResponseTooLargeError {
  return (
    error instanceof InvalidTargetError ||
    error instanceof BlockedTargetError ||
    error instanceof DnsResolutionError ||
    error instanceof RedirectLimitError ||
    error instanceof ResponseTooLargeError
  );
}
