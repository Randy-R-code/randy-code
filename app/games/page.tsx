import { GameCard } from "@/components/games/game-card";
import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import { games } from "@/lib/games";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games Arcade — Randy Code",
  description:
    "Les jeux mobiles indépendants de Randy Code. As It Should Be, un puzzle tactile de logique et de réactions en chaîne, est en phase de test.",
  alternates: { canonical: "/games" },
};

const color = brand.colors.violet[400];

export default function GamesPage() {
  return (
    <PageShell
      label="Games Arcade"
      title="Jeux mobiles"
      tagline="Des jeux indépendants, pensés et développés de A à Z. Le premier est en phase de test, d'autres suivront."
      color={color}
      icon="gamepad"
    >
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </PageShell>
  );
}
