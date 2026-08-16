"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function CTA({
  onAnalyze,
  isLoading,
}: {
  onAnalyze?: (url: string) => void | Promise<void>;
  isLoading?: boolean;
}) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (onAnalyze) {
      // Directly trigger analysis - results will scroll naturally
      void onAnalyze(url);
    } else {
      // Fallback: scroll to hero and trigger form
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroInput = heroSection.querySelector(
          'input[name="url"]',
        ) as HTMLInputElement;
        if (heroInput) {
          heroInput.value = url;
          heroInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
        heroSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setTimeout(() => {
          const heroForm = heroSection.querySelector("form");
          if (heroForm) {
            heroForm.requestSubmit();
          }
        }, 300);
      }
    }
  };

  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        <Card className="border-2 border-border bg-card/50">
          <CardContent className="p-6 md:p-8 lg:p-12">
            <div className="space-y-4 md:space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                  Ready to inspect?
                </h2>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col min-[26.25rem]:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="cta-url-input"
                    name="url"
                    placeholder="https://example.com"
                    type="text"
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10 h-12 text-base bg-background border-border text-foreground focus:border-brand-secondary focus:ring-brand-secondary/30"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="h-12 min-[26.25rem]:px-8 w-full min-[26.25rem]:w-auto border border-brand-accent/40 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent-hover disabled:opacity-50"
                >
                  {isLoading ? "Analyzing..." : "Analyze website"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
