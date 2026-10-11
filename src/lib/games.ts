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
    stores: {},
    privacyReviewed: false,
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
