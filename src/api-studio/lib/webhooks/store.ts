import {
  WEBHOOK_MAX_EVENTS,
  WEBHOOK_TTL_SECONDS,
} from "@/api-studio/config/constants";
import { getRedis } from "@/lib/rate-limit/client";
import { nanoid } from "nanoid";
import type {
  WebhookEndpoint,
  WebhookEvent,
  WebhookEventSummary,
} from "./types";

function metaKey(token: string): string {
  return `api-studio:webhook:${token}:meta`;
}
function eventsKey(token: string): string {
  return `api-studio:webhook:${token}:events`;
}
function eventKey(token: string, id: string): string {
  return `api-studio:webhook:${token}:event:${id}`;
}

/** Every write recomputes its TTL from the endpoint's fixed expiry, rather than resetting a fresh window — everything under one endpoint always expires together. */
function remainingTtlSeconds(expiresAt: number): number {
  return Math.max(1, Math.ceil((expiresAt - Date.now()) / 1000));
}

/**
 * Unlike the rate limiter, Webhooks *is* the feature — there's no sensible
 * "fail open" when Redis isn't configured (nothing to show). Every function
 * here returns `null`/`false`/`[]` in that case, and the Server Action
 * layer (Part C) turns that into an explicit "temporarily unavailable"
 * message rather than pretending creation succeeded.
 */
export async function createEndpoint(): Promise<WebhookEndpoint | null> {
  const redis = getRedis();
  if (!redis) return null;

  const createdAt = Date.now();
  const endpoint: WebhookEndpoint = {
    token: nanoid(),
    createdAt,
    expiresAt: createdAt + WEBHOOK_TTL_SECONDS * 1000,
  };

  await redis.set(metaKey(endpoint.token), endpoint, {
    ex: WEBHOOK_TTL_SECONDS,
  });
  return endpoint;
}

/** `null` for a missing *or* naturally-expired endpoint — deliberately indistinguishable, so a caller can never leak which case it was. */
export async function getEndpointMeta(
  token: string,
): Promise<WebhookEndpoint | null> {
  const redis = getRedis();
  if (!redis) return null;

  const endpoint = await redis.get<WebhookEndpoint>(metaKey(token));
  return endpoint ?? null;
}

/**
 * Stores the event, pushes its id to the endpoint's ordered id list, and
 * evicts the oldest id/event pair past `WEBHOOK_MAX_EVENTS` — eviction
 * rather than rejection, per the spec's "friendlier for a debugging tool"
 * guidance. Returns `false` if the endpoint doesn't exist (or expired)
 * so the ingestion route can 404 instead of silently writing an orphaned
 * event under a dead token.
 */
export async function appendEvent(
  token: string,
  event: WebhookEvent,
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  const endpoint = await getEndpointMeta(token);
  if (!endpoint) return false;

  const ttl = remainingTtlSeconds(endpoint.expiresAt);

  await redis.set(eventKey(token, event.id), event, { ex: ttl });
  await redis.lpush(eventsKey(token), event.id);
  await redis.expire(eventsKey(token), ttl);
  // Keeps the id list itself bounded; a trimmed-out id's own event key just
  // expires on its TTL rather than needing an explicit delete here.
  await redis.ltrim(eventsKey(token), 0, WEBHOOK_MAX_EVENTS - 1);

  return true;
}

export async function listEvents(
  token: string,
): Promise<WebhookEventSummary[]> {
  const redis = getRedis();
  if (!redis) return [];

  const ids = await redis.lrange<string>(
    eventsKey(token),
    0,
    WEBHOOK_MAX_EVENTS - 1,
  );
  if (ids.length === 0) return [];

  const events = await Promise.all(
    ids.map((id) => redis.get<WebhookEvent>(eventKey(token, id))),
  );

  return events
    .filter((event): event is WebhookEvent => event !== null)
    .map(({ id, method, timestamp, sizeBytes }) => ({
      id,
      method,
      timestamp,
      sizeBytes,
    }));
}

export async function getEvent(
  token: string,
  id: string,
): Promise<WebhookEvent | null> {
  const redis = getRedis();
  if (!redis) return null;

  const event = await redis.get<WebhookEvent>(eventKey(token, id));
  return event ?? null;
}
