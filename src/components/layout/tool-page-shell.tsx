import { ToolBackLink } from "@/components/layout/tool-back-link";

/**
 * Shared chrome for every tool under /tools (InfraLens, Cron Builder, ...):
 * an opaque background — hides the homepage's decorative grid/glow — and a
 * "back to tools" link, both at the tool family's canonical max-w-5xl,
 * matching the portfolio's PageShell so the link sits in the same spot.
 * Tool pages compose their own content as children; this only owns the shell.
 *
 * Also carries `.tool-accent-scope` (globals.css) — the whole tool family
 * shares InfraLens's green identity (`--primary`/`--ring`) rather than the
 * portfolio's blue, so any shared shadcn primitive (Input, Button, Tabs, ...)
 * used inside a tool page renders its focus ring/primary color in green
 * without each tool having to hand-roll its own override.
 */
export function ToolPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="tool-accent-scope">
      <div className="bg-background px-6 pt-8">
        <div className="mx-auto max-w-5xl">
          <ToolBackLink />
        </div>
      </div>
      {children}
    </div>
  );
}
