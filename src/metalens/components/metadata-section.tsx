import { brand } from "@/lib/brand";
import type { ReactNode } from "react";

export function MetadataSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="rounded-xl border p-5"
      style={{
        borderColor: `${brand.colors.green[500]}18`,
        background: brand.colors.surface[2],
      }}
    >
      <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-white/5">{children}</div>
    </section>
  );
}
