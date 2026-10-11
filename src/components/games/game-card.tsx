import { brand } from "@/lib/brand";
import { type Game, gameStatusLabel } from "@/lib/games";
import Image from "next/image";
import Link from "next/link";

const color = brand.colors.violet[400];

export function GameCard({ game }: { game: Game }) {
  return (
    <div
      className="flex flex-col rounded-xl border p-6"
      style={{
        borderColor: `${color}30`,
        background: brand.colors.surface[2],
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Image
          src={game.symbol.src}
          alt={game.symbol.alt}
          width={24}
          height={24}
          className="h-6 w-6 rounded-md"
        />
        <span
          className="inline-block w-fit rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {gameStatusLabel(game.status).fr}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white">{game.name}</h3>
      <p className="mt-2 flex-1 text-sm text-zinc-400">{game.summary.fr}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {game.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-md px-2 py-0.5 text-[10px] font-medium text-zinc-300"
            style={{ background: brand.colors.surface[3] }}
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <Link
          href={`/games/${game.slug}`}
          className="text-xs font-medium text-zinc-300 hover:text-white"
        >
          Découvrir le jeu →
        </Link>
      </div>
    </div>
  );
}
