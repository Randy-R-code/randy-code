"use client";

import type { KeyValueRow } from "@/api-studio/lib/serialize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface KeyValueEditorProps {
  rows: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel: string;
}

/** Shared enable/disable key-value row editor used by both the Params and Headers tabs. */
export function KeyValueEditor({
  rows,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  addLabel,
}: KeyValueEditorProps) {
  function updateRow(id: string, patch: Partial<KeyValueRow>) {
    onChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeRow(id: string) {
    onChange(rows.filter((row) => row.id !== id));
  }

  function addRow() {
    onChange([
      ...rows,
      { id: crypto.randomUUID(), key: "", value: "", enabled: true },
    ]);
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.length === 0 && (
        <p className="py-2 text-sm text-zinc-400">None yet.</p>
      )}
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={row.enabled}
            onChange={(event) =>
              updateRow(row.id, { enabled: event.target.checked })
            }
            aria-label={row.key ? `Enable ${row.key}` : "Enable row"}
            className="size-4 shrink-0 accent-brand-accent"
          />
          <Input
            value={row.key}
            onChange={(event) => updateRow(row.id, { key: event.target.value })}
            placeholder={keyPlaceholder}
            aria-label={keyPlaceholder}
            className="flex-1"
          />
          <Input
            value={row.value}
            onChange={(event) =>
              updateRow(row.id, { value: event.target.value })
            }
            placeholder={valuePlaceholder}
            aria-label={valuePlaceholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeRow(row.id)}
            aria-label={row.key ? `Remove ${row.key}` : "Remove row"}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        className="self-start"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}
