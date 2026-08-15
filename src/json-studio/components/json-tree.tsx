"use client";

import { JsonTreeNode } from "@/json-studio/components/json-tree-node";
import type { JsonValue } from "@/json-studio/lib/types";
import { brand } from "@/lib/brand";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { useState } from "react";

type JsonTreeProps =
  | { status: "empty" | "invalid" }
  | { status: "valid"; value: JsonValue };

function isContainer(
  value: JsonValue,
): value is Record<string, JsonValue> | JsonValue[] {
  return value !== null && typeof value === "object";
}

export function JsonTree(props: JsonTreeProps) {
  const [signal, setSignal] = useState<{
    mode: "expand" | "collapse";
    epoch: number;
  } | null>(null);

  if (props.status !== "valid") {
    return (
      <p className="text-sm text-zinc-400">
        {props.status === "invalid"
          ? "Fix the JSON syntax to explore its structure."
          : "Your JSON structure will appear here."}
      </p>
    );
  }

  const { value } = props;
  const canExpandCollapse = isContainer(value);

  return (
    <div>
      {canExpandCollapse && (
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setSignal((s) => ({ mode: "expand", epoch: (s?.epoch ?? 0) + 1 }))
            }
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200"
            style={{ background: brand.colors.surface[3] }}
          >
            <ChevronsDown size={12} />
            Expand all
          </button>
          <button
            type="button"
            onClick={() =>
              setSignal((s) => ({
                mode: "collapse",
                epoch: (s?.epoch ?? 0) + 1,
              }))
            }
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200"
            style={{ background: brand.colors.surface[3] }}
          >
            <ChevronsUp size={12} />
            Collapse all
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <JsonTreeNode
          key={signal ? `${signal.mode}-${signal.epoch}` : "initial"}
          keyLabel={null}
          value={value}
          depth={0}
          forceExpanded={signal ? signal.mode === "expand" : undefined}
        />
      </div>
    </div>
  );
}
