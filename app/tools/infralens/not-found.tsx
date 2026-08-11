import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-zinc-100 px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-3 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/infralens/brand/logo-symbol.png"
            alt=""
            className="w-9 h-9"
          />
          <span className="text-lg font-bold text-zinc-400 tracking-wide">
            InfraLens
          </span>
        </div>

        {/* 404 */}
        <div className="space-y-2">
          <p className="text-8xl font-black tracking-tight text-zinc-800 select-none">
            404
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
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
