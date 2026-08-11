import { Fragment, ReactNode } from "react";

/** camelCase/snake_case key -> "Title Case" label, for generic data rendering. */
export function humanizeKey(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Renders any check's `data`/evidence value without per-check hardcoding —
 * every check used to need its own bespoke UI branch (only `headers` had
 * one) before this, leaving 17 of 18 checks with no second-level detail at
 * all (master plan §14.4).
 */
export function RenderValue({ value }: { value: unknown }): ReactNode {
  if (value === null || value === undefined) return null;

  if (typeof value === "boolean") {
    return <span>{value ? "Yes" : "No"}</span>;
  }

  if (typeof value === "string" || typeof value === "number") {
    return <span className="wrap-break-word">{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0)
      return <span className="text-muted-foreground">—</span>;
    if (value.every((v) => typeof v === "string" || typeof v === "number")) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-card text-foreground text-xs font-mono"
            >
              {String(v)}
            </span>
          ))}
        </div>
      );
    }
    return (
      <ul className="space-y-1">
        {value.map((v, i) => (
          <li key={i} className="text-xs">
            <RenderValue value={v} />
          </li>
        ))}
      </ul>
    );
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(
      ([, v]) => v !== undefined && v !== null,
    );
    if (entries.length === 0)
      return <span className="text-muted-foreground">—</span>;
    return (
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs">
        {entries.map(([k, v]) => (
          <Fragment key={k}>
            <dt className="text-muted-foreground">{humanizeKey(k)}:</dt>
            <dd className="text-foreground">
              <RenderValue value={v} />
            </dd>
          </Fragment>
        ))}
      </dl>
    );
  }

  return <span>{String(value)}</span>;
}
