import { FIELD_META } from "@/cron-builder/lib/cron-validation";
import { CRON_FIELD_ORDER } from "@/cron-builder/lib/types";
import { brand } from "@/lib/brand";

const SYNTAX_ROWS = [
  { syntax: "*", meaning: "Any value", example: "* * * * *" },
  { syntax: ",", meaning: "Multiple values", example: "0 9,17 * * *" },
  { syntax: "-", meaning: "Range", example: "0 9 * * 1-5" },
  { syntax: "/", meaning: "Step", example: "*/15 * * * *" },
] as const;

export function CronReference() {
  return (
    <section aria-labelledby="cron-reference-heading" className="mt-10">
      <h2
        id="cron-reference-heading"
        className="mb-3 text-xs font-medium text-zinc-400"
      >
        Syntax reference
      </h2>

      <div
        className="overflow-x-auto rounded-xl border"
        style={{
          borderColor: `${brand.colors.green[500]}18`,
          background: brand.colors.surface[2],
        }}
      >
        <table className="w-full min-w-105 text-left text-sm">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: brand.colors.border.subtle }}
            >
              <th
                scope="col"
                className="px-4 py-2.5 text-xs font-medium text-zinc-400"
              >
                Syntax
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-xs font-medium text-zinc-400"
              >
                Meaning
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-xs font-medium text-zinc-400"
              >
                Example
              </th>
            </tr>
          </thead>
          <tbody>
            {SYNTAX_ROWS.map((row) => (
              <tr
                key={row.syntax}
                className="border-b last:border-0"
                style={{ borderColor: brand.colors.border.subtle }}
              >
                <td className="px-4 py-2.5 font-mono text-zinc-300">
                  {row.syntax}
                </td>
                <td className="px-4 py-2.5 text-zinc-400">{row.meaning}</td>
                <td className="px-4 py-2.5 font-mono text-zinc-400">
                  {row.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {CRON_FIELD_ORDER.map((name) => {
          const meta = FIELD_META[name];
          return (
            <div
              key={name}
              className="rounded-lg border px-3 py-2.5"
              style={{
                borderColor: `${brand.colors.green[500]}18`,
                background: brand.colors.surface[2],
              }}
            >
              <p className="text-xs font-medium text-zinc-400">{meta.label}</p>
              <p className="mt-0.5 font-mono text-sm text-zinc-300">
                {meta.min}–{meta.max}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
