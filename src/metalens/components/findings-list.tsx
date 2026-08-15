import type { MetadataFinding } from "@/metalens/lib/types";
import { FindingBadge } from "./finding-badge";

export function FindingsList({ findings }: { findings: MetadataFinding[] }) {
  if (findings.length === 0) {
    return <p className="text-sm text-zinc-400">No notable issues found.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {findings.map((finding) => (
        <li key={finding.id} className="flex items-start gap-3">
          <FindingBadge severity={finding.severity} />
          <div className="min-w-0">
            <p className="text-sm text-white">{finding.title}</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              {finding.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
