import { CRON_PRESETS } from "@/cron-builder/lib/presets";
import { brand } from "@/lib/brand";

interface CronPresetsProps {
  activeExpression: string;
  onSelect: (expression: string) => void;
}

export function CronPresets({ activeExpression, onSelect }: CronPresetsProps) {
  return (
    <section aria-label="Presets" className="mt-6">
      <h2 className="mb-2 text-xs font-medium text-zinc-400">Presets</h2>
      <div className="flex flex-wrap gap-2">
        {CRON_PRESETS.map((preset) => {
          const active = preset.expression === activeExpression;
          return (
            <button
              key={preset.expression}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(preset.expression)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={
                active
                  ? {
                      background: `${brand.colors.green[500]}20`,
                      color: brand.colors.green[500],
                      border: `1px solid ${brand.colors.green[500]}40`,
                    }
                  : {
                      background: brand.colors.surface[3],
                      color: "#A9B8C7",
                      border: "1px solid transparent",
                    }
              }
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
