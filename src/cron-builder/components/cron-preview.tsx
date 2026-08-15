import { brand } from "@/lib/brand";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
});

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatRun(date: Date): string {
  return `${dateFormatter.format(date)} · ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

interface CronSchedulePreviewProps {
  runs: Date[];
  timezone: string | null;
  valid: boolean;
}

export function CronSchedulePreview({
  runs,
  timezone,
  valid,
}: CronSchedulePreviewProps) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        borderColor: `${brand.colors.green[500]}18`,
        background: brand.colors.surface[2],
      }}
    >
      <h2 className="mb-3 text-xs font-medium text-zinc-400">Next runs</h2>

      {!valid && (
        <p className="text-sm text-zinc-500">
          Fix the expression to see its schedule.
        </p>
      )}

      {valid && timezone === null && (
        <p className="text-sm text-zinc-500">Calculating…</p>
      )}

      {valid && timezone !== null && runs.length === 0 && (
        <p className="text-sm text-zinc-500">
          No upcoming runs found in the next few years.
        </p>
      )}

      {valid && timezone !== null && runs.length > 0 && (
        <ol className="flex flex-col gap-1.5">
          {runs.map((run) => (
            <li
              key={run.toISOString()}
              className="font-mono text-sm text-zinc-300"
            >
              {formatRun(run)}
            </li>
          ))}
        </ol>
      )}

      {timezone !== null && (
        <p className="mt-4 text-xs text-zinc-500">Previewed in {timezone}</p>
      )}
    </div>
  );
}
