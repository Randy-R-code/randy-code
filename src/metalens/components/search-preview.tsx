import { brand } from "@/lib/brand";
import type { SearchPreviewData } from "@/metalens/lib/types";

export function SearchPreview({ data }: { data: SearchPreviewData }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Search preview
      </h2>
      <div
        className="rounded-lg p-3"
        style={{ background: brand.colors.surface[1] }}
      >
        <p className="truncate text-xs text-zinc-400">{data.hostname}</p>
        <p
          className="mt-0.5 truncate text-base"
          style={{ color: brand.colors.blue[300] }}
        >
          {data.title ?? "Untitled page"}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
          {data.description ?? "No description available."}
        </p>
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        Indicative only — actual search engine rendering may differ.
      </p>
    </div>
  );
}
