import { brand } from "@/lib/brand";
import type { FindingSeverity } from "@/metalens/lib/types";
import {
  CircleAlert,
  CircleCheck,
  Info,
  type LucideIcon,
  TriangleAlert,
  XCircle,
} from "lucide-react";

const SEVERITY_CONFIG: Record<
  FindingSeverity,
  { label: string; icon: LucideIcon; color: string }
> = {
  success: { label: "OK", icon: CircleCheck, color: brand.colors.green[500] },
  warning: {
    label: "Check",
    icon: CircleAlert,
    color: brand.colors.functional.warning,
  },
  missing: {
    label: "Missing",
    icon: XCircle,
    color: brand.colors.functional.danger,
  },
  invalid: {
    label: "Invalid",
    icon: TriangleAlert,
    color: brand.colors.functional.danger,
  },
  info: { label: "Info", icon: Info, color: brand.colors.blue[400] },
};

export function FindingBadge({ severity }: { severity: FindingSeverity }) {
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
      style={{ background: `${config.color}18`, color: config.color }}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}
