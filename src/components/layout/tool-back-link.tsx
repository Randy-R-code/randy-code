import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ToolBackLink() {
  return (
    <Link
      href="/tools"
      className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
    >
      <ArrowLeft size={12} />
      Retour aux outils
    </Link>
  );
}
