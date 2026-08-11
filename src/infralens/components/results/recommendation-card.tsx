import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recommendation } from "@infralens-lib/checks/types";
import { cn } from "@infralens-lib/utils";
import { CircleAlert, Info, TriangleAlert } from "lucide-react";
import Link from "next/link";

const severityConfig = {
  info: {
    icon: Info,
    label: "Info",
    className: "text-blue-500 border-blue-500/20 bg-blue-500/10",
  },
  warning: {
    icon: TriangleAlert,
    label: "Warning",
    className: "text-amber-500 border-amber-500/20 bg-amber-500/10",
  },
  critical: {
    icon: CircleAlert,
    label: "Critical",
    className: "text-red-500 border-red-500/20 bg-red-500/10",
  },
};

type RecommendationCardProps = {
  recommendation: Recommendation;
};

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const config = severityConfig[recommendation.severity];
  const Icon = config.icon;

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          <Badge variant="outline" className={cn("border", config.className)}>
            <Icon className="size-3 mr-1.5" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400">{recommendation.description}</p>

        <div>
          <p className="text-sm font-semibold text-zinc-300 mb-1">Impact:</p>
          <p className="text-sm text-zinc-400">{recommendation.impact}</p>
        </div>

        {recommendation.howTo && recommendation.howTo.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-zinc-300 mb-2">
              How to fix:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
              {recommendation.howTo.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendation.references && recommendation.references.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-zinc-300 mb-2">
              References:
            </p>
            <ul className="space-y-1">
              {recommendation.references.map((ref, index) => (
                <li key={index}>
                  <Link
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-secondary-hover hover:text-brand-secondary underline-offset-4 hover:underline"
                  >
                    {ref.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
