"use client";

import { brand } from "@/lib/brand";
import { analyzeMetadata } from "@app/tools/metalens/actions/analyze-metadata";
import { useState } from "react";
import type { MetadataAnalysis } from "../lib/types";
import { AnalysisSummary } from "./analysis-summary";
import { FindingsList } from "./findings-list";
import { MetadataRow } from "./metadata-row";
import { MetadataSection } from "./metadata-section";
import { MetaLensForm } from "./metalens-form";
import { SearchPreview } from "./search-preview";
import { SocialPreview } from "./social-preview";

type State =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "error"; message: string }
  | { status: "success"; data: MetadataAnalysis };

export function MetaLens() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function handleAnalyze(url: string) {
    setState({ status: "pending" });
    const result = await analyzeMetadata(url);
    setState(
      result.ok
        ? { status: "success", data: result.data }
        : { status: "error", message: result.message },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <MetaLensForm
          onAnalyze={handleAnalyze}
          pending={state.status === "pending"}
        />
        <p className="mt-2 text-xs text-zinc-400">
          Public pages only. URLs are analyzed on demand and are not stored.
        </p>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {state.status === "pending" && "Analyzing metadata…"}
        {state.status === "error" && state.message}
        {state.status === "success" && "Analysis complete."}
      </div>

      {state.status === "error" && (
        <div
          className="rounded-lg border p-4 text-sm"
          style={{
            borderColor: `${brand.colors.functional.danger}40`,
            background: `${brand.colors.functional.danger}10`,
            color: brand.colors.functional.danger,
          }}
        >
          {state.message}
        </div>
      )}

      {state.status === "pending" && (
        <p className="text-sm text-zinc-400">Analyzing metadata…</p>
      )}

      {state.status === "idle" && (
        <p className="text-sm text-zinc-400">
          Enter a public URL to inspect its metadata.
        </p>
      )}

      {state.status === "success" && <MetaLensResults analysis={state.data} />}
    </div>
  );
}

function MetaLensResults({ analysis }: { analysis: MetadataAnalysis }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <AnalysisSummary analysis={analysis} />

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <SearchPreview data={analysis.previews.search} />
        <SocialPreview data={analysis.previews.social} />
      </div>

      <MetadataSection title="Main metadata">
        <MetadataRow label="Title" value={analysis.page.title} />
        <MetadataRow
          label="Meta description"
          value={analysis.page.description}
        />
        <MetadataRow label="Viewport" value={analysis.page.viewport} />
        <MetadataRow label="Document language" value={analysis.page.lang} />
      </MetadataSection>

      <MetadataSection title="Open Graph">
        <MetadataRow label="Title" value={analysis.openGraph.title} />
        <MetadataRow
          label="Description"
          value={analysis.openGraph.description}
        />
        <MetadataRow
          label="Image"
          value={analysis.openGraph.image}
          isUrl
          hint={
            analysis.openGraph.imageCount > 1
              ? `${analysis.openGraph.imageCount} images declared — first one shown`
              : undefined
          }
        />
        <MetadataRow label="URL" value={analysis.openGraph.url} isUrl />
        <MetadataRow label="Type" value={analysis.openGraph.type} />
        <MetadataRow label="Site name" value={analysis.openGraph.siteName} />
      </MetadataSection>

      <MetadataSection title="Twitter / X">
        <MetadataRow label="Card" value={analysis.twitter.card} />
        <MetadataRow label="Title" value={analysis.twitter.title} />
        <MetadataRow label="Description" value={analysis.twitter.description} />
        <MetadataRow label="Image" value={analysis.twitter.image} isUrl />
        <MetadataRow label="Site" value={analysis.twitter.site} />
        <MetadataRow label="Creator" value={analysis.twitter.creator} />
      </MetadataSection>

      <MetadataSection title="Indexing">
        <MetadataRow label="Canonical" value={analysis.page.canonical} isUrl />
        <MetadataRow
          label="Robots"
          value={
            analysis.page.robots.length > 0
              ? analysis.page.robots.join(", ")
              : undefined
          }
        />
      </MetadataSection>

      {analysis.hreflang.length > 0 && (
        <MetadataSection title="Languages">
          {analysis.hreflang.map((entry, index) => (
            <MetadataRow
              key={`${entry.language}-${index}`}
              label={entry.language}
              value={entry.url}
              isUrl
            />
          ))}
        </MetadataSection>
      )}

      <MetadataSection title="Icons & manifest">
        {analysis.icons.length === 0 && !analysis.manifest ? (
          <p className="py-2.5 text-sm text-zinc-400">
            No icons or manifest declared.
          </p>
        ) : (
          <>
            {analysis.icons.map((icon, index) => (
              <MetadataRow
                key={`${icon.rel}-${index}`}
                label={icon.sizes ? `${icon.rel} (${icon.sizes})` : icon.rel}
                value={icon.url}
                isUrl
              />
            ))}
            {analysis.manifest && (
              <MetadataRow label="Manifest" value={analysis.manifest} isUrl />
            )}
          </>
        )}
      </MetadataSection>

      <MetadataSection title="Checks">
        <div className="py-2.5">
          <FindingsList findings={analysis.findings} />
        </div>
      </MetadataSection>
    </div>
  );
}
