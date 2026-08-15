import type { JsonParseError } from "@/json-studio/lib/types";
import { brand } from "@/lib/brand";
import { Circle, CircleAlert, CircleCheck } from "lucide-react";

type JsonStatusKind = "empty" | "valid" | "invalid";

interface JsonStatusProps {
  status: JsonStatusKind;
  error: JsonParseError | null;
  pulse: boolean;
}

const STATUS_CONFIG = {
  empty: { icon: Circle, label: "Ready", color: "#A9B8C7" },
  valid: {
    icon: CircleCheck,
    label: "Valid JSON",
    color: brand.colors.green[500],
  },
  invalid: {
    icon: CircleAlert,
    label: "Invalid JSON",
    color: brand.colors.functional.danger,
  },
} as const;

export function JsonStatus({ status, error, pulse }: JsonStatusProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div>
      <div
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
        style={{
          background: `${config.color}18`,
          color: config.color,
          boxShadow: pulse ? `0 0 0 2px ${config.color}60` : undefined,
        }}
      >
        <Icon size={13} />
        {config.label}
      </div>

      {status === "invalid" && error && (
        <p className="mt-2 text-xs text-red-400">
          {error.message}
          {error.line !== undefined && error.column !== undefined && (
            <span className="text-zinc-400">
              {" "}
              — Line {error.line}, column {error.column}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
