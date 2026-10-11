import type { Game } from "@/lib/games";
import Image from "next/image";
import { LBlock } from "./game-language";

function ScreenshotRail({ game, lang }: { game: Game; lang: "fr" | "en" }) {
  return (
    <ul
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 min-[1072px]:mx-0 min-[1072px]:px-0"
      aria-label={lang === "fr" ? "Captures d'écran" : "Screenshots"}
    >
      {game.screenshots.map((shot) => (
        <li key={shot.file} className="w-56 shrink-0 snap-start sm:w-64">
          <Image
            src={`/games/${game.slug}/screenshots/${lang}/${shot.file}`}
            alt={shot.caption[lang]}
            width={540}
            height={1050}
            className="h-auto w-full rounded-2xl border"
            style={{ borderColor: "var(--border-subtle)" }}
          />
        </li>
      ))}
    </ul>
  );
}

export function GameScreenshots({ game }: { game: Game }) {
  return (
    <LBlock
      fr={<ScreenshotRail game={game} lang="fr" />}
      en={<ScreenshotRail game={game} lang="en" />}
    />
  );
}
