"use client";

import { brand } from "@/lib/brand";
import {
  AlignLeft,
  Check,
  Copy,
  Download,
  FileJson,
  FolderOpen,
  Shrink,
  Trash2,
} from "lucide-react";
import { useRef, type ChangeEvent } from "react";

interface JsonActionsProps {
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onClear: () => void;
  onLoadExample: () => void;
  onOpenFile: (file: File) => void;
  onDownload: () => void;
  copied: boolean;
  canFormat: boolean;
  canDownload: boolean;
  canCopy: boolean;
  canClear: boolean;
}

function primaryStyle(): React.CSSProperties {
  return {
    background: `${brand.colors.green[500]}20`,
    color: brand.colors.green[500],
  };
}

function secondaryStyle(): React.CSSProperties {
  return {
    background: brand.colors.surface[3],
    color: "#A9B8C7",
  };
}

const buttonClass =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export function JsonActions({
  onFormat,
  onMinify,
  onCopy,
  onClear,
  onLoadExample,
  onOpenFile,
  onDownload,
  copied,
  canFormat,
  canDownload,
  canCopy,
  canClear,
}: JsonActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onOpenFile(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onFormat}
        disabled={!canFormat}
        title="Format (Ctrl/Cmd+Shift+F)"
        className={buttonClass}
        style={primaryStyle()}
      >
        <AlignLeft size={14} />
        Format
      </button>
      <button
        type="button"
        onClick={onMinify}
        disabled={!canFormat}
        className={buttonClass}
        style={secondaryStyle()}
      >
        <Shrink size={14} />
        Minify
      </button>
      <button
        type="button"
        onClick={onCopy}
        disabled={!canCopy}
        className={buttonClass}
        style={secondaryStyle()}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </button>

      <span
        aria-hidden="true"
        className="mx-1 h-5 w-px"
        style={{ background: brand.colors.border.default }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={buttonClass}
        style={secondaryStyle()}
      >
        <FolderOpen size={14} />
        Open file
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        aria-label="Open a JSON file"
        className="sr-only"
      />
      <button
        type="button"
        onClick={onDownload}
        disabled={!canDownload}
        className={buttonClass}
        style={secondaryStyle()}
      >
        <Download size={14} />
        Download
      </button>
      <button
        type="button"
        onClick={onLoadExample}
        className={buttonClass}
        style={secondaryStyle()}
      >
        <FileJson size={14} />
        Load example
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        className={buttonClass}
        style={secondaryStyle()}
      >
        <Trash2 size={14} />
        Clear
      </button>
    </div>
  );
}
