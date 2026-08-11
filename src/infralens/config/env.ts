/** Environment variable validation (master plan §21.4 — "valider les variables d'environnement au démarrage"). Every consumer reads `env` from here instead of `process.env` directly, so a misconfiguration fails fast at module load instead of surfacing as a confusing runtime error deep in a check. */

export type Env = {
  ipapiKey?: string;
  siteUrl?: string;
  vercelUrl?: string;
};

export function parseEnv(raw: Record<string, string | undefined>): Env {
  const ipapiKey = raw.IPAPI_KEY?.trim() || undefined;

  const siteUrl = raw.NEXT_PUBLIC_SITE_URL?.trim() || undefined;
  if (siteUrl) {
    try {
      new URL(siteUrl);
    } catch {
      throw new Error(
        `Invalid environment configuration: NEXT_PUBLIC_SITE_URL is not a valid URL ("${siteUrl}").`,
      );
    }
  }

  const vercelUrl = raw.VERCEL_URL?.trim() || undefined;

  return { ipapiKey, siteUrl, vercelUrl };
}

export const env = parseEnv(process.env);
