import { brand } from "@/lib/brand";

export function statusColor(status: number): string {
  if (status >= 500) return brand.colors.functional.danger;
  if (status >= 400) return brand.colors.functional.warning;
  if (status >= 300) return brand.colors.functional.info;
  return brand.colors.functional.success;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function StatusLine({
  status,
  statusText,
  durationMs,
  sizeBytes,
}: {
  status: number;
  statusText: string;
  durationMs: number;
  sizeBytes: number;
}) {
  const color = statusColor(status);

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <span
        className="rounded-md px-2 py-0.5 font-mono font-semibold"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {status} {statusText}
      </span>
      <span className="text-zinc-400">·</span>
      <span className="text-zinc-400">{durationMs} ms</span>
      <span className="text-zinc-400">·</span>
      <span className="text-zinc-400">{formatBytes(sizeBytes)}</span>
    </div>
  );
}
