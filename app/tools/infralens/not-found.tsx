import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Wordmark — text only. Was a raster logo, but Next.js preloads any
            static asset referenced in a not-found.tsx across every page in
            the segment (ready for an instant error boundary render), so
            that logo was silently preloaded on every single InfraLens page
            and never used. Not worth chasing a workaround for a page this
            rarely seen. */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-lg font-bold text-muted-foreground tracking-wide">
            InfraLens
          </span>
        </div>

        {/* 404 */}
        <div className="space-y-2">
          <p className="text-8xl font-black tracking-tight text-foreground/10 select-none">
            404
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This URL doesn&apos;t resolve to anything here.
            <br />
            Maybe you were looking for a website to inspect?
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-brand-secondary/40 mx-auto" />

        {/* CTA */}
        <Link
          href="/tools/infralens"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-secondary/40 bg-brand-secondary/10 hover:bg-brand-secondary/20 text-brand-secondary-hover text-sm font-semibold transition-colors"
        >
          Back to InfraLens
        </Link>
      </div>
    </main>
  );
}
