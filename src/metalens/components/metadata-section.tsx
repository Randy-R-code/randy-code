import type { ReactNode } from "react";

export function MetadataSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card/50 p-5">
      <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-white/5">{children}</div>
    </section>
  );
}
