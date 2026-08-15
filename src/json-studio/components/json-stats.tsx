import { formatBytes } from "@/json-studio/lib/stats";
import type { JsonStats } from "@/json-studio/lib/types";

const ROOT_TYPE_LABELS: Record<JsonStats["rootType"], string> = {
  object: "Object",
  array: "Array",
  string: "String",
  number: "Number",
  boolean: "Boolean",
  null: "Null",
};

export function JsonStatsBar({ stats }: { stats: JsonStats }) {
  const items = [
    ROOT_TYPE_LABELS[stats.rootType],
    stats.properties > 0
      ? `${stats.properties} ${stats.properties === 1 ? "key" : "keys"}`
      : null,
    `Depth ${stats.depth}`,
    formatBytes(stats.bytes),
  ].filter((item): item is string => item !== null);

  return <p className="text-xs text-zinc-400">{items.join(" · ")}</p>;
}
