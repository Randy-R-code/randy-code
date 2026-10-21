import { ScreenshotRail } from "@/components/screenshot-rail";
import type { Game } from "@/lib/games";
import { LBlock } from "./game-language";

function GameScreenshotRail({ game, lang }: { game: Game; lang: "fr" | "en" }) {
  return (
    <ScreenshotRail
      label={lang === "fr" ? "Captures d'écran" : "Screenshots"}
      shots={game.screenshots.map((shot) => ({
        src: `/games/${game.slug}/screenshots/${lang}/${shot.file}`,
        alt: shot.caption[lang],
      }))}
    />
  );
}

export function GameScreenshots({ game }: { game: Game }) {
  return (
    <LBlock
      fr={<GameScreenshotRail game={game} lang="fr" />}
      en={<GameScreenshotRail game={game} lang="en" />}
    />
  );
}
