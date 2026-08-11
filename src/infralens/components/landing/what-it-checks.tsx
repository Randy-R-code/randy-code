import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, FileText, Globe, Network, Shield, Zap } from "lucide-react";

const categories = [
  {
    icon: Shield,
    title: "HTTP & Security",
    description: "Security headers, HTTPS, redirects, security.txt",
    count: 4,
  },
  {
    icon: Globe,
    title: "Network & DNS",
    description: "DNS records, security, IP & hosting",
    count: 3,
  },
  {
    icon: Network,
    title: "Infrastructure",
    description: "WAF & CDN detection",
    count: 1,
  },
  {
    icon: FileText,
    title: "Website Structure",
    description: "robots.txt, sitemap, links",
    count: 3,
  },
  {
    icon: Code,
    title: "Metadata & Stack",
    description: "HTML metadata, social tags, tech stack, accessibility",
    count: 5,
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Response metrics, reachability",
    count: 2,
  },
];

export function WhatItChecks() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 lg:space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            What it checks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 min-[26.25rem]:gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.title}
                className="border-zinc-800 bg-zinc-900/50"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-secondary/10 border border-brand-secondary/20">
                      <Icon className="size-5 text-brand-secondary-hover" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-zinc-400 text-xs mt-0.5">
                        {category.count} check{category.count > 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
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
