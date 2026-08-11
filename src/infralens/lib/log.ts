/** Minimal structured server-side logger (master plan §21.4, §31, §8.9). Never pass a full URL with query string, raw headers/content, or a clear-text user IP — hostname, error category, duration, and check id only. */

type LogLevel = "info" | "warn" | "error";

type LogFields = {
  event: string;
  durationMs?: number;
  checkId?: string;
  [key: string]: string | number | boolean | undefined;
};

function log(level: LogLevel, fields: LogFields) {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    ...fields,
  };

  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logInfo = (fields: LogFields) => log("info", fields);
export const logWarn = (fields: LogFields) => log("warn", fields);
export const logError = (fields: LogFields) => log("error", fields);
