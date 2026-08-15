/** Environment variable validation. Every consumer reads `env` from here instead of `process.env` directly, so a misconfiguration fails fast at module load instead of surfacing as a confusing runtime error deep in a check. */

export type Env = {
  ipapiKey?: string;
};

export function parseEnv(raw: Record<string, string | undefined>): Env {
  const ipapiKey = raw.IPAPI_KEY?.trim() || undefined;

  return { ipapiKey };
}

export const env = parseEnv(process.env);
