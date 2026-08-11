"use client";

import { Button } from "@infralens-components/ui/button";
import { Card, CardContent } from "@infralens-components/ui/card";
import { InfraLensExport } from "@infralens-lib/checks/export";
import { downloadTextFile } from "@infralens-lib/checks/export-markdown";
import { isValidExport } from "@infralens-lib/checks/validate-export";
import { CheckTransition, compareExports } from "@infralens-lib/compare/diff";
import { buildComparisonMarkdown } from "@infralens-lib/compare/export-markdown";
import {
  CircleCheckBig,
  FileJson,
  FileText,
  Minus,
  Plus,
  RefreshCw,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

type SlotState =
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "loaded"; data: InfraLensExport; fileName: string };

const GRADE_COLOR: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-lime-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  E: "text-red-400",
};

async function readExportFile(file: File): Promise<SlotState> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { status: "error", message: "Couldn't read this file." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { status: "error", message: "This file isn't valid JSON." };
  }

  if (!isValidExport(parsed)) {
    return {
      status: "error",
      message:
        "This doesn't look like an InfraLens JSON export — check you picked the right file.",
    };
  }

  return { status: "loaded", data: parsed, fileName: file.name };
}

function ReportSlot({
  label,
  slot,
  onChange,
}: {
  label: string;
  slot: SlotState;
  onChange: (next: SlotState) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    onChange(await readExportFile(file));
  };

  if (slot.status === "loaded") {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {label}
            </p>
            <button
              type="button"
              onClick={() => onChange({ status: "empty" })}
              aria-label={`Remove ${label}`}
              className="text-zinc-500 hover:text-red-400 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="font-semibold text-zinc-100 truncate">
            {slot.data.url}
          </p>
          <p className="text-xs text-zinc-400 truncate">{slot.fileName}</p>
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`text-lg font-bold ${GRADE_COLOR[slot.data.grade] ?? "text-zinc-300"}`}
            >
              {slot.data.grade}
            </span>
            <span className="text-sm text-zinc-400">{slot.data.score}/100</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
        {label}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFile(e.dataTransfer.files[0]);
        }}
        className={`w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? "border-brand-secondary/60 bg-brand-secondary/10"
            : "border-zinc-800 hover:border-zinc-700"
        }`}
      >
        <Upload className="size-5 text-zinc-500" />
        <span className="text-sm text-zinc-400">
          Drop a JSON export, or click to browse
        </span>
        {slot.status === "error" && (
          <span className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
            <TriangleAlert className="size-3.5 shrink-0" />
            {slot.message}
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

const KIND_CONFIG: Record<
  Exclude<CheckTransition["kind"], "unchanged">,
  { title: string; icon: typeof CircleCheckBig; className: string }
> = {
  improved: {
    title: "Improvements",
    icon: CircleCheckBig,
    className: "text-emerald-500",
  },
  regressed: {
    title: "Regressions",
    icon: TriangleAlert,
    className: "text-red-400",
  },
  changed: {
    title: "Other changes",
    icon: RefreshCw,
    className: "text-zinc-400",
  },
  added: {
    title: "New in B",
    icon: Plus,
    className: "text-brand-secondary-hover",
  },
  removed: { title: "No longer in B", icon: Minus, className: "text-zinc-400" },
};

function TransitionSection({
  kind,
  items,
}: {
  kind: Exclude<CheckTransition["kind"], "unchanged">;
  items: CheckTransition[];
}) {
  if (items.length === 0) return null;
  const { title, icon: Icon, className } = KIND_CONFIG[kind];

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {title} ({items.length})
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2 text-sm text-zinc-300 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2"
          >
            <Icon className={`size-4 shrink-0 mt-0.5 ${className}`} />
            <span>
              {item.label}
              <span className="text-zinc-500">
                {" "}
                — {item.before ?? "—"} → {item.after ?? "—"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CompareClient() {
  const [a, setA] = useState<SlotState>({ status: "empty" });
  const [b, setB] = useState<SlotState>({ status: "empty" });

  const bothLoaded = a.status === "loaded" && b.status === "loaded";
  const outcome =
    a.status === "loaded" && b.status === "loaded"
      ? compareExports(a.data, b.data)
      : null;

  const handleExport = () => {
    if (
      a.status !== "loaded" ||
      b.status !== "loaded" ||
      !outcome?.compatible
    ) {
      return;
    }
    const markdown = buildComparisonMarkdown(a.data, b.data, outcome.result);
    downloadTextFile(markdown, "infralens-comparison.md", "text/markdown");
  };

  const reset = () => {
    setA({ status: "empty" });
    setB({ status: "empty" });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <ReportSlot label="Report A" slot={a} onChange={setA} />
        <ReportSlot label="Report B" slot={b} onChange={setB} />
      </div>

      {bothLoaded && outcome && !outcome.compatible && (
        <Card className="border-amber-900/50 bg-amber-950/20">
          <CardContent className="p-4 flex items-start gap-2 text-sm text-amber-300">
            <TriangleAlert className="size-4 shrink-0 mt-0.5" />
            {outcome.reason}
          </CardContent>
        </Card>
      )}

      {bothLoaded && outcome?.compatible && (
        <div className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <div className="text-center">
                  <p
                    className={`text-3xl font-bold ${GRADE_COLOR[outcome.result.gradeBefore] ?? "text-zinc-300"}`}
                  >
                    {outcome.result.gradeBefore}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {outcome.result.scoreBefore}/100
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-lg font-semibold ${
                      outcome.result.scoreDelta > 0
                        ? "text-emerald-400"
                        : outcome.result.scoreDelta < 0
                          ? "text-red-400"
                          : "text-zinc-400"
                    }`}
                  >
                    {outcome.result.scoreDelta >= 0 ? "+" : ""}
                    {outcome.result.scoreDelta}
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-3xl font-bold ${GRADE_COLOR[outcome.result.gradeAfter] ?? "text-zinc-300"}`}
                  >
                    {outcome.result.gradeAfter}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {outcome.result.scoreAfter}/100
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2 border-t border-zinc-800">
                {outcome.result.categories.map((c) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{c.label}</span>
                      <span
                        className={
                          c.delta > 0
                            ? "text-emerald-400"
                            : c.delta < 0
                              ? "text-red-400"
                              : "text-zinc-500"
                        }
                      >
                        {c.delta >= 0 ? "+" : ""}
                        {c.delta}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {c.before}/{c.beforeMax} → {c.after}/{c.afterMax}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <TransitionSection
              kind="improved"
              items={outcome.result.checks.filter((c) => c.kind === "improved")}
            />
            <TransitionSection
              kind="regressed"
              items={outcome.result.checks.filter(
                (c) => c.kind === "regressed",
              )}
            />
            <TransitionSection
              kind="changed"
              items={outcome.result.checks.filter((c) => c.kind === "changed")}
            />
            <TransitionSection
              kind="added"
              items={outcome.result.checks.filter((c) => c.kind === "added")}
            />
            <TransitionSection
              kind="removed"
              items={outcome.result.checks.filter((c) => c.kind === "removed")}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-zinc-800 text-zinc-300 hover:text-zinc-100"
            >
              <FileText className="size-4 mr-2" />
              Export Markdown
            </Button>
            <Button
              variant="outline"
              onClick={reset}
              className="border-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              <RefreshCw className="size-4 mr-2" />
              Compare different reports
            </Button>
          </div>
        </div>
      )}

      {!bothLoaded && (
        <p className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <FileJson className="size-3.5" />
          Export a report as JSON from any InfraLens analysis, then drop two of
          them here.
        </p>
      )}
    </div>
  );
}
