"use client";

import type { JsonArray, JsonObject, JsonValue } from "@/json-studio/lib/types";
import { brand } from "@/lib/brand";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

function isContainer(value: JsonValue): value is JsonObject | JsonArray {
  return value !== null && typeof value === "object";
}

function typeColor(value: JsonValue): string {
  if (value === null) return "#A9B8C7";
  switch (typeof value) {
    case "string":
      return brand.colors.green[400];
    case "number":
      return brand.colors.blue[400];
    case "boolean":
      return brand.colors.functional.warning;
    default:
      return "#A9B8C7";
  }
}

function primitiveText(value: JsonValue): string {
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

interface JsonTreeNodeProps {
  keyLabel: string | number | null;
  value: JsonValue;
  depth: number;
  forceExpanded?: boolean;
}

export function JsonTreeNode({
  keyLabel,
  value,
  depth,
  forceExpanded,
}: JsonTreeNodeProps) {
  const container = isContainer(value);
  const entries: [string | number, JsonValue][] = !container
    ? []
    : Array.isArray(value)
      ? value.map((v, i) => [i, v])
      : Object.entries(value);

  const [expanded, setExpanded] = useState(() => forceExpanded ?? depth < 2);

  const keyNode =
    keyLabel === null ? null : typeof keyLabel === "number" ? (
      <span className="text-zinc-400">[{keyLabel}]</span>
    ) : (
      <span style={{ color: brand.colors.text.secondary }}>
        &quot;{keyLabel}&quot;
      </span>
    );

  if (!container || entries.length === 0) {
    const emptyBracket = container
      ? Array.isArray(value)
        ? "[]"
        : "{}"
      : null;
    return (
      <div
        className="flex items-start gap-1.5 py-0.5 font-mono text-xs"
        style={{ paddingLeft: depth * 16 }}
      >
        {keyNode && (
          <>
            {keyNode}
            <span className="text-zinc-400">:</span>
          </>
        )}
        <span
          className={`min-w-0 break-all ${emptyBracket ? "text-zinc-400" : ""}`}
          style={emptyBracket ? undefined : { color: typeColor(value) }}
        >
          {emptyBracket ?? primitiveText(value)}
        </span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const count = entries.length;
  const summary = `${count} ${isArray ? (count === 1 ? "item" : "items") : count === 1 ? "key" : "keys"}`;

  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-0.5 font-mono text-xs"
        style={{ paddingLeft: depth * 16 }}
      >
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${
            keyLabel === null ? "root" : String(keyLabel)
          }`}
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-zinc-400 hover:text-zinc-200"
        >
          <ChevronRight
            size={12}
            className="transition-transform"
            style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </button>
        {keyNode && (
          <>
            {keyNode}
            <span className="text-zinc-400">:</span>
          </>
        )}
        <span className="text-zinc-400">{isArray ? "[" : "{"}</span>
        {!expanded && (
          <>
            <span className="text-zinc-400">{summary}</span>
            <span className="text-zinc-400">{isArray ? "]" : "}"}</span>
          </>
        )}
      </div>

      {expanded && (
        <div role="group">
          {entries.map(([k, v]) => (
            <JsonTreeNode
              key={k}
              keyLabel={k}
              value={v}
              depth={depth + 1}
              forceExpanded={forceExpanded}
            />
          ))}
          <div
            className="font-mono text-xs text-zinc-400"
            style={{ paddingLeft: depth * 16 }}
          >
            {isArray ? "]" : "}"}
          </div>
        </div>
      )}
    </div>
  );
}
