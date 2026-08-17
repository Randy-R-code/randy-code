export type WebhookEndpoint = {
  token: string;
  createdAt: number;
  expiresAt: number;
};

export type WebhookEventSummary = {
  id: string;
  method: string;
  timestamp: number;
  sizeBytes: number;
};

export type WebhookEvent = WebhookEventSummary & {
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  bodyText: string;
  isBinary: boolean;
};
