import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  FlaskConical,
  Globe,
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
export const HUB = { x: 50, y: 46 };

export const zones: Zone[] = [
  {
    id: "apps",
    label: "Apps Station",
    tagline: "SaaS & applications produit",
    route: "/apps",
    Icon: Rocket,
    color: "#8b5cf6",
    position: { x: 50, y: 11 },
  },
  {
    id: "lab",
    label: "Lab Zone",
    tagline: "IA, prototypes & expérimentations",
    route: "/lab",
    Icon: FlaskConical,
    color: "#f59e0b",
    position: { x: 19, y: 46 },
  },
  {
    id: "seo",
    label: "SEO District",
    tagline: "SEO local & sites vitrines",
    route: "/seo",
    Icon: Globe,
    color: "#10b981",
    position: { x: 79, y: 46 },
  },
  {
    id: "projects",
    label: "Projects City",
    tagline: "Projets clients & études de cas",
    route: "/projects",
    Icon: Building2,
    color: "#22d3ee",
    position: { x: 50, y: 68 },
  },
  {
    id: "about",
    label: "About Base",
    tagline: "Parcours, vision & contact",
    route: "/about",
    Icon: User,
    color: "#ec4899",
    position: { x: 28, y: 88 },
  },
  {
    id: "blog",
    label: "Knowledge Base",
    tagline: "Articles, guides & ressources",
    route: "/blog",
    Icon: BookOpen,
    color: "#f97316",
    position: { x: 71, y: 88 },
  },
];

// Connexions hub-centrique (◎ = HUB)
export const connections: Array<[string, string]> = [
  ["apps", "__hub__"],
  ["lab", "__hub__"],
  ["seo", "__hub__"],
  ["projects", "__hub__"],
  ["projects", "about"],
  ["projects", "blog"],
];
