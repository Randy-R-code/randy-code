import {
  GameLanguageProvider,
  L,
  LanguageSwitch,
} from "@/components/games/game-language";
import { brand } from "@/lib/brand";
import { gameStatusLabel, getGame } from "@/lib/games";
import { buildVideoGameSchema } from "@/lib/json-ld";
import { ArrowLeft, ImageIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const game = getGame("as-it-should-be");
const color = brand.colors.violet[400];

export const metadata: Metadata = {
  title: "As It Should Be — Puzzle mobile | Randy Code",
  description:
    "As It Should Be est un puzzle mobile de logique : placer quelques pièces, lancer la réaction en chaîne et atteindre chaque cible. Huit mondes de 25 niveaux, en phase de test.",
  alternates: { canonical: "/games/as-it-should-be" },
  openGraph: {
    title: "As It Should Be — Puzzle mobile",
    description:
      "Placer les pièces, lancer la réaction. Un puzzle tactile de logique, en phase de test.",
    url: "/games/as-it-should-be",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "As It Should Be — Puzzle mobile",
    description:
      "Placer les pièces, lancer la réaction. Un puzzle tactile de logique, en phase de test.",
  },
};

const steps = [
  {
    fr: "Observer le plateau : des rails, des sources qui libèrent des billes, des cibles à atteindre.",
    en: "Study the board: rails, sources that release balls, targets to reach.",
  },
  {
    fr: "Glisser des pièces dans les cases libres, toucher une pièce posée pour la faire pivoter.",
    en: "Drag parts into free cells, tap a placed part to rotate it.",
  },
  {
    fr: "Appuyer sur RUN et regarder toute la simulation se dérouler.",
    en: "Press RUN and watch the whole simulation play out.",
  },
  {
    fr: "Réussir, ou ajuster et relancer.",
    en: "Succeed, or adjust and run again.",
  },
];

const parts = [
  {
    name: { fr: "Virage", en: "Turn" },
    desc: {
      fr: "Dévie une bille d'un quart de tour.",
      en: "Turns a ball by a quarter turn.",
    },
  },
  {
    name: { fr: "Séparateur", en: "Split" },
    desc: {
      fr: "Sépare une bille en deux, une de chaque côté.",
      en: "Splits a ball in two, one to each side.",
    },
  },
  {
    name: { fr: "Délai", en: "Delay" },
    desc: {
      fr: "Retient une bille un temps de plus pour garder deux billes à distance.",
      en: "Holds a ball one step longer to keep two balls apart.",
    },
  },
  {
    name: { fr: "Synchro", en: "Sync" },
    desc: {
      fr: "Pièce fixe : attend deux billes simultanées, puis en renvoie une.",
      en: "Fixed part: waits for two simultaneous balls, then sends out one.",
    },
  },
  {
    name: { fr: "Portes et plaques", en: "Gates and plates" },
    desc: {
      fr: "Une porte fermée arrête la bille ; une plaque change les portes qui partagent son symbole.",
      en: "A closed gate stops the ball; a plate changes the gates sharing its symbol.",
    },
  },
  {
    name: { fr: "Cases réservées", en: "Reserved cells" },
    desc: {
      fr: "Une case libre qui n'accepte que certaines pièces.",
      en: "A free cell that only accepts certain parts.",
    },
  },
];

const worlds = [
  { fr: "Premiers pas", en: "First steps" },
  { fr: "Aiguillages", en: "Junctions" },
  { fr: "Rythme", en: "Rhythm" },
  { fr: "Synchro", en: "Sync" },
  { fr: "Portes", en: "Gates" },
  { fr: "Circuits", en: "Circuits" },
  { fr: "Contraintes", en: "Constraints" },
  { fr: "Maîtrise", en: "Mastery" },
];

function Section({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 text-xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

export default function AsItShouldBePage() {
  if (!game) notFound();
  const status = gameStatusLabel(game.status);

  return (
    <GameLanguageProvider>
      <main className="flex-1 px-6 pt-8 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildVideoGameSchema(game)),
          }}
        />
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/games"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
            >
              <ArrowLeft size={12} />
              <L fr="Games Arcade" en="Games Arcade" />
            </Link>
            <LanguageSwitch color={color} />
          </div>

          <header
            className="relative mt-8 overflow-hidden rounded-2xl border"
            style={{ borderColor: `${color}30` }}
          >
            <Image
              src={game.banner.src}
              alt=""
              width={game.banner.width}
              height={game.banner.height}
              priority
              className="h-auto w-full"
            />
          </header>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: `${color}18`, color }}
              >
                <L fr={status.fr} en={status.en} />
              </span>
              <span className="text-xs text-zinc-400">
                <L fr={game.genre.fr} en={game.genre.en} />
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {game.name}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300">
              <L
                fr="Un puzzle de logique pour préparer une réaction en chaîne. On étudie le plateau, on place quelques pièces, on lance la machine : chaque bille doit atteindre une cible, et moins on utilise de pièces, plus on se rapproche du par du niveau."
                en="A logic puzzle about preparing a chain reaction. Study the board, place a few parts, run the machine: every ball must reach a target, and the fewer parts you use, the closer you get to the level's par."
              />
            </p>
          </div>

          <Section title={<L fr="Le principe" en="How it plays" />}>
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-zinc-400">
              <L
                fr="Le joueur ne vise jamais et ne contrôle jamais une bille en mouvement. Il prépare, puis observe."
                en="The player never aims and never controls a ball in motion. You prepare, then you watch."
              />
            </p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {steps.map((step, i) => (
                <li
                  key={step.en}
                  className="flex gap-4 rounded-xl border p-4"
                  style={{
                    borderColor: `${color}20`,
                    background: brand.colors.surface[2],
                  }}
                >
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    <L fr={step.fr} en={step.en} />
                  </p>
                </li>
              ))}
            </ol>
          </Section>

          <Section title={<L fr="Les pièces" en="The parts" />}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {parts.map((part) => (
                <div
                  key={part.name.en}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: "var(--border-subtle)",
                    background: brand.colors.surface[1],
                  }}
                >
                  <h3 className="text-sm font-semibold text-white">
                    <L fr={part.name.fr} en={part.name.en} />
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                    <L fr={part.desc.fr} en={part.desc.en} />
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 max-w-2xl text-xs leading-relaxed text-zinc-500">
              <L
                fr="Deux billes ne peuvent jamais partager une case ni se croiser de face. Un guide intégré présente chaque pièce au fil de la progression."
                en="Two balls may never share a cell nor cross head-on. An in-game guide introduces each part as you meet it."
              />
            </p>
          </Section>

          <Section
            title={
              <L fr="Huit mondes, 200 niveaux" en="Eight worlds, 200 levels" />
            }
          >
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {worlds.map((world, i) => (
                <li
                  key={world.en}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: `${color}18`,
                    background: brand.colors.surface[2],
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 text-sm font-medium text-white">
                    <L fr={world.fr} en={world.en} />
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    <L
                      fr={`${game.levelsPerWorld} niveaux`}
                      en={`${game.levelsPerWorld} levels`}
                    />
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
              <L
                fr="Dans chaque monde, les niveaux 1 à 22 s'enchaînent dans l'ordre. Les niveaux 23 et 24 sont des défis optionnels, le 25 est le final. Le monde suivant s'ouvre en réussissant le final, sans jamais exiger les défis."
                en="Within each world, levels 1 to 22 are played in order. Levels 23 and 24 are optional expert challenges, and level 25 is the finale. The next world opens once the finale is solved, never requiring the experts."
              />
            </p>
          </Section>

          <Section title={<L fr="Caractéristiques" en="Features" />}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  fr: "Entièrement déterministe : le même placement donne toujours le même résultat.",
                  en: "Fully deterministic: the same placement always gives the same result.",
                },
                {
                  fr: "Un par par niveau : le nombre minimal de pièces, démontré par recherche exhaustive.",
                  en: "A par for every level: the minimum number of parts, proven by exhaustive search.",
                },
                {
                  fr: "Un thème visuel propre à chaque monde.",
                  en: "One visual theme per world.",
                },
                {
                  fr: "Jeu bilingue français et anglais.",
                  en: "Bilingual game, French and English.",
                },
              ].map((feature) => (
                <li
                  key={feature.en}
                  className="rounded-xl border p-4 text-sm leading-relaxed text-zinc-300"
                  style={{
                    borderColor: "var(--border-subtle)",
                    background: brand.colors.surface[1],
                  }}
                >
                  <L fr={feature.fr} en={feature.en} />
                </li>
              ))}
            </ul>
          </Section>

          <Section title={<L fr="Captures d'écran" en="Screenshots" />}>
            <div
              className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center"
              style={{ borderColor: `${color}30` }}
            >
              <ImageIcon size={20} aria-hidden="true" style={{ color }} />
              <p className="text-sm text-zinc-400">
                <L
                  fr="Les captures arriveront avec la prochaine version de test."
                  en="Screenshots will come with the next test build."
                />
              </p>
            </div>
          </Section>

          <Section title={<L fr="Disponibilité" en="Availability" />}>
            <div
              className="flex flex-col gap-3 rounded-xl border p-6"
              style={{
                borderColor: `${color}30`,
                background: brand.colors.surface[2],
              }}
            >
              <p className="text-sm leading-relaxed text-zinc-300">
                <L
                  fr="As It Should Be est en phase de test. Il est prévu sur Google Play, puis éventuellement sur l'App Store. Aucune date de sortie n'est annoncée pour le moment."
                  en="As It Should Be is in testing. It is planned for Google Play, and possibly the App Store afterwards. No release date has been announced yet."
                />
              </p>
              <p className="text-xs font-medium" style={{ color }}>
                <L fr="Google Play — bientôt" en="Google Play — coming soon" />
              </p>
            </div>
          </Section>

          <footer
            className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs text-zinc-400"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <p>
              <L fr="Développé par " en="Developed by " />
              <Link href="/" className="text-zinc-300 hover:text-white">
                Randy Code
              </Link>
            </p>
            <Link
              href="/games/as-it-should-be/privacy"
              className="transition-colors hover:text-white"
            >
              <L fr="Politique de confidentialité" en="Privacy policy" />
            </Link>
          </footer>
        </div>
      </main>
    </GameLanguageProvider>
  );
}
