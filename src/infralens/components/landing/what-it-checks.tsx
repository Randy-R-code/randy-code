import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CHECK_CATEGORIES } from "@infralens-lib/checks/scoring-config";
import { CheckCategory } from "@infralens-lib/checks/types";
import { Code, FileText, Globe, Network, Shield, Zap } from "lucide-react";

/** Counted from CHECK_CATEGORIES instead of hardcoded, so this can't quietly go stale the way it did once already (still said 18 total after DKIM/DNSSEC split into their own checks). */
function countInCategory(category: CheckCategory): number {
  return Object.values(CHECK_CATEGORIES).filter((c) => c === category).length;
}

const categories = [
  {
    icon: Shield,
    title: "HTTP & Security",
    description: "Security headers, HTTPS, redirects, security.txt",
    count: countInCategory("http-security"),
  },
  {
    icon: Globe,
    title: "Network & DNS",
    description: "DNS records, security, DKIM, DNSSEC, IP & hosting",
    count: countInCategory("network-dns"),
  },
  {
    icon: Network,
    title: "Infrastructure",
    description: "WAF & CDN detection",
    count: countInCategory("infrastructure"),
  },
  {
    icon: FileText,
    title: "Website Structure",
    description: "robots.txt, sitemap, links",
    count: countInCategory("website-structure"),
  },
  {
    icon: Code,
    title: "Metadata & Stack",
    description: "HTML metadata, social tags, tech stack, accessibility",
    count: countInCategory("metadata-stack"),
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Response metrics, reachability",
    count: countInCategory("performance"),
  },
];

export function WhatItChecks() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12 bg-background/50">
      <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 lg:space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            What it checks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 min-[26.25rem]:gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="border-border bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-secondary/10 border border-brand-secondary/20">
                      <Icon className="size-5 text-brand-secondary-hover" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-xs mt-0.5">
                        {category.count} check{category.count > 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
