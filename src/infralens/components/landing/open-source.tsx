import { GitHubIcon } from "@infralens-components/github-icon";
import { Button } from "@infralens-components/ui/button";
import { Card, CardContent } from "@infralens-components/ui/card";
import { siteConfig } from "@infralens-config/site-config";
import { Blocks, Scale, Server, Users } from "lucide-react";
import Link from "next/link";

// Master plan §6.4 — MIT license, public repo, modular architecture,
// self-hosting, contributions welcome; the GitHub link must not be hidden
// only in the footer.
const POINTS = [
  {
    icon: Scale,
    title: "MIT licensed",
    description: "Free to use, modify, and redistribute.",
  },
  {
    icon: Blocks,
    title: "Modular architecture",
    description: "Each check is its own module — read exactly how it works.",
  },
  {
    icon: Server,
    title: "Self-hostable",
    description: "Run it on your own infrastructure, no InfraLens account.",
  },
  {
    icon: Users,
    title: "Contributions welcome",
    description: "Issues, pull requests, and ideas are welcome on GitHub.",
  },
];

export function OpenSource() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12 bg-zinc-900/50">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Open source, all the way down
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            The full source is public — read exactly what gets checked, how the
            score is computed, and what leaves your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <Card
                key={point.title}
                className="border-zinc-800 bg-zinc-900/50"
              >
                <CardContent className="flex items-start gap-3 p-6">
                  <div className="p-2 rounded-lg bg-brand-secondary/10 border border-brand-secondary/20 shrink-0">
                    <Icon className="size-5 text-brand-secondary-hover" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-100">{point.title}</p>
                    <p className="text-sm text-zinc-400 mt-0.5">
                      {point.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            asChild
            variant="outline"
            className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
          >
            <Link
              href={siteConfig.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <GitHubIcon size={16} />
              View source on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
