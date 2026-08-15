import { ToolBackLink } from "@/components/layout/tool-back-link";

/**
 * Shared chrome for every tool under /tools (InfraLens, Cron Builder, ...):
 * an opaque background — hides the homepage's decorative grid/glow — and a
 * "back to tools" link, both at the tool family's canonical max-w-4xl. Tool
 * pages compose their own content as children; this only owns the shell.
 */
export function ToolPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-background px-6 pt-4 sm:px-8 md:px-12">
        <div className="mx-auto max-w-4xl">
          <ToolBackLink />
        </div>
      </div>
      {children}
    </>
  );
}
