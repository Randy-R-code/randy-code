import { GitHubIcon } from "@/components/github-icon";
import { primaryNav } from "@/lib/nav";
import { tools } from "@/lib/tools";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const exploreNav = primaryNav.filter((item) =>
  ["/projects", "/tools", "/lab"].includes(item.href),
);
const siteNav = primaryNav.filter((item) =>
  ["/articles", "/about", "/contact"].includes(item.href),
);

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <Link href="/">
            <Image
              src="/brand/logo-vertical.png"
              alt="Randy Code"
              width={110}
              height={110}
              className="h-17.5 w-auto"
            />
          </Link>
          <p className="text-xs leading-relaxed text-zinc-400">
            Développeur fullstack TypeScript — sites vitrines, SaaS, apps
            mobiles.
          </p>
          <p className="flex items-center gap-2 text-xs text-zinc-400">
            <span>© {year} Randy Code</span>
            <span aria-hidden="true">·</span>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Confidentialité
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 sm:gap-x-10">
          <nav aria-label="Explorer">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              Explorer
            </p>
            <ul className="flex flex-col gap-2">
              {exploreNav.map((item) => (
                <li key={item.href} className="flex">
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-medium text-zinc-400 transition-colors hover:text-white"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              Site
            </p>
            <ul className="flex flex-col gap-2">
              {siteNav.map((item) => (
                <li key={item.href} className="flex">
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-medium text-zinc-400 transition-colors hover:text-white"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Outils">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              Outils
            </p>
            <ul className="flex flex-col gap-2">
              {tools.map((tool) => (
                <li key={tool.slug} className="flex">
                  <Link
                    href={tool.href}
                    className="inline-flex items-center text-xs font-medium text-zinc-400 transition-colors hover:text-white"
                  >
                    <span>{tool.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              Liens
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex">
                <a
                  href="https://github.com/Randy-R-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  <GitHubIcon />
                  GitHub
                </a>
              </li>
              <li className="flex">
                <a
                  href="https://liflow.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  <ExternalLink size={13} />
                  Liflow
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="w-full overflow-hidden pb-6"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
        }}
      >
        <Image
          src="/brand/wordmark-horizontal.png"
          alt=""
          width={1233}
          height={300}
          className="w-full opacity-[0.06]"
        />
      </div>
    </footer>
  );
}
