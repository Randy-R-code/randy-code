import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  FlaskConical,
  Globe,
  HardHat,
  Rocket,
  User,
} from "lucide-react";

export interface Zone {
  id: string;
  label: string;
  tagline: string;
  route: string;
  Icon: LucideIcon;
  color: string;
  position: { x: number; y: number };
}

// Centre visuel de la map — point de convergence des connexions
export const HUB = { x: 50, y: 48 };

export const zones: Zone[] = [
  {
    id: "apps",
    label: "Apps Station",
    tagline: "SaaS & applications produit",
    route: "/apps",
    Icon: Rocket,
    color: "#8b5cf6",
    position: { x: 50, y: 12 },
  },
  {
    id: "seo",
    label: "SEO District",
    tagline: "SEO local & sites vitrines",
    route: "/seo",
    Icon: Globe,
    color: "#10b981",
    position: { x: 75, y: 26 },
  },
  {
    id: "projects",
    label: "Projects City",
    tagline: "Projets clients & études de cas",
    route: "/projects",
    Icon: Building2,
    color: "#22d3ee",
    position: { x: 81, y: 56 },
  },
  {
    id: "blog",
    label: "Knowledge Base",
    tagline: "Articles, guides & ressources",
    route: "/blog",
    Icon: BookOpen,
    color: "#f97316",
    position: { x: 64, y: 80 },
  },
  {
    id: "background",
    label: "Background",
    tagline: "Mécanique, électricité & logistique",
    route: "/background",
    Icon: HardHat,
    color: "#94a3b8",
    position: { x: 36, y: 80 },
  },
  {
    id: "about",
    label: "About Base",
    tagline: "Parcours, vision & contact",
    route: "/about",
    Icon: User,
    color: "#ec4899",
    position: { x: 19, y: 56 },
  },
  {
    id: "lab",
    label: "Lab Zone",
    tagline: "IA, prototypes & expérimentations",
    route: "/lab",
    Icon: FlaskConical,
    color: "#f59e0b",
    position: { x: 25, y: 26 },
  },
];

// Connexions hub-centrique (◎ = HUB)
export const connections: Array<[string, string]> = [
  ["apps", "__hub__"],
  ["seo", "__hub__"],
  ["projects", "__hub__"],
  ["blog", "__hub__"],
  ["background", "__hub__"],
  ["about", "__hub__"],
  ["lab", "__hub__"],
];
