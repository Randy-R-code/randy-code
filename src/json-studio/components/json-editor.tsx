"use client";

import { brand } from "@/lib/brand";
import { forwardRef, useState } from "react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onDropFile: (file: File) => void;
  onFormatShortcut: () => void;
}

export const JsonEditor = forwardRef<HTMLTextAreaElement, JsonEditorProps>(
  function JsonEditor({ value, onChange, onDropFile, onFormatShortcut }, ref) {
    const [dragging, setDragging] = useState(false);

    function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files.item(0);
      if (file) onDropFile(file);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      const isFormatShortcut =
        (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "f";
      if (isFormatShortcut) {
        e.preventDefault();
        onFormatShortcut();
      }
    }

    return (
      <div>
        <label
          htmlFor="json-studio-editor"
          className="mb-2 block text-xs font-medium text-zinc-400"
        >
          JSON input
        </label>
        <textarea
          ref={ref}
          id="json-studio-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your JSON here..."
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          className="min-h-105 w-full resize-y rounded-lg border px-3 py-2.5 font-mono text-sm text-white focus:outline-none focus:ring-1 lg:min-h-140"
          style={
            {
              background: brand.colors.surface[1],
              borderColor: dragging
                ? brand.colors.green[500]
                : `${brand.colors.green[500]}30`,
              "--tw-ring-color": `${brand.colors.green[500]}60`,
            } as React.CSSProperties
          }
        />
      </div>
    );
  },
);
