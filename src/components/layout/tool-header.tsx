import type { LucideIcon } from "lucide-react";

interface ToolHeaderProps {
  icon: LucideIcon;
  label: string;
  title: string;
  tagline: string;
  color: string;
}

/**
 * Header for tools that don't have InfraLens's bespoke standalone-era hero
 * (Cron Builder, and future lightweight tools): icon, category label, title,
 * tagline. Static — no entrance animation, matching a utility tool's tone
 * and avoiding a transient low-opacity state during automated a11y scans.
 */
export function ToolHeader({
  icon: Icon,
  label,
  title,
  tagline,
  color,
}: ToolHeaderProps) {
  return (
    <header className="pt-6 pb-8">
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color }}
        >
          {label}
        </span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-base text-zinc-400">{tagline}</p>
    </header>
  );
}
