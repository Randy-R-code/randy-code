import { HeroText, SeoBlock } from "@/components/hero-text";
import { WorldMap } from "@/components/map/world-map";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 pt-12 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <HeroText />
        <WorldMap />
        <SeoBlock />
      </div>
    </main>
  );
}
