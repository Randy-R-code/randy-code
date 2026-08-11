import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@infralens-components/ui/card";
import { CircleCheckBig, CircleX, Info, TriangleAlert } from "lucide-react";

const statuses = [
  {
    icon: CircleCheckBig,
    label: "OK",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: TriangleAlert,
    label: "Warning",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: CircleX,
    label: "Error",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: Info,
    label: "Info",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
];

export function HowResults() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-10 lg:space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How results are presented
          </h2>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle>Clear status indicators</CardTitle>
            <CardDescription className="text-zinc-400">
              Instant visual feedback for each check
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 min-[26.25rem]:gap-4">
              {statuses.map((status) => {
                const Icon = status.icon;
                return (
                  <div
                    key={status.label}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${status.bg} ${status.border}`}
                  >
                    <Icon className={`size-4 ${status.color}`} />
                    <span className="text-sm font-medium">{status.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-[26.25rem]:gap-4 md:gap-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Readable tables</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400">
                Structured data presentation for easy scanning
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Actionable information</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400">
                Clear insights to help you make decisions
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
