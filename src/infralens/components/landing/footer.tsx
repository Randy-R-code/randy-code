import { GitHubIcon } from "@infralens-components/github-icon";
import { Badge } from "@infralens-components/ui/badge";
import { siteConfig } from "@infralens-config/site-config";
import { BookOpen, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 py-6 md:py-8 px-6 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/infralens/brand/logo-horizontal.png"
              alt={siteConfig.name}
              className="h-14 w-auto"
            />
            <p className="text-sm text-zinc-400 text-center md:text-left">
              Website inspection tool for developers
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 text-sm text-zinc-400">
            <Link
              href="/tools/infralens/docs"
              className="inline-flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <BookOpen size={14} />
              Documentation
            </Link>
            <Link
              href={siteConfig.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <GitHubIcon size={14} />
              GitHub
            </Link>
            <Link
              href={siteConfig.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <Scale size={14} />
              License
            </Link>
            <Link
              href="/tools/infralens/privacy"
              className="inline-flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <ShieldCheck size={14} />
              Privacy
            </Link>
            <Badge variant="outline" className="border-zinc-800">
              Open source
            </Badge>
          </div>
        </div>
        {/* Randy Code attribution — master plan §28.1: "InfraLens" then,
            subtly, "An open-source tool by Randy Code". */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs text-zinc-400">
            © {year} {siteConfig.name} · MIT licensed
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-zinc-400">
              An open-source tool by
            </span>
            <Link
              href={siteConfig.parentBrandUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.parentBrand}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/infralens/brand/logo-rcode-horizontal.png"
                alt={siteConfig.parentBrand}
                className="h-4 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Giant faint wordmark watermark, same technique as randy-code's own
          footer (site-footer.tsx): full width, ~6% opacity, masked to fade
          out toward the bottom edge. */}
      <div
        aria-hidden="true"
        className="w-full overflow-hidden pt-10 pb-6"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/infralens/brand/wordmark-horizontal.png"
          alt=""
          className="w-full opacity-[0.06]"
        />
      </div>
    </footer>
  );
}
