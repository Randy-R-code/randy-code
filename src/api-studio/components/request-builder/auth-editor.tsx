"use client";

import type { AuthConfig } from "@/api-studio/lib/auth";
import { Input } from "@/components/ui/input";

const OPTIONS: { value: AuthConfig["type"]; label: string }[] = [
  { value: "none", label: "None" },
  { value: "bearer", label: "Bearer Token" },
  { value: "basic", label: "Basic Auth" },
];

export function AuthEditor({
  auth,
  onChange,
}: {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        role="radiogroup"
        aria-label="Authentication type"
        className="flex flex-wrap gap-2"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={auth.type === option.value}
            onClick={() => {
              if (option.value === "none") onChange({ type: "none" });
              else if (option.value === "bearer")
                onChange({ type: "bearer", token: "" });
              else onChange({ type: "basic", username: "", password: "" });
            }}
            className={
              auth.type === option.value
                ? "rounded-md border border-brand-accent/40 bg-brand-accent/10 px-3 py-1.5 text-sm font-medium text-brand-accent-hover"
                : "rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      {auth.type === "bearer" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-token" className="text-xs text-zinc-400">
            Token
          </label>
          <Input
            id="auth-token"
            value={auth.token}
            onChange={(event) =>
              onChange({ type: "bearer", token: event.target.value })
            }
            placeholder="your-token-here"
            autoComplete="off"
          />
        </div>
      )}

      {auth.type === "basic" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-username" className="text-xs text-zinc-400">
              Username
            </label>
            <Input
              id="auth-username"
              value={auth.username}
              onChange={(event) =>
                onChange({ ...auth, username: event.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="text-xs text-zinc-400">
              Password
            </label>
            <Input
              id="auth-password"
              type="password"
              value={auth.password}
              onChange={(event) =>
                onChange({ ...auth, password: event.target.value })
              }
              autoComplete="off"
            />
          </div>
        </div>
      )}
    </div>
  );
}
