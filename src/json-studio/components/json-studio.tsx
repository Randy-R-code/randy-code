"use client";

import { JsonActions } from "@/json-studio/components/json-actions";
import { JsonEditor } from "@/json-studio/components/json-editor";
import { JsonStatsBar } from "@/json-studio/components/json-stats";
import { JsonStatus } from "@/json-studio/components/json-status";
import { JsonTree } from "@/json-studio/components/json-tree";
import { copyToClipboard } from "@/json-studio/lib/clipboard";
import { downloadJson } from "@/json-studio/lib/download";
import { formatJson, minifyJson } from "@/json-studio/lib/format";
import { parseJson } from "@/json-studio/lib/parse";
import { SAMPLE_JSON } from "@/json-studio/lib/sample";
import { computeStats } from "@/json-studio/lib/stats";
import { useStoredContent } from "@/json-studio/lib/storage";
import { brand } from "@/lib/brand";
import { useEffect, useMemo, useRef, useState } from "react";

function isJsonFile(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith(".json") ||
    file.type === "application/json"
  );
}

export function JsonStudio() {
  const [content, setContent] = useStoredContent();
  const [fileName, setFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [justValidated, setJustValidated] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const validateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (validateTimeoutRef.current) clearTimeout(validateTimeoutRef.current);
    };
  }, []);

  const trimmed = content.trim();
  const parseResult = useMemo(
    () => (trimmed === "" ? null : parseJson(content)),
    [content, trimmed],
  );
  const status: "empty" | "valid" | "invalid" =
    trimmed === "" ? "empty" : parseResult?.success ? "valid" : "invalid";
  const stats = useMemo(
    () =>
      parseResult?.success ? computeStats(parseResult.value, content) : null,
    [parseResult, content],
  );

  function loadFile(file: File) {
    if (!isJsonFile(file)) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setContent(text);
      setFileName(file.name);
    };
    reader.readAsText(file);
  }

  function handleFormat() {
    if (!parseResult?.success) return;
    setContent(formatJson(parseResult.value));
    editorRef.current?.focus();
  }

  function handleMinify() {
    if (!parseResult?.success) return;
    setContent(minifyJson(parseResult.value));
    editorRef.current?.focus();
  }

  function handleValidate() {
    setJustValidated(true);
    if (validateTimeoutRef.current) clearTimeout(validateTimeoutRef.current);
    validateTimeoutRef.current = setTimeout(() => setJustValidated(false), 900);
  }

  async function handleCopy() {
    const ok = await copyToClipboard(content);
    if (!ok) return;
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }

  function handleClear() {
    setContent("");
    setFileName(null);
    editorRef.current?.focus();
  }

  function handleLoadExample() {
    setContent(SAMPLE_JSON);
    setFileName(null);
    editorRef.current?.focus();
  }

  function handleDownload() {
    if (!parseResult?.success) return;
    downloadJson(formatJson(parseResult.value), fileName ?? "data.json");
  }

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:gap-6">
        <div className="flex flex-col gap-4 lg:gap-6">
          <JsonEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            onDropFile={loadFile}
            onFormatShortcut={handleFormat}
          />

          <JsonActions
            onFormat={handleFormat}
            onMinify={handleMinify}
            onValidate={handleValidate}
            onCopy={handleCopy}
            onClear={handleClear}
            onLoadExample={handleLoadExample}
            onOpenFile={loadFile}
            onDownload={handleDownload}
            copied={copied}
            canFormat={status === "valid"}
            canDownload={status === "valid"}
            canCopy={trimmed !== ""}
            canClear={content !== ""}
          />

          <div className="flex flex-wrap items-center gap-3">
            <JsonStatus
              status={status}
              error={
                parseResult && !parseResult.success ? parseResult.error : null
              }
              pulse={justValidated}
            />
            {stats && <JsonStatsBar stats={stats} />}
          </div>

          <p className="text-xs text-zinc-400">
            Processed locally in your browser — JSON content never leaves your
            device.
          </p>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{
            borderColor: `${brand.colors.green[500]}18`,
            background: brand.colors.surface[2],
          }}
        >
          <h2 className="mb-3 text-xs font-medium text-zinc-400">Structure</h2>
          {parseResult?.success ? (
            <JsonTree status="valid" value={parseResult.value} />
          ) : (
            <JsonTree status={status === "invalid" ? "invalid" : "empty"} />
          )}
        </div>
      </div>
    </div>
  );
}
