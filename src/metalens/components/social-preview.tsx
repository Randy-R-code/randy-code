"use client";

import { brand } from "@/lib/brand";
import { isSafeExternalUrl } from "@/metalens/lib/resolve-urls";
import type { SocialPreviewData } from "@/metalens/lib/types";
import { useState } from "react";

export function SocialPreview({ data }: { data: SocialPreviewData }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(
    data.image && isSafeExternalUrl(data.image) && !imageFailed,
  );

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        borderColor: `${brand.colors.green[500]}18`,
        background: brand.colors.surface[2],
      }}
    >
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Social preview
      </h2>
      <div
        className="overflow-hidden rounded-lg border"
        style={{
          borderColor: brand.colors.border.subtle,
          background: brand.colors.surface[1],
        }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote, unknown-host images are deliberately not routed through next/image (spec §53) to avoid widening the site-wide remote-image allowlist for arbitrary analyzed hosts.
          <img
            src={data.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="aspect-[1.91/1] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[1.91/1] w-full items-center justify-center text-xs text-zinc-400">
            No image
          </div>
        )}
        <div className="p-3">
          <p className="truncate text-xs uppercase text-zinc-400">
            {data.hostname}
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-white">
            {data.title ?? "Untitled page"}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
            {data.description ?? "No description available."}
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        {data.usesFallback
          ? "Reconstructed from Open Graph metadata — indicative only and may differ across platforms."
          : "Indicative only and may differ across platforms."}
      </p>
    </div>
  );
}
