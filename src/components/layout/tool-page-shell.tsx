import { ToolBackLink } from "@/components/layout/tool-back-link";

/**
 * Shared chrome for every tool under /tools (InfraLens, Cron Builder, ...):
 * an opaque background — hides the homepage's decorative grid/glow — and a
 * "back to tools" link, both at the tool family's canonical max-w-5xl,
 * matching the portfolio's PageShell so the link sits in the same spot.
 * Tool pages compose their own content as children; this only owns the shell.
 */
export function ToolPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-background px-6 pt-8">
        <div className="mx-auto max-w-5xl">
          <ToolBackLink />
        </div>
      </div>
      {children}
    </>
  );
}
