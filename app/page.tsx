import { HeroText, SeoBlock, heroVariants } from "@/components/hero-text";
import { WorldMap } from "@/components/map/world-map";
import { cache } from "react";

export const dynamic = "force-dynamic";

const getVariantIndex = cache(() =>
  Math.floor(Math.random() * heroVariants.length),
);

export default function Home() {
  const variantIndex = getVariantIndex();

  return (
    <main className="flex min-h-screen flex-col px-6 pt-12 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <HeroText variantIndex={variantIndex} />
        <WorldMap />
        <SeoBlock variantIndex={variantIndex} />
      </div>
    </main>
  );
}
