export interface Localized {
  fr: string;
  en: string;
}

export interface Game {
  slug: string;
  name: string;
  status: "testing";
  tagline: Localized;
  summary: Localized;
  genre: Localized;
  worlds: number;
  levelsPerWorld: number;
  symbol: { src: string; alt: string };
  technologies: string[];
  banner: { src: string; width: number; height: number };
  screenshots: { file: string; caption: Localized }[];
  stores: { googlePlay?: string; appStore?: string };
  privacyReviewed: boolean;
}

export const games: Game[] = [
  {
    slug: "as-it-should-be",
    name: "As It Should Be",
    status: "testing",
    tagline: {
      fr: "Placer les pièces, lancer la réaction.",
      en: "Place the parts, run the reaction.",
    },
    summary: {
      fr: "Un puzzle tactile de logique et de trajectoires : on prépare une réaction en chaîne, puis on regarde la machine se dérouler.",
      en: "A tactile logic and trajectory puzzle: set up a chain reaction, then watch the machine play out.",
    },
    genre: { fr: "Puzzle de logique", en: "Logic puzzle" },
    worlds: 8,
    levelsPerWorld: 25,
    symbol: { src: "/games/as-it-should-be/symbol.png", alt: "" },
    technologies: ["React Native", "Expo", "TypeScript"],
    banner: {
      src: "/games/as-it-should-be/banner.jpg",
      width: 1932,
      height: 814,
    },
    screenshots: [
      {
        file: "01-gameplay.webp",
        caption: { fr: "Chaque pièce compte.", en: "Every piece matters." },
      },
      {
        file: "02-place-pieces.webp",
        caption: {
          fr: "Observez. Placez. Résolvez.",
          en: "Observe. Place. Solve.",
        },
      },
      {
        file: "03-timing.webp",
        caption: {
          fr: "Le timing change tout.",
          en: "Timing changes everything.",
        },
      },
      {
        file: "04-synchronization.webp",
        caption: {
          fr: "Tout doit s'aligner.",
          en: "Everything must align.",
        },
      },
      {
        file: "05-gates.webp",
        caption: {
          fr: "Déclenchez la bonne réaction.",
          en: "Trigger the right reaction.",
        },
      },
      {
        file: "06-worlds.webp",
        caption: { fr: "8 mondes à explorer.", en: "8 worlds to explore." },
      },
      {
        file: "07-expert.webp",
        caption: {
          fr: "Repoussez votre logique.",
          en: "Push your logic further.",
        },
      },
      {
        file: "08-victory.webp",
        caption: {
          fr: "La satisfaction du déclic.",
          en: "The satisfaction of solving.",
        },
      },
    ],
    stores: {},
    privacyReviewed: true,
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function gameStatusLabel(status: Game["status"]): Localized {
  const labels: Record<Game["status"], Localized> = {
    testing: { fr: "En phase de test", en: "In testing" },
  };
  return labels[status];
}
